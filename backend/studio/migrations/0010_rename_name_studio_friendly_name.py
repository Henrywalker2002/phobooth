# Generated by Django 4.2.2 on 2023-11-24 14:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('studio', '0009_studio_code_name_alter_studioaddress_studio'),
    ]

    operations = [
        migrations.RenameField(
            model_name='studio',
            old_name='name',
            new_name='friendly_name',
        ),
    ]
