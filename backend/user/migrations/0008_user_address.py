# Generated by Django 4.2.6 on 2024-03-09 08:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0007_rename_provide_address_province_and_more'),
        ('user', '0007_alter_user_studio'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='address.address'),
        ),
    ]