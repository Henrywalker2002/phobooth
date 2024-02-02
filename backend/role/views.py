from role.models import Role, Permission
from role.serializers import RoleSerializer, PermissionSerializer
from base.views import BaseModelViewSet


class RoleViewSet(BaseModelViewSet):
    queryset = Role.objects.all()
    serializer_class = {"default" : RoleSerializer}
    filterset_fields = ['code_name']
    

class PermissionViewSet(BaseModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = {"default" : PermissionSerializer}
    filterset_fields = ['code_name']