from base.models import BaseModel
from django.db import models
from backend.custom_middleware import get_current_user
from item.models import Item, Variation


class OrderStatusChoice(models.TextChoices):
    ORDERED = "ORDERED", "ORDERED"
    IN_PROCESS = "IN_PROCESS", "IN_PROCESS"
    SHIPPPING = "SHIPPPING", "SHIPPPING"
    COMPLETED = "COMPLETED", "COMPLETED"
    CANCELED = "CANCELED", "CANCELED"
    

class Order(BaseModel):
    total_price =  models.IntegerField(null=True, default= None)
    discount_price = models.IntegerField(null=True, default= 0)
    transportation_price = models.IntegerField(null=True, default= 0)
    amount_created = models.IntegerField(null = True, default = 0)
    amount_paid = models.IntegerField(null=False, default=0)
    finish_date = models.DateField(null=True, default=None)
    customer = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="order",
        default= get_current_user,
    )
    studio = models.ForeignKey(
        "studio.Studio",
        on_delete=models.CASCADE,
        related_name="order",
        null= True,
    )
    status = models.CharField(
        max_length=255,
        choices=OrderStatusChoice.choices,
        default=OrderStatusChoice.ORDERED,
    )
    note = models.TextField(null=True, default=None)
    
    @property
    def remaining_amount(self):
        return self.total_price - self.amount_paid
        

class OrderItemStatusChoice(models.TextChoices):
    PENDING = "PENDING", "PENDING"
    ACCEPTED = "ACCEPTED", "ACCEPTED"
    REJECTED = "REJECTED", "REJECTED"


class OrderItem(BaseModel):
    order = models.ForeignKey(to=Order, on_delete=models.CASCADE, related_name="order_item")
    item = models.ForeignKey(to=Item, on_delete=models.SET_NULL, related_name="order_item", null=True)
    variation = models.ForeignKey(to=Variation, on_delete=models.SET_NULL, related_name="order_item", null=True)
    quantity = models.IntegerField(null=False, default=1)
    price = models.IntegerField(null=True, default=None)
    additional_information = models.JSONField(null=True, default=None)
    status = models.CharField(choices= OrderItemStatusChoice.choices, default= OrderItemStatusChoice.PENDING, max_length= 255)
