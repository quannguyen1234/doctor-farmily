# Generated by Django 4.1.7 on 2023-05-21 09:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0024_doctor_diagnostic_fee_doctor_diagnostic_fee_gte_0'),
        ('Booking', '0012_connectdoctor_diagnostic_bill'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rating',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='doctor_ratings', to='User.doctor'),
        ),
    ]
