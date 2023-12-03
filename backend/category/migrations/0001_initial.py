# Generated by Django 4.2.2 on 2023-11-23 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('type', models.CharField(choices=[('SERVICE', 'SERVICE'), ('PRODUCT', 'PRODUCT')])),
                ('title', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=512, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]