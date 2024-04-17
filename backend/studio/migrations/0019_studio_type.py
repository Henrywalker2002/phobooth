# Generated by Django 4.2.6 on 2024-04-17 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studio', '0018_merge_0016_studio_account_name_0017_alter_studio_star'),
    ]

    operations = [
        migrations.AddField(
            model_name='studio',
            name='type',
            field=models.CharField(choices=[('STUDIO', 'STUDIO'), ('PHOTOGRAPHER', 'PHOTOGRAPHER')], default='STUDIO', max_length=255),
        ),
    ]
