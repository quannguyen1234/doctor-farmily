# Generated by Django 4.1.7 on 2023-05-22 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0021_historypayment_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosticbilldetail',
            name='total_fee',
            field=models.FloatField(default=0, editable=False),
        ),
    ]
