from django.db import models
from user.models import User


class BaseModel(models.Model):
    """
    BaseModel contains id, created_at, modified_at, created_by, updated_by
    """
    id = models.AutoField(primary_key = True, editable = False)
    created_at = models.DateTimeField(auto_now_add= True)
    modified_at = models.DateTimeField(auto_now= True)
    created_by = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True, related_name = "%(class)s_created_by")
    updated_by = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True, related_name = "%(class)s_updated_by")
    is_deleted = models.BooleanField(default = False)
    
    class Meta:
        abstract = True
    