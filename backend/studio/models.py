from base.models import BaseModel
from django.db import models
from address.models import Address


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

    
    def __eq__(self, other):
        return self.id == other.id

    def __ne__(self, other: object) -> bool:
        return self.id != other.id