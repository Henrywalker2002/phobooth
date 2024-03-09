# Generated by Django 4.2.6 on 2024-03-08 11:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('subject', models.CharField(max_length=255)),
                ('verb', models.CharField(choices=[('CREATED', 'CREATED'), ('COMPLETED', 'COMPLETED'), ('PAID', 'PAID'), ('ADD', 'ADD'), ('ACCEPTED', 'ACCEPTED'), ('DENIED', 'DENIED'), ('CANCELED', 'CANCELED')], max_length=255)),
                ('direct_object', models.CharField(max_length=255)),
                ('indirect_object', models.CharField(max_length=255, null=True)),
                ('prepositional_object', models.CharField(max_length=255, null=True)),
                ('context', models.TextField(null=True)),
                ('is_read', models.BooleanField(default=False)),
                ('redirect_type', models.CharField(max_length=255)),
                ('redirect_id', models.IntegerField()),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]