from django.db import models
from base.models import BaseModel
from category.models import Category
from backend.custom_middleware import get_current_studio


class ItemTypeChoices(models.TextChoices):
    SERVICE = "SERVICE", "SERVICE"
    SERVICE_PACK = "SERVICE_PACK", "SERVICE_PACK"
    PRODUCT = "PRODUCT", "PRODUCT"
    ACCESSORY = "ACCESSORY", "ACCESSORY"


class ItemStatusChoices(models.TextChoices):
    ACTIVE = "ACTIVE", "ACTIVE"
    INACTIVE = "INACTIVE", "INACTIVE"
    DRAFT = "DRAFT", "DRAFT"


class Item(BaseModel):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    type = models.CharField(choices=ItemTypeChoices.choices, null=False)
    category = models.ForeignKey(to=Category, on_delete=models.SET_NULL, null=True)
    studio = models.ForeignKey(
        to="studio.Studio",
        on_delete=models.CASCADE,
        default=get_current_studio,
        related_name="items",
    )
    picture = models.ImageField(upload_to="item", null=True)
    status = models.CharField(
        choices=ItemStatusChoices.choices,
        null=False,
        default=ItemStatusChoices.DRAFT,
        max_length=255,
    )
    width = models.FloatField(null=True)
    length = models.FloatField(null=True)
    weight = models.FloatField(null=True)
    height = models.FloatField(null=True)
    fixed_price = models.IntegerField(null=True)

    min_price = models.IntegerField(null=True)
    max_price = models.IntegerField(null=True)
    star = models.FloatField(default= 5)

    item = models.ManyToManyField(to="Item", related_name="item_item")

    def __str__(self) -> str:
        return self.name
    
    def __lt__(self, other):
        return self.id < other.id
    
    def __gt__(self, other):
        return self.id > other.id
