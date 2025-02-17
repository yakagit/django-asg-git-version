# Generated by Django 5.1 on 2024-09-03 14:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='HeadCustomer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=45, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderManager',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=45, null=True)),
                ('surname', models.CharField(blank=True, max_length=45, null=True)),
                ('patronymic', models.CharField(blank=True, max_length=45, null=True)),
                ('phone', models.CharField(blank=True, max_length=45, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=45, null=True)),
                ('head_customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='core.headcustomer')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('zone', models.CharField(blank=True, max_length=45, null=True)),
                ('order_num', models.CharField(blank=True, max_length=45, null=True)),
                ('order_date', models.DateField(blank=True, null=True)),
                ('object_full_name', models.CharField(blank=True, max_length=45, null=True)),
                ('object_short_name', models.CharField(blank=True, max_length=45, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='core.customer')),
                ('order_manager', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='core.ordermanager')),
            ],
        ),
    ]
