# Generated by Django 4.1.7 on 2023-05-10 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transaction', '0003_diagnosticbill_diagnosticbilldetail'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosticbill',
            name='diagnostic_form',
            field=models.CharField(choices=[(0, 'ONLINE'), (1, 'OFLINE')], default='cc', max_length=32),
            preserve_default=False,
        ),
    ]