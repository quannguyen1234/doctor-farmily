# Generated by Django 4.1.7 on 2023-05-21 04:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0014_diagnosticbill_is_pay'),
        ('Booking', '0011_connectdoctor_distance'),
    ]

    operations = [
        migrations.AddField(
            model_name='connectdoctor',
            name='diagnostic_bill',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='Transaction.diagnosticbill'),
        ),
    ]
