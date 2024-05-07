from base.views import BaseModelViewSet
from payment.models import Payment, PaymentStatusChoices, PaymentMethodChoices
from payment.serializers import (CreatePaymentSerializer, ReadPaymentSerializer,
                                 UpdatePaymentSerializer, GetPaymentURLSerializer,
                                 RefundPaymentSerializer)
from order.serializers.order import ReadOrderSerializer
from payment.permission import PaymentPermission
from payment.filters import PaymentFilter
from payment.exceptions import PassOrderIdException, DeletePaidPaymentException
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum
from rest_framework.decorators import action
from payment.vnpay import VnPay
from django.conf import settings
from base.helper import get_client_ip
import datetime
from notification.execute import NotificationService


class PaymentViewSet(BaseModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = {"create": CreatePaymentSerializer, "update": UpdatePaymentSerializer,
                        "partial_update": UpdatePaymentSerializer, "default": ReadPaymentSerializer, 
                        "get_payment_url": GetPaymentURLSerializer, "refund": RefundPaymentSerializer}
    permission_classes = [PaymentPermission]
    filterset_class = PaymentFilter
    search_fields = ["@order__order_item__item__name"]
    
    def get_queryset(self):
        if self.action == "list":
            return super().get_queryset().order_by('-status', 'no')
        return super().get_queryset()
    
    def get_serializer(self, *args, **kwargs):
        is_order = kwargs.pop('is_order', False)
        if is_order:
            kwargs.setdefault('context', self.get_serializer_context())
            return ReadOrderSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        if not request.query_params.get("order"):
            raise PassOrderIdException()
        return super().list(request, *args, **kwargs)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order = serializer.validated_data["order"]
        no = self.queryset.filter(order=order).count() + 1
        serializer.validated_data["no"] = no
        self.perform_create(serializer)
        order = serializer.instance.order
        order = self.update_amount_created_order(order)

        # create notification
        NotificationService.studio_create_payment(serializer.instance)
        
        headers = self.get_success_headers(serializer.data)
        data = self.get_serializer(order, is_order=True).data
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update_amout_paid_order(self, order):
        amount_paid = order.payment.filter(status = PaymentStatusChoices.PAID).aggregate(
            amount_paid = Sum("amount"))["amount_paid"]
        order.amount_paid = amount_paid 
        order.save()
        return order
    
    def update_amount_created_order(self, order): 
        queryset = self.get_queryset()
        amount_created = queryset.filter(order=order).aggregate(
            amount_created = Sum("amount"))["amount_created"]
        order.amount_created = amount_created if amount_created else 0
        order.save()
        return order
        
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        order = instance.order
        order = self.update_amount_created_order(order)

        data = self.get_serializer(order, is_order=True).data
        return Response(data=data)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()
        if instance.status == PaymentStatusChoices.PAID:
            raise DeletePaidPaymentException()
        order = instance.order
        self.perform_destroy(instance)
        order = self.update_amount_created_order(order)
        
        data = self.get_serializer(order, is_order=True).data
        return Response(data=data)

    def gen_id_for_payment(self, payment):
        return f"{payment.order.id}-{payment.id}-{payment.number_attemp_in_day}"

    @action(detail=True, methods=["GET"], url_path="payment-url")
    def get_payment_url(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance = instance, data = {})
        serializer.is_valid(raise_exception=True)
        
        if instance.payment_attemp_date != datetime.date.today():
            instance.number_attemp_in_day = 0
            instance.payment_attemp_date = datetime.date.today()
        instance.number_attemp_in_day += 1
        instance.save()
        
        vnp = VnPay()
        vnp.requestData['vnp_Version'] = '2.1.0'
        vnp.requestData['vnp_Command'] = 'pay'
        vnp.requestData['vnp_TmnCode'] = settings.VNPAY_TMN_CODE
        vnp.requestData['vnp_Locale'] = 'vn'
        vnp.requestData['vnp_CurrCode'] = 'VND'
        vnp.requestData['vnp_TxnRef'] = self.gen_id_for_payment(instance)
        vnp.requestData['vnp_OrderInfo'] = f"{request.user.username} thanh toan don hang {instance.order.id} lan {instance.no}"
        vnp.requestData['vnp_OrderType'] = instance.order_type
        vnp.requestData['vnp_Amount'] = instance.amount * 100
        vnp.requestData['vnp_ReturnUrl'] = settings.VNPAY_RETURN_URL
        vnp.requestData['vnp_IpAddr'] = get_client_ip(request)
        vnp.requestData['vnp_CreateDate'] = datetime.datetime.now().strftime(
            '%Y%m%d%H%M%S')

        url = vnp.get_payment_url(
            settings.VNPAY_PAYMENT_URL, settings.VNPAY_HASH_SECRET_KEY)
        return Response(data={"url": url})

    @action(detail=False, methods=["GET"], url_path="return")
    @transaction.atomic
    def handle_payment_return(self, request, *args, **kwargs):
        data = request.GET
        vnp = VnPay()
        vnp.responseData = data.dict()
        if not vnp.validate_response(settings.VNPAY_HASH_SECRET_KEY):
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        if data.get('vnp_ResponseCode') in ['00', '07']:
            vnp_TxnRef = data.get('vnp_TxnRef')
            order_id, payment_id, _ = vnp_TxnRef.split('-')
            payment_instance = self.get_queryset().filter(id = payment_id)
            if not payment_instance:
                # handle refund 
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
            payment_instance = payment_instance.first()
            if payment_instance.status == PaymentStatusChoices.PAID:
                return Response(data=data, status=status.HTTP_200_OK)
            payment_instance.status = PaymentStatusChoices.PAID
            payment_instance.payment_date = datetime.date.today()
            payment_instance.payment_method = PaymentMethodChoices.VNPAY
            payment_instance.bank_code = data.get('vnp_BankCode', None)
            payment_instance.bank_tran_no = data.get('vnp_BankTranNo', None)
            payment_instance.vn_pay_tran_no = data.get("vnp_TransactionNo", None)
            payment_instance.vn_order_infor = data.get("vnp_OrderInfo", None)
            payment_instance.vn_pay_TxnRef = data.get("vnp_TxnRef", None)
            payment_instance.save() 
            # create notification
            NotificationService.user_pay(payment_instance)
            self.update_amout_paid_order(payment_instance.order)
        return Response(data=data, status=status.HTTP_202_ACCEPTED)

    def gen_request_id_refund(self, payment):
        return f"{payment.order.id}-{payment.id}-refund"
    
    @action(detail=False, methods=["POST"], url_path="refund")
    def refund(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]
        payments = Payment.objects.filter(id__in=ids)
        
        for payment in payments:
            # call api for refund
            payment.status = PaymentStatusChoices.REFUND
        self.queryset.bulk_update(payments, ["status"])
        data = ReadPaymentSerializer(payments.first().order.payment, many=True).data
        return Response(data=data)
            