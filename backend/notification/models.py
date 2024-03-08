from django.db import models
from base.models import BaseModel
from user.models import User


class NotificationVerbChoices(models.TextChoices):
    CREATED = "CREATED", "CREATED"
    COMPLETED = "COMPLETED", "COMPLETED"
    PAID = "PAID", "PAID"
    ADD = "ADD", "ADD"
    ACCEPTED = "ACCEPTED", "ACCEPTED"
    DENIED = "DENIED", "DENIED"
    CANCELED = "CANCELED", "CANCELED"


class NotificationRedirectTypeChoices(models.TextChoices):
    ORDER = "ORDER", "ORDER"


class NotificationPrepositionalObjectChoices(models.TextChoices):
    FOR = "FOR", "FOR"
    TO = "TO", "TO"
    WITH = "WITH", "WITH"


class Notification(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    subject = models.CharField(max_length=255)
    verb = models.CharField(max_length=255, choices = NotificationVerbChoices.choices)
    direct_object = models.CharField(max_length=255)
    indirect_object = models.CharField(max_length=255, null = True)
    prepositional_object = models.CharField(max_length=255, null = True)
    context = models.TextField(null = True)
    is_read = models.BooleanField(default=False)
    redirect_type = models.CharField(max_length=255)
    redirect_id = models.IntegerField()    
