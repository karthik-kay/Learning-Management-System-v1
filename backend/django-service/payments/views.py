import logging
import razorpay
import hmac
import hashlib
import json
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    CoursePrice, PaymentOrder, PaymentOrderItem,
    Payment, SalesLink
)
from .services import process_successful_payment, calculate_order_item_price
from courses.models import Course, CourseProduct, Enrollment
from students.models import Student

logger = logging.getLogger(__name__)

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# ─────────────────────────────────────────────
# CREATE ORDER
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    print("KEY:", settings.RAZORPAY_KEY_ID)
    print("SECRET:", settings.RAZORPAY_KEY_SECRET)
    """
    Expects:
    {
        "items": [
            {
                "course_id": 1,
                "negotiation_paise": 5000   // optional, sales exec only
            }
        ],
        "sales_link_token": "uuid"          // optional, if student used a sales link
    }
    """
    items = request.data.get('items', [])
    sales_link_token = request.data.get('sales_link_token')

    if not items:
        return Response({'error': 'Cart is empty'}, status=400)

    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({'error': 'Student profile not found'}, status=400)

    # resolve sales exec from link token if provided
    attributed_exec = None
    if sales_link_token:
        try:
            sales_link = SalesLink.objects.get(
                token=sales_link_token,
                is_active=True,
                expires_at__gt=timezone.now()
            )
            attributed_exec = sales_link.sales_exec
        except SalesLink.DoesNotExist:
            return Response({'error': 'Invalid or expired sales link'}, status=400)

    # if request is from a sales exec directly (not via link)
    if not attributed_exec and request.user.has_role('sales_exec', 'sales_admin'):
        attributed_exec = request.user

    order_items = []
    total_paise = 0
    course_ids_seen = set()
    auto_enrolled_courses = []

    for item in items:
        course_id = item.get('course_id')
        negotiation_paise = item.get('negotiation_paise', 0)

        # duplicate in cart
        if course_id in course_ids_seen:
            return Response({'error': 'Duplicate course in cart'}, status=400)
        course_ids_seen.add(course_id)

        try:
            product = CourseProduct.objects.select_related("course").get(
                course_id=course_id,
                is_published=True,
                course__is_active=True,
            )
            course = product.course
        except CourseProduct.DoesNotExist:
            return Response({'error': f'Course {course_id} not found'}, status=400)

        # already enrolled and active
        if Enrollment.objects.filter(student=student, course=course, is_active=True).exists():
            return Response({'error': f'Already enrolled in {course.title}'}, status=400)

        # free course — auto-enroll instantly, skip payment
        if product.is_free:
            Enrollment.objects.get_or_create(
                student=student,
                course=course,
                defaults={
                    'is_active': True,
                    'total_modules': course.modules.count(),
                    'price_paid': 0,
                }
            )
            auto_enrolled_courses.append(course.title)
            logger.info(f"Auto-enrolled student {student.user.id} in free course {course.id}")
            continue

        # get active price
        try:
            course_price = CoursePrice.objects.get(course=course, is_active=True)
        except CoursePrice.DoesNotExist:
            return Response({'error': f'No active price for {course.title}'}, status=400)

        # only sales exec/admin can apply negotiation discount
        if negotiation_paise > 0 and not request.user.has_role('sales_exec', 'sales_admin'):
            return Response(
                {'error': 'Only sales executives can apply negotiation discounts'},
                status=403
            )

        # calculate final price with all discounts
        try:
            pricing = calculate_order_item_price(course_price, negotiation_paise)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

        order_items.append({
            'course': course,
            'course_price': course_price,
            'course_title_snapshot': course.title,
            **pricing,
        })
        total_paise += pricing['final_amount_paise']

    # all items were free
    if total_paise == 0 and auto_enrolled_courses:
        return Response({
            'status': 'success',
            'message': f'Enrolled in free courses: {", ".join(auto_enrolled_courses)}',
            'auto_enrolled': auto_enrolled_courses,
        })

    # mixed cart — some free, some paid
    if not order_items and auto_enrolled_courses:
        return Response({
            'status': 'success',
            'message': f'All courses were free. Enrolled in: {", ".join(auto_enrolled_courses)}',
            'auto_enrolled': auto_enrolled_courses,
        })

    # create Razorpay order
    try:
        razorpay_order = client.order.create({
            'amount': total_paise,
            'currency': 'INR',
            'payment_capture': 1,
        })
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {str(e)}")
        return Response({'error': 'Payment gateway error', 'detail': str(e)}, status=500)

    # save to DB atomically
    # ── ATOMIC BLOCK ──────────────────────────────────────────────────────────
    # Everything inside here either ALL succeeds or ALL rolls back.
    # If PaymentOrderItem creation fails halfway, the PaymentOrder is also
    # rolled back — no orphaned orders in the DB.
    with transaction.atomic():
        order = PaymentOrder.objects.create(
            student=request.user,
            razorpay_order_id=razorpay_order['id'],
            amount_paise=total_paise,
            currency='INR',
            status='created',
            expires_at=timezone.now() + timedelta(minutes=15),
            sales_exec=attributed_exec,
        )

        for oi in order_items:
            PaymentOrderItem.objects.create(
                order=order,
                course=oi['course'],
                course_price=oi['course_price'],
                course_title_snapshot=oi['course_title_snapshot'],
                base_amount_paise=oi['base_amount_paise'],
                discount_paise=oi['discount_paise'],
                negotiation_paise=oi['negotiation_paise'],
                final_amount_paise=oi['final_amount_paise'],
            )

        # mark sales link as used
        if sales_link_token and attributed_exec:
            SalesLink.objects.filter(token=sales_link_token).update(
                used_at=timezone.now(),
                is_active=False,
            )
    # ── END ATOMIC BLOCK ──────────────────────────────────────────────────────

    logger.info(f"Created order {order.id} for user {request.user.id}, total ₹{total_paise // 100}")

    return Response({
        'order_id': razorpay_order['id'],
        'amount': total_paise,
        'currency': 'INR',
        'key_id': settings.RAZORPAY_KEY_ID,
        'payment_order_id': order.id,
        'auto_enrolled': auto_enrolled_courses,
    })


