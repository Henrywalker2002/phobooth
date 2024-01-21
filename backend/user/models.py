from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True, editable=False)
    username = models.CharField(unique=True, max_length=128)

    email = models.EmailField(unique=True, max_length=128)
    password = models.CharField(max_length=128, null=False)
    full_name = models.CharField(max_length=128, null=False)
    is_active = models.BooleanField(default=True)
    role = models.ManyToManyField(to="role.Role")
    avatar = models.ImageField(upload_to="avatars/", null=True)
    google_id = models.IntegerField(null=True)
    facebook_id = models.IntegerField(null=True)
    studio = models.OneToOneField(
        to="studio.Studio", on_delete=models.SET_NULL, null=True, default=None
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    objects = BaseUserManager()

    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username
