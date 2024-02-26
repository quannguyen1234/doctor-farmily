# Generated by Django 4.1.7 on 2023-03-30 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0019_remove_doctor_notarized_image'),
        ('PersonalManagement', '0006_alter_image_base_user_alter_image_image_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='hospitaldepartment',
            name='doctors',
            field=models.ManyToManyField(related_name='departments', through='PersonalManagement.DoctorDepartment', to='User.doctor'),
        ),
    ]