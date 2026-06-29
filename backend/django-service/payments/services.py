import logging
from django.db import transaction
from django.utils import timezone

from .models import (
    Payment, PaymentOrder, CommissionRule,
    Commission, CourseDiscount
)
from courses.models import Enrollment
from students.models import Student

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# PRICE CALCULATION
# ─────────────────────────────────────────────

def calculate_order_item_price(course_price, negotiation_paise=0):
    """
    Calculates final price for one cart item.

    Rules:
    - base price comes from CoursePrice.amount_paise
    - public discount comes from active CourseDiscount if any
    - negotiation discount is entered by sales exec, validated against limits
    - final = base - public_discount - negotiation_discount
    - final cannot go below course_price.min_final_price_paise
    - final cannot be zero or negative

    Returns dict:
    {
        base_amount_paise:  int,
        discount_paise:     int,
        negotiation_paise:  int,
        final_amount_paise: int,
    }
    """
    base = course_price.amount_paise

    # get active public discount for this course
    now = timezone.now()

    # first try time-bound discount
    discount_obj = CourseDiscount.objects.filter(
        course=course_price.course,
        is_active=True,
        starts_at__lte=now,
        ends_at__gte=now,
    ).order_by('-discount_paise').first()

    # fallback to always-on discount (no date range)
    if not discount_obj:
        discount_obj = CourseDiscount.objects.filter(
            course=course_price.course,
            is_active=True,
            starts_at__isnull=True,
            ends_at__isnull=True,
        ).order_by('-discount_paise').first()

    public_discount = discount_obj.discount_paise if discount_obj else 0
    public_discount = min(public_discount, base)

    # validate negotiation
    if negotiation_paise < 0:
        raise ValueError("Negotiation discount cannot be negative")

    if negotiation_paise > course_price.max_negotiation_paise:
        raise ValueError(
            f"Negotiation ₹{negotiation_paise // 100} exceeds maximum allowed "
            f"₹{course_price.max_negotiation_paise // 100}"
        )

    final = base - public_discount - negotiation_paise

    # enforce floor price
    if final < course_price.min_final_price_paise:
        raise ValueError(
            f"Final price ₹{final // 100} is below minimum allowed "
            f"₹{course_price.min_final_price_paise // 100}"
        )

    if final <= 0:
        raise ValueError("Final price cannot be zero or negative")

    return {
        'base_amount_paise':  base,
        'discount_paise':     public_discount,
        'negotiation_paise':  negotiation_paise,
        'final_amount_paise': final,
    }


# ─────────────────────────────────────────────
# PROCESS SUCCESSFUL PAYMENT
# ─────────────────────────────────────────────

def process_successful_payment(
    *,
    razorpay_order_id,
    razorpay_payment_id,
    signature,
    amount_paise,
    method='',
    user=None,
):
    """
    Idempotent payment processor.
    Called by both verify_payment view and razorpay_webhook view.
    Safe to call multiple times — will not create duplicates.

    Returns one of:
        "success"           — processed ok
        "already_processed" — payment already exists, skip
        "order_not_found"   — no matching order
        "expired"           — order expired
    """

    # ── ATOMIC BLOCK ──────────────────────────────────────────────────────────
    # Everything from Payment creation → Enrollment creation → Commission
    # all happens in one DB transaction.
    # If anything fails mid-way, everything rolls back — no partial state.
    with transaction.atomic():

        # 1. Idempotency — skip if already processed
        if Payment.objects.filter(razorpay_payment_id=razorpay_payment_id).exists():
            logger.info(f"Payment already processed: {razorpay_payment_id}")
            return "already_processed"

        # 2. Fetch order — lock the row to prevent race conditions
        #    select_for_update() means if two requests hit simultaneously,
        #    the second one waits until the first transaction completes
        try:
            order = PaymentOrder.objects.select_for_update().get(
                razorpay_order_id=razorpay_order_id
            )
        except PaymentOrder.DoesNotExist:
            logger.error(f"Order not found for razorpay_order_id: {razorpay_order_id}")
            return "order_not_found"

        # 3. Check expiry
        if order.expires_at < timezone.now():
            order.status = 'expired'
            order.save()
            logger.warning(f"Order expired: {order.id}")
            return "expired"

        # 4. Create Payment record
        payment = Payment.objects.create(
            order=order,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=signature,
            amount_paise=amount_paise,
            status='captured',
            captured_at=timezone.now(),
            method=method,
        )

        # 5. Mark order as paid
        order.status = 'paid'
        order.save()

        # 6. Resolve student
        if user:
            try:
                student = Student.objects.get(user=user)
            except Student.DoesNotExist:
                raise Exception(f"Student profile not found for user {user.id}")
        else:
            # webhook path — no user in context, get from order
            try:
                student = Student.objects.get(user=order.student)
            except Student.DoesNotExist:
                raise Exception(f"Student profile not found for order student {order.student_id}")

        # 7. Create enrollments for each item in the order
        for item in order.items.select_related('course').all():

            enrollment, created = Enrollment.objects.get_or_create(
                student=student,
                course=item.course,
                defaults={
                    'order': order,
                    'price_paid': item.final_amount_paise,
                    'is_active': True,
                    'total_modules': item.course.modules.count(),
                }
            )

            # if enrollment already existed but was inactive (previous refund)
            # reactivate it with new order details
            if not created and not enrollment.is_active:
                enrollment.is_active = True
                enrollment.order = order
                enrollment.price_paid = item.final_amount_paise
                enrollment.save()
                logger.info(f"Reactivated enrollment for student {student.id} course {item.course.id}")
            elif created:
                logger.info(f"Created enrollment for student {student.id} course {item.course.id}")

            # 8. Commission — only if order has attributed sales exec
            if order.sales_exec:
                rate = CommissionRule.get_rate_for_course(item.course)
                if rate:
                    # commission on final_amount_paise — not base price
                    # exec should not earn commission on discount they themselves gave
                    commission_amt = int(item.final_amount_paise * rate / 100)

                    commission, comm_created = Commission.objects.get_or_create(
                        order_item=item,
                        payment=payment,
                        defaults={
                            'sales_exec': order.sales_exec,
                            'percentage': rate,
                            'amount_paise': commission_amt,
                            'status': 'pending',
                        }
                    )

                    if comm_created:
                        logger.info(
                            f"Commission created: ₹{commission_amt // 100} "
                            f"for {order.sales_exec.username} "
                            f"on course {item.course_title_snapshot}"
                        )
    # ── END ATOMIC BLOCK ──────────────────────────────────────────────────────

    logger.info(
        f"Payment processed successfully: {razorpay_payment_id} "
        f"order {razorpay_order_id} ₹{amount_paise // 100}"
    )
    return "success"