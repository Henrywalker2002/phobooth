from django.db import models
from base.models import BaseModel
from user.models import User
from order.models import Order


class ComplainTypeChoices(models.TextChoices):
    REFUND = "REFUND", "REFUND"
    OTHER = "OTHER", "OTHER"


class ComplainStatusChoices(models.TextChoices):
    PENDING = "PENDING", "PENDING"
    IN_PROGRESS = "IN_PROGRESS", "IN_PROGRESS"
    RESOLVED = "RESOLVED", "RESOLVED"


class Complain(BaseModel):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="complains")
    staff_resolved = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="resolved_complains", null=True, blank=True)
    order = models.ForeignKey(to=Order, on_delete=models.CASCADE, related_name="complain")
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=ComplainTypeChoices.choices, default=ComplainTypeChoices.OTHER)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=ComplainStatusChoices.choices, default=ComplainStatusChoices.PENDING)
    

class ComplainPicture(BaseModel):
    complain = models.ForeignKey(to = Complain, on_delete=models.CASCADE, related_name="pictures")
    picture = models.ImageField(upload_to="complain_pictures/")