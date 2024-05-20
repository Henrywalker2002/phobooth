from rest_framework import serializers
from order.models import Order, OrderStatusChoice
from user.models import User
from studio.models import Studio
from studio.serializers import StudioSummarySerializer
from order.serializers.order_item import CreateOrderItemSerializer, ReadOrderItemSerializer
from user.serializers import UserSummarySerializer
from order.exceptions import UpdateCompletedOrderException, UpdateCompletedOrderPaidException, UpdateCompletedOrderOrderItemException
from payment.serializers import ReadPaymentSerializer
from payment.models import PaymentStatusChoices, Payment
from order_history.serializers import OrderHistorySummarySerializer
from address.serializers import AddressSerializer, ReadAddressSerializer
from complain.serializers import ComplainSummarySerializer

class CreateOrderSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    order_item = CreateOrderItemSerializer(many=True)
    studio = serializers.PrimaryKeyRelatedField(queryset=Studio.objects.all(), required=False)
    address = AddressSerializer(required = False,)
    
    class Meta:
        model = Order
        fields = [
            "id",
            "created_at",
            "customer",
            "note",
            "order_item",
            "studio",
            "address",
        ]
    
    def validate_order_item(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("You must provide at least one order item")
        studio = None 
        for item in value: 
            item = item["item"] or item["variation"].product
            if studio is None:
                studio = item.studio
            if studio != item.studio:
                raise serializers.ValidationError("You can't provide order item from different studio")
        return value


class ReadOrderSerializer(serializers.ModelSerializer):
    order_item = ReadOrderItemSerializer(many=True, read_only=True)
    studio = StudioSummarySerializer(read_only=True)
    customer = UserSummarySerializer(read_only=True)
    payment = ReadPaymentSerializer(many=True, read_only=True)
    order_history = OrderHistorySummarySerializer(many=True, read_only=True)
    address = ReadAddressSerializer(read_only=True)
    complain = ComplainSummarySerializer(read_only=True)
    
    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["payment"] = sorted(res["payment"], key = lambda x : x["status"], reverse=True)
        return res 
    
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
            "order_history",
            "address",
            "complain",
        ]

class OrderSummarySerializer(serializers.ModelSerializer):
    order_item = ReadOrderItemSerializer(many=True, read_only=True)
    studio = StudioSummarySerializer(read_only=True)
    customer = UserSummarySerializer(read_only=True)
    payment = ReadPaymentSerializer(many = True, read_only=True)
    complain = ComplainSummarySerializer(read_only=True)
    
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
            "complain",
        ]
        
class UpdateOrderSerializer(serializers.ModelSerializer):
    
    address = AddressSerializer(required = False, allow_null = True)
    
    def validate(self, attrs):
        instance = self.instance
        if instance.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        return attrs
    
    def validate_status(self, value):
        instance = self.instance
        user = self.context.get("request").user
        if value == OrderStatusChoice.COMPLETED:
            if instance.total_price != instance.amount_paid:
                raise UpdateCompletedOrderPaidException()
            # if instance.payment.filter(status = PaymentStatusChoices.PENDING).exists():
            #     raise UpdateCompletedOrderPaidException()
            if instance.order_item.filter(price = None).exists():
                raise UpdateCompletedOrderOrderItemException()
        elif value == OrderStatusChoice.ORDERED:
            raise serializers.ValidationError(
                f"You cannot update order to {OrderStatusChoice.ORDERED} status")
        elif value == OrderStatusChoice.CANCELED:
            if instance.status != OrderStatusChoice.ORDERED and instance.customer != user:
                raise serializers.ValidationError(
                    "You cannot cancel this order"
                )
        elif value == OrderStatusChoice.IN_PROCESS:
            if instance.status != OrderStatusChoice.ORDERED:
                raise serializers.ValidationError(
                    "You cannot update this order to in process"
                )
            else:
                if instance.order_item.filter(price = None).exists():
                    raise serializers.ValidationError(
                        "You cannot update this order to in process, please update all price of order item first"
                    )
        return value 
        
    class Meta:
        model = Order
        fields = ["status", "address"]
        