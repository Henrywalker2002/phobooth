# Generated by Django 4.1.13 on 2024-05-06 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('media', '0003_media_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='media',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='media',
            name='updated_by',
        ),
    ]
