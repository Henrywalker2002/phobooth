from rest_framework import serializers
from order.models import Order, OrderItem
from item.models import Item
from item.serializers import ItemSummarySerializer


class CreateOrderItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=False)    
    
    class Meta:
        model = OrderItem
        fields = ["order", "item", "quantity"]
        extra_kwargs = {"order": {"required": False, "allow_null": True}}

class CreateOrderSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    order_item = CreateOrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "customer",
            "note",
            "order_item",
        ]


class ReadOrderItemSerializer(serializers.ModelSerializer):
    item = ItemSummarySerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "item",
            "quantity",
            "price",
            "additional_information",
            "status",
        ]
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.price is None:
            ret["min_price"] = instance.item.min_price
            ret["max_price"] = instance.item.max_price
        return ret
    
class ReadOrderSerializer(serializers.ModelSerializer):
    order_item = ReadOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "total_price",
            "discount_price",
            "amount_paid",
            "finish_date",
            "customer",
            "status",
            "note",
            "order_item",
        ]
            

class UpdateOrderItemSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=False, write_only=True)
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), required=False)
    class Meta:
        model = OrderItem
        fields = ["price", "item", "quantity", "order", "additional_information"]
        

class UpdateOrderSerializer(serializers.ModelSerializer):
    order_item = UpdateOrderItemSerializer(many=True)
    total_price = serializers.IntegerField(required = False)
    class Meta:
        model = Order
        fields = ["status", "order_item", "total_price"]

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "total_price",
            "discount_price",
            "amount_paid",
            "finish_date",
            "customer",
            "status",
            "note",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "customer",
            "total_price",
            "discount_price",
            "amount_paid",
            "finish_date",
        ]