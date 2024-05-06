from django.db import models
from base.models import BaseModel
from category.models import Category
from backend.custom_middleware import get_current_studio


class Option(BaseModel):
    name = models.CharField(max_length=255, null=False)
    product = models.ForeignKey(to="Item", on_delete=models.CASCADE, null=False, related_name = "option")
    
    class Meta:
        unique_together = ["name", "product"]
    
class OptionValue(BaseModel):
    name = models.CharField(max_length=255, null=False)
    option = models.ForeignKey(to="Option", on_delete=models.CASCADE, null=False, related_name = "option_value")
    
    class Meta:
        unique_together = ["name", "option"]
        

class Variation(BaseModel):
    description = models.TextField(null=True)
    price = models.IntegerField(null=False)
    product = models.ForeignKey(to="Item", on_delete=models.CASCADE, null=False, related_name="variation")
    value = models.ManyToManyField(to="OptionValue", related_name="variation")
    stock = models.IntegerField(null=False)

class ItemTypeChoices(models.TextChoices):
    SERVICE = "SERVICE", "SERVICE"
    SERVICE_PACK = "SERVICE_PACK", "SERVICE_PACK"
    PRODUCT = "PRODUCT", "PRODUCT"
    ACCESSORY = "ACCESSORY", "ACCESSORY"


class ItemStatusChoices(models.TextChoices):
    ACTIVE = "ACTIVE", "ACTIVE"
    INACTIVE = "INACTIVE", "INACTIVE"
    DRAFT = "DRAFT", "DRAFT"


class ItemPicture(models.Model):
    id = models.AutoField(primary_key = True, editable = False)
    item = models.ForeignKey(to="Item", on_delete=models.CASCADE, null=False, related_name="pictures")
    picture = models.ImageField(upload_to="item", null=False)

class Item(BaseModel):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    type = models.CharField(choices=ItemTypeChoices.choices, null=False, max_length=255)
    category = models.ForeignKey(to=Category, on_delete=models.SET_NULL, null=True)
    studio = models.ForeignKey(
        to="studio.Studio",
        on_delete=models.CASCADE,
        default=get_current_studio,
        related_name="items",
    )
    status = models.CharField(
        choices=ItemStatusChoices.choices,
        null=False,
        default=ItemStatusChoices.ACTIVE,
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
