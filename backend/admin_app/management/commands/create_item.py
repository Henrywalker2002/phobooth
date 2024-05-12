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
        role = Role.objects.filter(
            code_name__in=["studio", "customer"]).all()
        first_user = User.objects.create(
            username="first user", email="first@email.com", password="password", full_name="First User")
        first_user.set_password("password")
        first_user.save()
        first_user.role.set(role)
        first_studio = Studio.objects.create(
            friendly_name="first studio", code_name="first_studio", description="first studio description",
            email="first@email.com", phone="0262458212")
        first_user.own_studio = first_studio
        first_user.save()
        Item.objects.create(
            name="school photo", description="school photo description", type=ItemTypeChoices.SERVICE,
            studio=first_studio, min_price=1000, max_price=2000)
        Item.objects.create(name="company photo", description="company photo description",
                            type=ItemTypeChoices.SERVICE, studio=first_studio, min_price=2000, max_price=3000)