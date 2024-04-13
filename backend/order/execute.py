from datetime import timedelta
from payment.models import PaymentMethodChoices, PaymentStatusChoices
from order.models import Order, OrderStatusChoice
from studio.models import Studio
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone


@transaction.atomic
def check_order_and_pay():
    orders = Order.objects.filter(
        status=OrderStatusChoice.COMPLETED,
        done_payment=False,
        modified_at__lt=timezone.now() - timedelta(days=7),
    ).all()

    studio_lst = []
    order_lst = []

    for order in orders:
        balance = order.payment.filter(
            status=PaymentStatusChoices.PAID, payment_method=PaymentMethodChoices.VNPAY).aggregate(
                balance=Sum("amount"))["balance"]
        studio = order.studio
        if not balance:
            continue
        studio.account_balance += balance
        order.done_payment = True
        order_lst.append(order)
        studio_lst.append(studio)
    
    Order.objects.bulk_update(order_lst, ["done_payment"])
    Studio.objects.bulk_update(studio_lst, ["account_balance"])
        
