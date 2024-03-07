from base.views import BaseModelViewSet
from order.models import OrderItem
from order.serializers.order import ReadOrderSerializer
from order.serializers.order_item import AppendOrderItemSerializer, UpdateOrderItemSerializer, ReadOrderItemSerializer
from django.db import transaction
from rest_framework import permissions
from rest_framework.response import Response
from django.db.models import Sum, F
from rest_framework import status
from base.exceptions import MethodNotAllowed
from order_history.excute import create_order_item_history, create_order_price_history
from copy import deepcopy


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
        old_price = order.total_price
        order.total_price = queryset.filter(order=order).aggregate(
            total_price=Sum(F('price') * F('quantity')))['total_price']
        order.save()
        create_order_price_history(order, old_price, order.total_price)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_instance = deepcopy(instance)
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        create_order_item_history(serializer.instance, "update", old_instance)
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
        # update history
        create_order_item_history(serializer.instance, "add")
        
        data = self.get_serializer(order, is_order=True).data   
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed()
