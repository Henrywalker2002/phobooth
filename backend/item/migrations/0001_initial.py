# Generated by Django 4.2.2 on 2023-11-23 14:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('category', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('is_public', models.BooleanField()),
                ('type', models.CharField(choices=[('SERVICE', 'SERVICE'), ('SERVICE_PACK', 'SERVICE_PACK'), ('PRODUCT', 'PRODUCT'), ('ACCESSORY', 'ACCESSORY')])),
                ('width', models.FloatField(null=True)),
                ('length', models.FloatField(null=True)),
                ('weight', models.FloatField(null=True)),
                ('height', models.FloatField(null=True)),
                ('fixed_price', models.IntegerField(null=True)),
                ('min_price', models.IntegerField(null=True)),
                ('max_price', models.IntegerField(null=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='category.category')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
