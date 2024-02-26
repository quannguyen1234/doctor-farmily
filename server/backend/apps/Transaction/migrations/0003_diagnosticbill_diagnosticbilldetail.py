# Generated by Django 4.1.7 on 2023-05-10 15:07

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0024_doctor_diagnostic_fee_doctor_diagnostic_fee_gte_0'),
        ('Transaction', '0002_alter_transaction_payment_method'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiagnosticBill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('pay_time', models.DateTimeField(null=True)),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='User.doctor')),
                ('patient', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='User.patient')),
            ],
            options={
                'db_table': 'DiagnosticBill',
            },
        ),
        migrations.CreateModel(
            name='DiagnosticBillDetail',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('distance', models.IntegerField(default=0)),
                ('doctor_fee', models.FloatField(default=0)),
                ('total_fee', models.FloatField(default=0)),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Transaction.diagnosticbill')),
            ],
            options={
                'db_table': 'DiagnosticBillDetail',
            },
        ),
    ]