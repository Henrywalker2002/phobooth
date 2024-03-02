from user.models import User
from role.models import Role
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    
    help = 'Create an admin'

    def handle(self, *args, **kwargs):
        role = Role.objects.filter(code_name="admin").first()
        if not role:
            raise CommandError("Admin role does not exist")
        admin = User(username = "admin", password = "password", full_name = "Admin", 
                     email = "admin@email.com")
        admin.set_password("password")
        admin.save()
        admin.role.set([role])