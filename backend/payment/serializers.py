from rest_framework import serializers
from order.models import Order, OrderStatusChoice
from payment.models import Payment, PaymentStatusChoices, PaymentMethodChoices
from payment.exceptions import (UpdatePaidPaymentException, AmountExceedException,
                                PaymentExpiredException, PaymentPaidException, 
                                PaymentExceedTimeException, AddPaymentOrderedOrderException)
from order.exceptions import UpdateCompletedOrderException
import datetime


class CreatePaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    def validate_amount(self, value):
        if value < 10000:
            raise serializers.ValidationError("Amount must be greater than 10000")
        return value
    
    def validate_expiration_date(self, value):
        if value < datetime.date.today():
            raise serializers.ValidationError("Expiration date must be greater than today")
        return value
    
    def validate(self, attrs):
        order = attrs.get("order")
        if order.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        elif order.status == OrderStatusChoice.ORDERED:
            raise AddPaymentOrderedOrderException()
        if not order.total_price or attrs.get("amount") > order.total_price - order.amount_created:
            raise AmountExceedException()
        return attrs

    class Meta:
        model = Payment
        fields = ["expiration_date", "order", "amount"]


class UpdatePaymentSerializer(CreatePaymentSerializer):
    
    def validate(self, attrs):
        order = self.instance.order
        if order.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        elif order.status == OrderStatusChoice.ORDERED:
            raise AddPaymentOrderedOrderException()
        
        if not order:
            pass
        elif order.status == OrderStatusChoice.COMPLETED:
            raise UpdateCompletedOrderException()
        if self.instance.status == PaymentStatusChoices.PAID:
            raise UpdatePaidPaymentException()

        if "amount" in attrs:
            if attrs.get("amount") > order.total_price - order.amount_created + self.instance.amount:
                raise AmountExceedException()

        return attrs

    class Meta:
        model = Payment
        fields = ["amount", "expiration_date"]


class ReadPaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment
        fields = ["id", "no", "amount", "status",
                  "expiration_date", "payment_date", "payment_method"]


class GetPaymentURLSerializer(serializers.Serializer):

    def validate(self, attrs):
        instance = self.instance
        if instance.expiration_date < datetime.date.today():
            raise PaymentExpiredException()
        if instance.status == PaymentStatusChoices.PAID:
            raise PaymentPaidException()
        if instance.number_attemp_in_day > 10 and instance.payment_attemp_date == datetime.date.today():
            raise PaymentExceedTimeException()
        return attrs

class RefundPaymentSerializer(serializers.ModelSerializer):
    
    ids = serializers.ListField(child = serializers.IntegerField())
    
    def validate_ids(self, value):
        payments = Payment.objects.filter(id__in = value)
        payment_ids = payments.values_list("id", flat = True)
        for id in value:
            if id not in payment_ids:
                raise serializers.ValidationError(f"Payment with id {id} not found")
        for payment in payments:
            if payment.status != PaymentStatusChoices.PAID or payment.payment_method != PaymentMethodChoices.VNPAY:
                raise serializers.ValidationError("Payment must be paid and use VNPAY method")
        return value

    class Meta:
        model = Payment
        fields = ["ids"]