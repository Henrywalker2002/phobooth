# Generated by Django 4.2.6 on 2024-04-02 05:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studio', '0015_studio_account_number_studio_bank_bin'),
    ]

    operations = [
        migrations.AddField(
            model_name='studio',
            name='account_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
