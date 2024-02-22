from base.views import BaseModelViewSet
from order.models import OrderItem, OrderStatusChoice
from order.serializers.order import ReadOrderSerializer
from order.serializers.order_item import AppendOrderItemSerializer, UpdateOrderItemSerializer, ReadOrderItemSerializer
from django.db import transaction
from rest_framework import permissions
from rest_framework.response import Response
from django.db.models import Sum, F
from rest_framework import status
from order.exceptions import DeleteLastOrderItemException, UpdateCompletedOrderException


class OrderItemViewSet(BaseModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = {"default": ReadOrderItemSerializer,
                        "create": AppendOrderItemSerializer, 
                        "update": UpdateOrderItemSerializer,
                        "partial_update": UpdateOrderItemSerializer,}
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        is_order = kwargs.pop('is_order', False)
        if is_order:
            kwargs.setdefault('context', self.get_serializer_context())
            return ReadOrderSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)

    def update_order_price(self, order):
        queryset = self.get_queryset()
        order.total_price = queryset.filter(order=order).aggregate(
            total_price=Sum(F('price') * F('quantity')))['total_price']
        order.save()

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        order = instance.order
        self.update_order_price(order)

        serializer_return = self.get_serializer(instance.order, is_order=True)
        return Response(data=serializer_return.data)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        order = serializer.instance.order
        self.update_order_price(order)
        
        data = self.get_serializer(order, is_order=True).data   
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        order = instance.order
        
        if len(order.order_item.all()) == 1:
            raise DeleteLastOrderItemException()
        
        self.perform_destroy(instance)
        self.update_order_price(order)
        data = self.get_serializer(order, is_order=True).data
        return Response(status= status.HTTP_200_OK, data= data)
