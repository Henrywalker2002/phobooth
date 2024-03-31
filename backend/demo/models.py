from django.db import models
from base.models import BaseModel
from order.models import Order
from versatileimagefield.fields import VersatileImageField
from user.models import User
from backend.custom_middleware import get_current_user
    

class ImageDemo(BaseModel):
    order = models.ForeignKey(
        to=Order, on_delete=models.CASCADE, related_name="image_demo")
    image = VersatileImageField(
        'image', upload_to='image_demo', width_field='width', height_field='height')

    height = models.PositiveIntegerField(
        'Image Height',
        blank=True,
        null=True
    )
    width = models.PositiveIntegerField(
        'Image Width',
        blank=True,
        null=True
    )

    title = models.CharField(max_length=255)
    size = models.PositiveIntegerField()
    format = models.CharField(max_length=255)
    description = models.TextField()
    

class ImageDemoComment(BaseModel):
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, default = get_current_user)
    text = models.TextField()
    image_demo = models.ForeignKey(
        to=ImageDemo, on_delete=models.CASCADE, related_name="comment")