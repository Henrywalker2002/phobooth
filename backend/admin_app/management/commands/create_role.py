from typing import Any
from role.models import Role, Permission
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "create role"
    
    def handle(self, *args: Any, **options: Any) -> str | None:
        role_lst = ["customer", "studio", "admin", "staff"]
        for role in role_lst:
            role_count = Role.objects.filter(code_name=role).count()
            if role_count == 0:
                permission = Permission.objects.filter(code_name=role)
                if not permission:
                    permission = Permission(code_name=role, friendly_name=role, description=role)
                    permission.save()
                role = Role(code_name=role, friendly_name=role, description=role)
                role.save()
                role.permission.set([permission])
                role.save()
    
        