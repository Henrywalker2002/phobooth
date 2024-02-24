from rest_framework import serializers
from order.models import Order, OrderItem, OrderStatusChoice
from item.models import Item, Variation
from item.serializers.item import ItemShortSerializer
from order.exceptions import UpdateCompletedOrderException


class CreateOrderItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), required=True)
    variation = serializers.PrimaryKeyRelatedField(
        queryset=Variation.objects.all(), required=False, allow_null=True)

    def validate(self, attrs):
        if "variation" not in attrs and "item" not in attrs:
            raise serializers.ValidationError(
                "You must provide either item or variation")
        if "variation" in attrs and "item" in attrs:
            raise serializers.ValidationError(
                "You can't provide both item and variation")
        if "variation" in attrs:
            attrs["item"] = None
        else:
            attrs["variation"] = None
        return attrs

    class Meta:
        model = OrderItem
        fields = ["variation", "item", "quantity"]
        extra_kwargs = {
            "variation": {"required": False, "allow_null": True},
            "item": {"required": False, "allow_null": True}
        }


class AppendOrderItemSerializer(CreateOrderItemSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    
    def validate(self, attrs):
        attrs = super().validate(attrs)
        order = attrs.get("order")
        item = order.order_item.first().item
        if item.studio != attrs.get("item").studio:
            raise serializers.ValidationError(
                "You can't add item from different studio")
        return attrs
    
    class Meta:
        model = OrderItem
        fields = ["variation", "item", "quantity", "order", "additional_information", "price"]
        extra_kwargs = {
            "variation": {"required": False, "allow_null": True},
            "item": {"required": False, "allow_null": True}
        }

class ReadOrderItemSerializer(serializers.ModelSerializer):
    item = ItemShortSerializer(read_only=True)

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


class UpdateOrderItemSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if self.instance.order.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        return attrs
    
    class Meta:
        model = OrderItem
        fields = ["price", "quantity", "additional_information"]
