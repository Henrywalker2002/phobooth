# Generated by Django 4.2.6 on 2024-03-02 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0015_alter_option_product_alter_optionvalue_option_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itempicture',
            name='id',
            field=models.AutoField(editable=False, primary_key=True, serialize=False),
        ),
    ]
