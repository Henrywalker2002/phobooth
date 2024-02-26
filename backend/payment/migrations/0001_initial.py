# Generated by Django 4.2.6 on 2024-02-25 08:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('order', '0007_orderitem_variation_alter_orderitem_item'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('no', models.IntegerField(default=1)),
                ('payment_method', models.CharField(choices=[('CASH', 'CASH'), ('BANK', 'BANK'), ('VNPAY', 'VNPAY'), ('OTHER', 'Other')], max_length=20)),
                ('payment_date', models.DateTimeField(default=None, null=True)),
                ('created_at', models.DateField(auto_now_add=True)),
                ('expiration_date', models.DateField()),
                ('amount', models.IntegerField()),
                ('status', models.CharField(choices=[('PENDING', 'PENDING'), ('PAID', 'PAID')], default='PENDING', max_length=20)),
                ('order_type', models.CharField(default='190000', max_length=20)),
                ('order_desc', models.CharField(max_length=100)),
                ('bank_code', models.CharField(blank=True, max_length=20, null=True)),
                ('language', models.CharField(default='vn', max_length=2)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='order.order')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
