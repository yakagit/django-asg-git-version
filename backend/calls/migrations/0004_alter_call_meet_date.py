# Generated by Django 5.1 on 2024-09-04 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calls', '0003_alter_call_agent_alter_call_agent_phone_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='call',
            name='meet_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
