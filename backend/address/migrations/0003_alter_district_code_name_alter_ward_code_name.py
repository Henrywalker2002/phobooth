# Generated by Django 4.2.6 on 2024-01-23 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0002_alter_district_id_alter_ward_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='district',
            name='code_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='ward',
            name='code_name',
            field=models.CharField(max_length=100),
        ),
    ]