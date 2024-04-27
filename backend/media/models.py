from django.db import models
from base.models import BaseModel


class MediaContentTypeChoices(models.TextChoices):
    TEXT_PLAIN = "TEXT_PLAIN", "TEXT_PLAIN"
    HTML = "HTML", "HTML"


class MediaSendMethodChoices(models.TextChoices):
    EMAIL = "EMAIL", "EMAIL"
    MESSAGE = "MESSAGE", "MESSAGE"
    SMS = "SMS", "SMS"
    

class MediaStatusChoices(models.TextChoices):
    IN_QUEUE = "IN_QUEUE", "IN_QUEUE"
    IN_PROCESS = "IN_PROCESS", "IN_PROCESS"
    SUCCESS = "SUCCESS", "SUCCESS"
    FAIL = "FAIL", "FAIL"
    

class Media(BaseModel):
    media_from = models.JSONField()
    media_to = models.JSONField()
    title = models.TextField()
    content = models.TextField()
    content_type = models.CharField(
        max_length=128, choices=MediaContentTypeChoices.choices, default=MediaContentTypeChoices.TEXT_PLAIN)
    send_method = models.CharField(
        max_length=128, choices=MediaSendMethodChoices.choices, default=MediaSendMethodChoices.EMAIL)
    status = models.CharField(max_length=128, choices=MediaStatusChoices.choices,
                              default=MediaStatusChoices.IN_QUEUE)
    retry_count = models.IntegerField(default= 0)