from rest_framework import serializers
from order.models import Order, OrderItem
from item.models import Item
from item.serializers.item import ItemDetailSerializer
from user.models import User
from studio.models import Studio
from studio.serializers import StudioSummarySerializer
from order.serializers.order_item import CreateOrderItemSerializer, ReadOrderItemSerializer, UpdateOrderItemSerializer


class CreateOrderSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    order_item = CreateOrderItemSerializer(many=True)
    studio = serializers.PrimaryKeyRelatedField(queryset=Studio.objects.all(), required=False)
    
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "customer",
            "note",
            "order_item",
            "studio",
        ]
    
    def validate_order_item(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("You must provide at least one order item")
        studio = None 
        for item in value: 
            if studio is None:
                studio = item["item"].studio
            if studio != item["item"].studio:
                raise serializers.ValidationError("You can't provide order item from different studio")
        return value


class ReadOrderSerializer(serializers.ModelSerializer):
    order_item = ReadOrderItemSerializer(many=True, read_only=True)
    studio = StudioSummarySerializer(read_only=True)
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "modified_at",
            "total_price",
            "discount_price",
            "amount_paid",
            "finish_date",
            "customer",
            "status",
            "note",
            "order_item",
            "studio"
        ]
        
class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]
        