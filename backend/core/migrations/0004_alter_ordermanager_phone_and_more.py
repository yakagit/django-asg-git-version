# Generated by Django 5.1 on 2024-09-05 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_customer_name_alter_headcustomer_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ordermanager',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='ordermanager',
            unique_together={('name', 'surname')},
        ),
    ]
