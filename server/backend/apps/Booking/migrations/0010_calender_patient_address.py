# Generated by Django 4.1.7 on 2023-05-20 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Booking', '0009_rating_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='calender',
            name='patient_address',
            field=models.TextField(null=True),
        ),
    ]
