# Generated by Django 4.2.6 on 2024-01-24 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item', '0011_remove_itempicture_image_itempicture_item_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='option',
            old_name='item',
            new_name='product',
        ),
        migrations.RemoveField(
            model_name='optionvalue',
            name='variation',
        ),
        migrations.AddField(
            model_name='variation',
            name='stock',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='variation',
            name='value',
            field=models.ManyToManyField(related_name='variations', to='item.optionvalue'),
        ),
        migrations.AlterUniqueTogether(
            name='option',
            unique_together={('name', 'product')},
        ),
    ]
