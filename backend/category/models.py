from django.db import models
from base.models import BaseModel
from category.helper import convert_to_no_sign


class CategoryTypeChoices(models.TextChoices):
    SERVICE = "SERVICE", "SERVICE"
    PRODUCT = "PRODUCT", "PRODUCT"


class Category(BaseModel):
    type = models.CharField(choices=CategoryTypeChoices.choices, null=False, max_length=255)
    title = models.CharField(max_length=255, null=False, unique=True)
    code_name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=512, null=True)
    
    def save(self, *args, **kwargs):
        self.code_name = convert_to_no_sign(self.title)
        super().save(*args, **kwargs)