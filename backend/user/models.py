from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from address.models import Address


class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True, editable=False)
    username = models.CharField(unique=True, max_length=128)

    email = models.EmailField(unique=True, max_length=128)
    phone = models.CharField(max_length=15, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    password = models.CharField(max_length=128, null=False)
    full_name = models.CharField(max_length=128, null=False)
    address = models.ForeignKey(to=Address, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    role = models.ManyToManyField(to="role.Role")
    avatar = models.ImageField(upload_to="avatars/", null=True)
    google_id = models.IntegerField(null=True)
    facebook_id = models.CharField(max_length=128, null=True)
    is_deleted = models.BooleanField(default=False)
    own_studio = models.OneToOneField(
        to="studio.Studio", on_delete=models.SET_NULL, null=True, default=None, related_name="owner"
    )
    
    word_for_studio = models.ForeignKey(
        to="studio.Studio", on_delete=models.SET_NULL, null=True, default=None, related_name="employee"
    )
    
    @property
    def studio(self):
        if self.own_studio:
            return self.own_studio
        return self.word_for_studio if self.word_for_studio else None

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    objects = BaseUserManager()

    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username
    
    def __eq__(self, other):
        return self.id == other.id

    def __hash__(self) -> int:
        return hash(self.username)