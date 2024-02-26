from rest_framework import serializers
from order.models import Order, OrderStatusChoice
from user.models import User
from studio.models import Studio
from studio.serializers import StudioSummarySerializer
from order.serializers.order_item import CreateOrderItemSerializer, ReadOrderItemSerializer
from user.serializers import UserSummarySerializer
from order.exceptions import UpdateCompletedOrderException
from payment.serializers import ReadPaymentSerializer

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
    customer = UserSummarySerializer(read_only=True)
    payment = ReadPaymentSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "modified_at",
            "total_price",
            "discount_price",
            "amount_paid",
            "amount_created",
            "finish_date",
            "customer",
            "status",
            "note",
            "order_item",
            "studio",
            "payment",
        ]
        
class UpdateOrderSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        instance = self.instance
        if instance.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        return attrs
        
    class Meta:
        model = Order
        fields = ["status"]
        