# ─────────────────────────────────────────────
# VERIFY PAYMENT
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Called by frontend after Razorpay modal completes.
    Expects:
    {
        "razorpay_order_id":   "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "razorpay_signature":  "xxx"
    }
    """
    razorpay_order_id   = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature  = request.data.get('razorpay_signature')

    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
        return Response({'error': 'Missing payment fields'}, status=400)

    try:
        order = PaymentOrder.objects.get(
            razorpay_order_id=razorpay_order_id,
            student=request.user
        )
    except PaymentOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    # check expiry before anything else
    if order.expires_at < timezone.now():
        order.status = 'expired'
        order.save()
        logger.warning(f"Expired order verify attempt: {order.id}")
        return Response({'error': 'Order expired, please start again'}, status=400)

    # idempotency — already processed
    if order.status == 'paid' or Payment.objects.filter(
        razorpay_payment_id=razorpay_payment_id
    ).exists():
        logger.info(f"Duplicate verify attempt for payment: {razorpay_payment_id}")
        return Response({'status': 'already_paid'}, status=200)

    # verify Razorpay signature
    msg = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, razorpay_signature):
        logger.warning(f"Invalid signature for order {razorpay_order_id}")
        return Response({'error': 'Invalid payment signature'}, status=400)

    # process payment
    try:
        result = process_successful_payment(
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            signature=razorpay_signature,
            amount_paise=order.amount_paise,
            user=request.user,
        )

        if result == 'already_processed':
            return Response({'status': 'already_paid'}, status=200)

        if result == 'expired':
            return Response({'error': 'Order expired'}, status=400)

        if result == 'order_not_found':
            return Response({'error': 'Order not found'}, status=404)

        logger.info(f"Payment verified successfully: {razorpay_payment_id}")
        return Response({
            'status': 'success',
            'message': 'Payment successful. Enrollment activated.',
        })

    except Exception as e:
        logger.error(f"Payment processing failed for {razorpay_payment_id}: {str(e)}")
        return Response({'error': 'Payment processing failed'}, status=500)


# ─────────────────────────────────────────────
# WEBHOOK (SAFETY NET)
# ─────────────────────────────────────────────

@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def razorpay_webhook(request):
    """
    Razorpay fires this for payment events.
    Safety net — handles cases where student closed browser before verify ran.
    Always return 200 fast. Process in Celery in production.
    """
    payload      = request.body
    received_sig = request.headers.get('X-Razorpay-Signature', '')
    webhook_secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', None)

    if webhook_secret:
        expected = hmac.new(
            webhook_secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, received_sig):
            logger.warning("Webhook: invalid signature")
            return Response(status=400)

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        return Response(status=400)

    event_type = event.get('event')
    logger.info(f"Webhook received: {event_type}")

    if event_type == 'payment.captured':
        entity              = event['payload']['payment']['entity']
        razorpay_payment_id = entity['id']
        razorpay_order_id   = entity['order_id']

        # idempotency — skip if verify already handled it
        if Payment.objects.filter(razorpay_payment_id=razorpay_payment_id).exists():
            logger.info(f"Webhook: already processed {razorpay_payment_id}")
            return Response(status=200)

        try:
            process_successful_payment(
                razorpay_order_id=razorpay_order_id,
                razorpay_payment_id=razorpay_payment_id,
                signature='webhook',
                amount_paise=entity.get('amount', 0),
                method=entity.get('method', ''),
                user=None,  # webhook has no user context — service handles it
            )
            logger.info(f"Webhook: processed payment {razorpay_payment_id}")

        except Exception as e:
            logger.error(f"Webhook: processing failed for {razorpay_payment_id}: {str(e)}")
            # return 500 so Razorpay retries
            return Response(status=500)

    elif event_type == 'payment.failed':
        order_id = event['payload']['payment']['entity'].get('order_id')
        if order_id:
            PaymentOrder.objects.filter(
                razorpay_order_id=order_id,
                status='created'
            ).update(status='failed')
            logger.info(f"Webhook: order marked failed {order_id}")

    elif event_type == 'refund.processed':
        refund_id  = event['payload']['refund']['entity']['id']
        from .models import Refund
        Refund.objects.filter(
            razorpay_refund_id=refund_id,
            status='processing'
        ).update(status='processed')
        logger.info(f"Webhook: refund processed {refund_id}")

    # always 200 to Razorpay
    return Response(status=200)


# ─────────────────────────────────────────────
# SALES LINK GENERATION (sales exec only)
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_sales_link(request):
    """
    Sales exec generates a shareable link for a course.
    Expects: { "course_id": 1, "lead_id": 5, "expires_hours": 48 }
    """
    if not request.user.has_role('sales_exec', 'sales_admin', 'sales_manager'):
        return Response({'error': 'Not authorized'}, status=403)

    course_id     = request.data.get('course_id')
    lead_id       = request.data.get('lead_id')
    expires_hours = request.data.get('expires_hours', 48)

    try:
        product = CourseProduct.objects.select_related("course").get(
            course_id=course_id,
            is_published=True,
            course__is_active=True,
        )
        course = product.course
    except CourseProduct.DoesNotExist:
        return Response({'error': 'Course not found'}, status=400)

    lead = None
    if lead_id:
        try:
            from sales.models import Lead
            lead = Lead.objects.get(id=lead_id)
        except Exception:
            return Response({'error': 'Lead not found'}, status=400)

    sales_link = SalesLink.objects.create(
        sales_exec=request.user,
        course=course,
        lead=lead,
        expires_at=timezone.now() + timedelta(hours=expires_hours),
    )

    # build shareable URL — frontend handles the token
    link_url = f"{settings.FRONTEND_URL}/courses/{course.slug}?ref={sales_link.token}"

    logger.info(f"Sales link generated by {request.user.username} for course {course.id}")

    return Response({
        'token': str(sales_link.token),
        'link': link_url,
        'course': course.title,
        'expires_at': sales_link.expires_at,
    })


# ─────────────────────────────────────────────
# PAYMENT HISTORY (student)
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """
    Returns all paid orders for the logged-in student.
    """
    orders = PaymentOrder.objects.filter(
        student=request.user,
        status='paid'
    ).prefetch_related('items__course', 'payments').order_by('-created_at')

    data = []
    for order in orders:
        data.append({
            'order_id': order.razorpay_order_id,
            'amount': order.amount_paise,
            'currency': order.currency,
            'paid_at': order.payments.first().captured_at if order.payments.exists() else None,
            'items': [
                {
                    'course': item.course_title_snapshot,
                    'base_price': item.base_amount_paise,
                    'discount': item.discount_paise,
                    'negotiation': item.negotiation_paise,
                    'paid': item.final_amount_paise,
                }
                for item in order.items.all()
            ],
        })

    return Response({'orders': data})
