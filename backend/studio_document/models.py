from base.models import BaseModel
from studio.models import Studio
from django.db import models
from django.core.validators import FileExtensionValidator


class StudioDocumentStatusChoices(models.TextChoices):
    PENDING = 'PENDING', 'PENDING'
    ACCEPTED = 'ACCEPTED', 'ACCEPTED'
    REJECTED = 'REJECTED', 'REJECTED'


class StudioDocument(BaseModel):
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=255)
    license_date = models.DateField()
    license_number = models.CharField(max_length=255)
    license_issue = models.CharField(max_length=255)
    front_ID_card = models.ImageField(upload_to='studio_document/')
    back_ID_card = models.ImageField(upload_to='studio_document/')
    license = models.FileField(upload_to='studio_document/',
                               validators=[
                                   FileExtensionValidator(allowed_extensions=[
                                                          'jpeg', 'pdf', 'jpg', 'png'])
                               ])
    denied_reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=255, choices=StudioDocumentStatusChoices.choices,
                              default=StudioDocumentStatusChoices.PENDING)
    number_attempts = models.PositiveIntegerField(default=0)
