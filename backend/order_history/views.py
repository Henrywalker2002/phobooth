from base.views import BaseGenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from order_history.models import OrderHistory, OrderHistoryStatusChoices
from order_history.serializers import OrderHistorySummarySerializer, UpdateOrderHistorySerializer
from order_history.permissions import OrderHistoryPermission
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from order.models import OrderItemStatusChoice


class OrderHistoryViewSet(BaseGenericViewSet, ListModelMixin, UpdateModelMixin):
    
    queryset = OrderHistory.objects.all()
    serializer_class = {"list": OrderHistorySummarySerializer, "default": UpdateOrderHistorySerializer}
    permission_classes = (OrderHistoryPermission,)
    filterset_fields = ['order', 'status']
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if serializer.validated_data.get('status') == OrderHistoryStatusChoices.REJECTED:
            # send mail and add notification for studio 
            order_item = instance.order_item 
            if order_item:
                order_item.status = OrderItemStatusChoice.REJECTED
                order_item.denied_reason = serializer.validated_data.get('denied_reason')
                order_item.save()
        
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)