from base.models import BaseModel
from order.models import Order
from django.db import models

class PaymentMethodChoices(models.TextChoices):
    CASH = 'CASH', 'CASH'
    BANK = 'BANK', 'BANK'
    VNPAY = 'VNPAY', 'VNPAY'
    OTHER = 'OTHER', 'Other'


class PaymentStatusChoices(models.TextChoices):
    PENDING = "PENDING", "PENDING"
    PAID = "PAID", "PAID"


class Payment(BaseModel):
    no = models.IntegerField(default = 1)
    number_attemp_in_day = models.IntegerField(default = 0)
    payment_attemp_date = models.DateField(null = True, default = None)
    payment_method = models.CharField(max_length = 20, choices = PaymentMethodChoices.choices,)
    bank_tran_no = models.CharField(max_length = 255, blank = True, null = True)
    vn_pay_tran_no = models.CharField(max_length = 255, blank = True, null = True)
    vn_order_infor = models.CharField(max_length = 255, blank = True, null = True)
    payment_date = models.DateField(null = True, default = None)
    expiration_date = models.DateField()
    amount = models.IntegerField()
    status = models.CharField(max_length = 20, choices = PaymentStatusChoices.choices, default = PaymentStatusChoices.PENDING)
    order = models.ForeignKey(to = Order, on_delete = models.CASCADE, related_name = "payment")
    order_type = models.CharField(max_length = 20, default = "190000")
    order_desc = models.CharField(max_length = 100)
    bank_code = models.CharField(max_length = 20, blank = True, null = True)
    language = models.CharField(max_length = 2, default = "vn")