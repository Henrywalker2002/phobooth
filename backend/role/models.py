from django.db import models
from base.models import BaseModel


class Permission(BaseModel):
    friendly_name = models.CharField(max_length=255, null=False)
    code_name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=511, null=True, default=None)
    
    def __str__(self):
        return self.code_name


class Role(BaseModel):
    friendly_name = models.CharField(max_length=255, null=False)
    code_name = models.CharField(max_length=255, null=False, unique=True)
    description = models.CharField(max_length=511, null=True, default=None)
    permission = models.ManyToManyField(to=Permission)
    
    def __str__(self):
        return self.code_name
