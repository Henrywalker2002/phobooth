from base.models import BaseModel
from django.db import models
from backend.custom_middleware import get_current_user


class Cart(BaseModel):
    customer = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        default=get_current_user,
        related_name="cart",
    )
    item = models.ForeignKey("item.Item", on_delete=models.CASCADE)
    number = models.IntegerField(null=False, default=1)
