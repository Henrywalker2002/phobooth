import uuid 
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser 

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key= True, default= uuid.uuid4, editable= False)
    username = models.CharField(unique=True, max_length= 128)
    phone = models.CharField(max_length=16, default= None, null= True)
    email = models.EmailField(unique=True, max_length=128)
    password = models.CharField(max_length=128, null=False)
    full_name = models.CharField(max_length=128, null=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    objects = BaseUserManager()
    
    USERNAME_FIELD = 'username'
    
    def __str__(self):
        return self.username
    

