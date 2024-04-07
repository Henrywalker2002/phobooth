from django.db import models
from base.models import BaseModel
from order.models import OrderItem
from item.models import Item
from user.models import User


class Rate(BaseModel):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, )
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='rates')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rates')
    star = models.IntegerField()
    comment = models.TextField(null = False)


class RatePicture(BaseModel):
    rate = models.ForeignKey(Rate, on_delete=models.CASCADE, related_name='pictures')
    picture = models.ImageField(upload_to='rate_pictures/')