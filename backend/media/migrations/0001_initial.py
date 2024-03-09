# Generated by Django 4.2.6 on 2024-03-07 07:25

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
            name='Media',
            fields=[
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('media_from', models.JSONField()),
                ('media_to', models.JSONField()),
                ('content', models.TextField()),
                ('content_type', models.CharField(choices=[('TEXT_PLAIN', 'TEXT_PLAIN'), ('HTML', 'HTML')], default='TEXT_PLAIN', max_length=128)),
                ('send_method', models.CharField(choices=[('EMAIL', 'EMAIL'), ('MESSAGE', 'MESSAGE'), ('SMS', 'SMS')], default='EMAIL', max_length=128)),
                ('status', models.CharField(choices=[('IN_QUEUE', 'IN_QUEUE'), ('IN_PROCESS', 'IN_PROCESS'), ('SUCCESS', 'SUCCESS'), ('FAIL', 'FAIL')], default='IN_QUEUE', max_length=128)),
                ('retry_count', models.IntegerField(default=0)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]