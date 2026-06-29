from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketMessageViewSet

router = DefaultRouter()
router.register(r'messages', TicketMessageViewSet, basename='ticket-messages')
router.register(r'', TicketViewSet, basename='tickets')

urlpatterns = router.urls