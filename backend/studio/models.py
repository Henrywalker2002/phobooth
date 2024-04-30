from base.models import BaseModel
from django.db import models
from address.models import Address
from item.models import ItemTypeChoices


class StudioTypeChoices(models.TextChoices):
    STUDIO = 'STUDIO', 'STUDIO'
    PHOTOGRAPHER = 'PHOTOGRAPHER', 'PHOTOGRAPHER'


class Studio(BaseModel):
    code_name = models.CharField(max_length=255, null=False, unique=True)
    friendly_name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    tax_code = models.CharField(max_length=255, null=True, unique=True)
    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=255, null=False, unique=True)
    email = models.EmailField(max_length=255, null=False, unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True)
    address = models.ForeignKey(to = Address, on_delete=models.SET_NULL, null=True)
    bank_bin = models.CharField(max_length=6, null=True, blank=True)

    account_number = models.CharField(max_length=20, null=True, blank=True)    
    number_order_completed = models.IntegerField(default=0)
    star = models.FloatField(default=5)
    number_rate = models.IntegerField(default=0)
    account_name = models.CharField(max_length=255, null=True, blank=True)
    account_balance = models.IntegerField(default=0)
    type = models.CharField(max_length=255, choices=StudioTypeChoices.choices, default=StudioTypeChoices.STUDIO)
    @property
    def total_item(self):
        return self.items.exclude(type = ItemTypeChoices.ACCESSORY).count()
    
    def __eq__(self, other):
        return self.id == other.id

    def __ne__(self, other: object) -> bool:
        return self.id != other.id
    
    def __hash__(self) -> int:
        return hash(self.id)