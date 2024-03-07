from base.models import BaseModel
from django.db import models
from order.models import Order, OrderItem


class OrderHistoryStatusChoices(models.TextChoices):
    PENDING = 'PENDING', 'PENDING'
    ACCEPTED = 'ACCEPTED', 'ACCEPTED'
    REJECTED = 'REJECTED', 'REJECTED'


class OrderHistory(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_history')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, default=None, null = True)
    status = models.CharField(
        max_length=255, choices=OrderHistoryStatusChoices.choices, default=OrderHistoryStatusChoices.PENDING)
    denied_reason = models.TextField(null=True, default=None)
    fields = models.CharField(max_length=255, )
    old_value = models.JSONField(null=True, default=None)
    new_value = models.JSONField()
