# Generated by Django 4.2.6 on 2024-04-17 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studio', '0020_merge_0019_studio_account_balance_0019_studio_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='studio',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
