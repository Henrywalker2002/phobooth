# Generated by Django 4.1.13 on 2024-05-06 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0007_alter_category_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='category',
            name='updated_by',
        ),
    ]