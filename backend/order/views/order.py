from base.views import BaseModelViewSet
from order.models import Order, OrderItem, OrderStatusChoice
from order.serializers.order import (
    CreateOrderSerializer, ReadOrderSerializer, 
    UpdateOrderSerializer, OrderSummarySerializer)
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from order.permission import OrderPermission
from base.exceptions import MethodNotAllowed
import datetime
from notification.execute import NotificationService
from address.models import Address
from order.filter import OrderFilter


class OrderViewSet(BaseModelViewSet):
    queryset = Order.objects.all()
    serializer_class = {"create": CreateOrderSerializer, "list": OrderSummarySerializer, "update": UpdateOrderSerializer, "default": ReadOrderSerializer, "partial_update": UpdateOrderSerializer,
                        "list_order_of_studio": OrderSummarySerializer, "retrieve": ReadOrderSerializer}
    permission_classes = [OrderPermission]
    filterset_class = OrderFilter   
    search_fields = ["@studio__code_name", "@studio__friendly_name", "@order_item__item__name", "@order_item__item__description"]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user).order_by("-created_at")
        elif self.action == "list_order_of_studio":
            return self.queryset.filter(studio=self.request.user.studio).order_by("-created_at")
        return super().get_queryset()

    @transaction.atomic
    def create(self, request, *kawrgs, **kwargs):
        request.data['customer'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_item = serializer.validated_data.pop('order_item')
        address = serializer.validated_data.pop('address')
        studio = order_item[0]['item'].studio
        # create order
        serializer.validated_data['studio'] = studio
        self.perform_create(serializer)
        order = serializer.instance
        # create address 
        if address:
            address = Address(**address)
            if address != request.user.address:
                address.save()
                order.address = address
                order.save()        
                if not request.user.address:
                    user = request.user 
                    user.address = address
                    user.save()
        else :
            if request.user.address:
                order.address = request.user.address
                order.save()
        
        # create order item

        OrderItem.objects.bulk_create(
            [OrderItem(order=order, **item) for item in order_item])

        # create notification
        NotificationService.user_create_order(order)
        data = self.get_serializer(order, is_get=True).data
        return Response(data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data = request.data, partial =partial)
        serializer.is_valid(raise_exception = True)
        if serializer.validated_data.get('status') == OrderStatusChoice.COMPLETED:
            serializer.validated_data['finish_date'] = datetime.date.today().strftime("%Y-%m-%d")
            # create notification
            NotificationService.studio_completed_order(instance)
        
        if serializer.validated_data.get('status') == OrderStatusChoice.IN_PROCESS:
            NotificationService.studio_accept_order(instance)
        elif serializer.validated_data.get('status') == OrderStatusChoice.CANCELED:
            if request.user == instance.customer:
                NotificationService.user_cancel_order(instance)
            else :
                NotificationService.studio_deny_order(instance)
        
        address = serializer.validated_data.pop('address', None)
        self.perform_update(serializer)    
        order = serializer.instance
        if address:
            address = Address(**address)
            if address != request.user.address:
                address.save()
                order.address = address
                order.save()        
                if not request.user.address:
                    user = request.user 
                    user.address = address
                    user.save()
        else :
            if request.user.address:
                order.address = request.user.address
                order.save()
        
        serializer_return = self.get_serializer(instance = instance, is_get = True)
        return Response(data = serializer_return.data)
    
    @action(detail=False, methods=['get'], url_path="studio")
    def list_order_of_studio(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed()