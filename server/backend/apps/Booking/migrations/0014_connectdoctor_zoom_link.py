# Generated by Django 4.1.7 on 2023-05-22 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Booking', '0013_alter_rating_doctor'),
    ]

    operations = [
        migrations.AddField(
            model_name='connectdoctor',
            name='zoom_link',
            field=models.TextField(null=True),
        ),
    ]
