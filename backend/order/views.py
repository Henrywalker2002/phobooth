from base.views import CustomModelViewSetBase
from order.models import Order, OrderItem
from order.serializers import OrderSerializer, CreateOrderSerializer, CreateOrderItemSerializer, ReadOrderSerializer, UpdateOrderItemSerializer, UpdateOrderSerializer
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response  
import operator


class OrderViewSet(CustomModelViewSetBase):
    queryset = Order.objects.all()
    serializer_class = {"create": CreateOrderSerializer, "list":ReadOrderSerializer,"update" : UpdateOrderSerializer ,"default": OrderSerializer, "partial_update": UpdateOrderSerializer}

    def get_queryset(self):
        return self.queryset.filter(customer = self.request.user)
    
    @transaction.atomic
    def create(self, request, *kawrgs, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        order_item = serializer.validated_data.pop('order_item')
        # create order
        self.perform_create(serializer)
        
        # create order item
        order = serializer.instance
        for item in order_item: 
            item['order'] = order.id
            item['item'] = item['item'].id
        order_item_serializer = CreateOrderItemSerializer(data = order_item, many = True)
        order_item_serializer.is_valid(raise_exception = True)
        order_item_serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        patial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = UpdateOrderSerializer(instance, data=request.data, partial=patial)
        serializer.is_valid(raise_exception=True)
        order_item = serializer.validated_data.pop('order_item')

        total_price = 0
        order = serializer.instance
        old_order_item = OrderItem.objects.filter(order = order).order_by('item')
        order_item.sort(key = operator.itemgetter("item"))
        # replace id with item.id
        for item in order_item:
            item['item'] = item['item'].id
        
        for old_item in old_order_item:
            new_item = list(filter(lambda x: x['item'] == old_item.item.id, order_item))
            if new_item:
                new_item = new_item[0]
                item_serializer = UpdateOrderItemSerializer(old_item, new_item, partial = True)
                item_serializer.is_valid(raise_exception = True)
                item_serializer.save()
            total_price += old_item.price * old_item.quantity
                    
        serializer.validated_data['total_price'] = total_price
        self.perform_update(serializer)
        return Response(serializer.data)
        