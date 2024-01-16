from base.views import CustomModelViewSetBase
from order.models import Order, OrderItem
from order.serializers import OrderSerializer, CreateOrderSerializer, CreateOrderItemSerializer, ReadOrderSerializer, UpdateOrderItemSerializer, UpdateOrderSerializer
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.response import Response  
import operator
from rest_framework.decorators import action
from django.db.models import Sum, F


class OrderViewSet(CustomModelViewSetBase):
    queryset = Order.objects.all()
    serializer_class = {"create": CreateOrderSerializer, "list":ReadOrderSerializer,"update" : UpdateOrderSerializer 
                        ,"default": OrderSerializer, "partial_update": UpdateOrderSerializer, 
                        "list_order_of_studio" : ReadOrderSerializer,"retrieve": ReadOrderSerializer}
    permission_classes = [permissions.IsAuthenticated]
    
    
    def get_queryset(self):
        return self.queryset.filter(customer = self.request.user)
    
    @transaction.atomic
    def create(self, request, *kawrgs, **kwargs):
        request.data['customer'] = request.user.id
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
        if 'order_item' not in serializer.validated_data:
            self.perform_update(serializer)
            return Response(serializer.data)
        
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
        
    @action(detail = False, methods = ['get'])
    def list_order_of_studio(self, request, *args, **kwargs):
        studio_id = self.request.user.studio.id
        # studio_id = kwargs.pop('studio_id', None)
        queryset = self.queryset.filter(studio = studio_id)
        serializer = self.get_serializer(queryset, many = True)
        return Response(serializer.data)
    
    
class OrderItemViewSet(CustomModelViewSetBase):
    queryset = OrderItem.objects.all()
    serializer_class = {"default" : CreateOrderItemSerializer}
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        order = instance.order
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        order.total_price = OrderItem.objects.filter(order = order).aggregate(total_price = Sum(F('price') * F('quantity')))['total_price']
        order.save()
        return Response(ReadOrderSerializer(order).data)
        