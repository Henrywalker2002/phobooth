# Generated by Django 4.1.13 on 2024-05-06 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order_history', '0005_orderhistory_is_created_mail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderhistory',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='orderhistory',
            name='updated_by',
        ),
    ]
