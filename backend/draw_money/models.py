from django.db import models
from base.models import BaseModel
from studio.models import Studio


class DrawMoneyStatusChoices(models.TextChoices):
    PENDING = "PENDING"
    DONE = "DONE"
    CANCEL = "CANCEL"


class DrawMoney(BaseModel):
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE)
    amount = models.FloatField(null=False)
    status = models.CharField(
        max_length=255, choices=DrawMoneyStatusChoices.choices, default=DrawMoneyStatusChoices.PENDING)
    transation_id = models.CharField(max_length=255, null=True)
    