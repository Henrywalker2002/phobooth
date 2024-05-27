from datetime import timedelta
from payment.models import PaymentMethodChoices, PaymentStatusChoices
from order.models import Order, OrderStatusChoice, OrderItem, OrderItemStatusChoice
from studio.models import Studio
from django.db import transaction
from django.db.models import Sum, F
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist


def get_complain(order):
    try:
        return order.complain
    except ObjectDoesNotExist:
        return None

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
        complain = get_complain(order)
        if complain and complain.status != "RESOLVED":
            continue
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


@transaction.atomic
def check_order_item():
    order_items = OrderItem.objects.filter(status=OrderItemStatusChoice.PENDING,
                                           created_at__lt=timezone.now() - timedelta(days=3)).all()
    order_lst = []
    for order_item in order_items:
        order = order_item.order
        order.total_price = OrderItem.objects.filter(order=order, status=OrderItemStatusChoice.ACCEPTED).aggregate(
            total_price=Sum(F('price') * F('quantity')))['total_price']
        if order.total_price:
            order.total_price = order.total_price + order_item.price * order_item.quantity
        order_lst.append(order)
        order_item.status = OrderItemStatusChoice.ACCEPTED
    Order.objects.bulk_update(order_lst, ["total_price"])
    OrderItem.objects.bulk_update(order_items, ["status"])