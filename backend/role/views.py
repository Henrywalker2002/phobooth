from role.models import Role, Permission
from role.serializers import RoleSerializer, PermissionSerializer
from base.views import CustomModelViewSetBase


class RoleViewSet(CustomModelViewSetBase):
    queryset = Role.objects.all()
    serializer_class = {"default" : RoleSerializer}
    filterset_fields = ['code_name']
    

class PermissionViewSet(CustomModelViewSetBase):
    queryset = Permission.objects.all()
    serializer_class = {"default" : PermissionSerializer}
    filterset_fields = ['code_name']