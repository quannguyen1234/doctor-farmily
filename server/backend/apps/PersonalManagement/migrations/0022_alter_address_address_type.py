# Generated by Django 4.1.7 on 2023-05-20 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PersonalManagement', '0021_hospitaldepartment_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='address_type',
            field=models.IntegerField(choices=[(1, 'CurrentAddress'), (2, 'BookingCalendarAddress')], max_length=60, null=True),
        ),
    ]
