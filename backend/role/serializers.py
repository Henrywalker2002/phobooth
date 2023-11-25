from rest_framework import serializers
from role.models import Role, Permission


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'friendly_name', 'code_name', "description", 'permission']
        

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'friendly_name', "code_name", 'description']