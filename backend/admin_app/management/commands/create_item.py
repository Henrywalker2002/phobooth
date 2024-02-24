from django.core.management.base import BaseCommand, CommandError
import socket
from user.models import User
from studio.models import Studio
from item.models import Item, ItemTypeChoices
from role.models import Role
from django.db import transaction


class Command(BaseCommand):
    help = 'Create an item'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        port = 8000
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("localhost", port))
                raise CommandError(f"Please run the server on port {port}")
            except OSError:
                role = Role.objects.filter(
                    code_name__in=["studio", "customer"]).all()
                first_user = User.objects.create(
                    username="first user", email="first@email.com", password="password", full_name="First User")
                first_user.set_password("password")
                first_user.role.set(role)
                first_studio = Studio.objects.create(
                    friendly_name="first studio", code_name="first_studio", description="first studio description",
                    email="first@email.com", phone="0262458212", user=first_user)
                Item.objects.create(
                    name="school photo", description="school photo description", type=ItemTypeChoices.SERVICE,
                    studio=first_studio, min_price=1000, max_price=2000)
                Item.objects.create(name="company photo", description="company photo description",
                                    type=ItemTypeChoices.SERVICE, studio=first_studio, min_price=2000, max_price=3000)

                sencond_user = User.objects.create(
                    username="second user", email="second@email.com", password="password", full_name="Second User")
                sencond_user.set_password("password")
                sencond_user.role.set(role)
                second_studio = Studio.objects.create(friendly_name="second studio", code_name="second_studio",
                                                      description="second studio description", email="second@email.com",
                                                      phone="0262458213", user=sencond_user)
                Item.objects.create(name="park photo", description="park photo description",
                                    type=ItemTypeChoices.SERVICE, studio=second_studio, min_price=13000, max_price=20002)
                Item.objects.create(name="home photo", description="home photo description",
                                    type=ItemTypeChoices.SERVICE, studio=second_studio, min_price=1000, max_price=2002)
