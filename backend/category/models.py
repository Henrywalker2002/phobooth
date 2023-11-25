from django.db import models
from base.models import BaseModel


class CategoryTypeChoices(models.TextChoices):
    SERVICE = "SERVICE", "SERVICE"
    PRODUCT = "PRODUCT", "PRODUCT"


class Category(BaseModel):
    type = models.CharField(choices=CategoryTypeChoices.choices, null=False)
    title = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=512, null=True)
