# Generated by Django 4.2.6 on 2024-02-26 12:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0009_rename_transportion_price_order_transportation_price'),
        ('payment', '0002_payment_bank_tran_no_payment_number_attemp_in_day_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='order.order'),
        ),
    ]
