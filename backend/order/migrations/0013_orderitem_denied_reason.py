# Generated by Django 4.2.6 on 2024-03-07 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0012_alter_order_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='denied_reason',
            field=models.TextField(default=None, null=True),
        ),
    ]