# Generated by Django 4.2.6 on 2024-04-17 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('role', '0007_alter_role_permission'),
    ]

    operations = [
        migrations.AddField(
            model_name='permission',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='role',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
