# Generated by Django 5.1 on 2024-09-09 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calls', '0004_alter_call_meet_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='call',
            name='zone',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
