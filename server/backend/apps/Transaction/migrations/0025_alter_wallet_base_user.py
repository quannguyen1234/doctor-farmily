# Generated by Django 4.1.7 on 2023-05-22 08:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Transaction', '0024_historypayment_amount_from_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wallet',
            name='base_user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='wallet', to=settings.AUTH_USER_MODEL),
        ),
    ]
