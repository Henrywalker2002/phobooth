from rest_framework import viewsets
from role.models import Role, Permission
from role.serializers import RoleSerializer, PermissionSerializer
from base.views import CustomModelViewSetBase
from rest_framework import permissions


class RoleViewSet(CustomModelViewSetBase):
    queryset = Role.objects.all()
    serializer_class = {"default" : RoleSerializer}
    # permission_classes = [permissions.AllowAny]
    

class PermissionViewSet(CustomModelViewSetBase):
    queryset = Permission.objects.all()
    serializer_class = {"default" : PermissionSerializer}
    # permission_classes = [permissions.AllowAny]