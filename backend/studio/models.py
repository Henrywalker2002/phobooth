from base.models import BaseModel
from django.db import models


class DocumentStatusChoices(models.TextChoices):
    PENDING = "PENDING", "PENDING"
    APPROVED = "APPROVED", "APPROVED"
    REJECTED = "REJECTED", "REJECTED"


class Document(BaseModel):
    business_license = models.FileField(upload_to="documents/", null=True)
    id_card = models.FileField(upload_to="documents/", null=True)
    status = models.CharField(
        choices=DocumentStatusChoices.choices,
        null=False,
        default=DocumentStatusChoices.PENDING,
    )
    studio = models.ForeignKey(to="Studio", on_delete=models.CASCADE, null=False)


class StudioAddress(BaseModel):
    studio = models.ForeignKey(to="Studio", on_delete=models.CASCADE, null=False, related_name='address')
    city = models.CharField(max_length=255, null=False)
    district = models.CharField(max_length=255, null=False)
    ward = models.CharField(max_length=255, null=False)
    address = models.CharField(max_length=255, null=False)
    postal_code = models.CharField(max_length=255, null=False)


class Studio(BaseModel):
    code_name = models.CharField(max_length=255, null=False, unique=True)
    friendly_name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    tax_code = models.CharField(max_length=255, null=True)
    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=255, null=False)
    email = models.EmailField(max_length=255, null=False)
