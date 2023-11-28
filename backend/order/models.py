from base.models import BaseModel
from django.db import models
from backend.custom_middleware import get_current_user


class OrderStatusChoice(models.TextChoices):
    ORDERED = "ORDERED", "ORDERED"
    IN_PROCESS = "IN_PROCESS", "IN_PROCESS"
    SHIPPPING = "SHIPPPING", "SHIPPPING"
    COMPLETED = "COMPLETED", "COMPLETED"
    

class Order(BaseModel):
    total_price =  models.IntegerField(null=True, default= None)
    discount_price = models.IntegerField(null=True, default= 0)
    amount_paid = models.IntegerField(null=False, default=0)
    finish_date = models.DateField(null=True, default=None)
    customer = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="order",
        default= get_current_user,
    )
    status = models.CharField(
        max_length=255,
        choices=OrderStatusChoice.choices,
        default=OrderStatusChoice.ORDERED,
    )
    note = models.TextField(null=True, default=None)
    

class OrderItemStatusChoice(models.TextChoices):
    PENDING = "PENDING", "PENDING"
    ACCEPTED = "ACCEPTED", "ACCEPTED"
    REJECTED = "REJECTED", "REJECTED"


class OrderItem(BaseModel):
    order = models.ForeignKey(to=Order, on_delete=models.CASCADE, related_name="order_item")
    item = models.ForeignKey(to="item.Item", on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False, default=1)
    price = models.IntegerField(null=True, default=None)
    additional_information = models.JSONField(null=True, default=None)
    status = models.CharField(choices= OrderItemStatusChoice.choices, default= OrderItemStatusChoice.PENDING, max_length= 255)
