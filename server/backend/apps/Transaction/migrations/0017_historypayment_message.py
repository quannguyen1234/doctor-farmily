# Generated by Django 4.1.7 on 2023-05-21 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0016_historypayment'),
    ]

    operations = [
        migrations.AddField(
            model_name='historypayment',
            name='message',
            field=models.TextField(null=True),
        ),
    ]