# Generated by Django 4.1.7 on 2023-03-29 11:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('PersonalManagement', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='HospitalDepartments',
            new_name='HospitalDepartment',
        ),
        migrations.AlterModelTable(
            name='hospitaldepartment',
            table='HospitalDepartment',
        ),
    ]