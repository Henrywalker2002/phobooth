# Generated by Django 4.2.6 on 2024-01-21 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_user_avatar_alter_user_studio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(null=True, upload_to='avatars/'),
        ),
    ]