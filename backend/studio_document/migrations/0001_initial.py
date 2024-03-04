# Generated by Django 4.2.6 on 2024-03-04 03:32

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('studio', '0013_studio_address_delete_studioaddress'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudioDocument',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('phone', models.CharField(max_length=15)),
                ('email', models.EmailField(max_length=255)),
                ('license_date', models.DateField()),
                ('license_number', models.CharField(max_length=255)),
                ('license_issue', models.CharField(max_length=255)),
                ('front_ID_card', models.ImageField(upload_to='studio_document/')),
                ('back_ID_card', models.ImageField(upload_to='studio_document/')),
                ('license', models.FileField(upload_to='studio_document/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpeg', 'pdf', 'jpg', 'png'])])),
                ('denied_reason', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('PENDING', 'PENDING'), ('ACCEPTED', 'ACCEPTED'), ('REJECTED', 'REJECTED')], default='PENDING', max_length=255)),
                ('number_attempts', models.PositiveIntegerField(default=0)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='studio.studio')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]