# Generated by Django 4.2.1 on 2023-06-21 11:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers_api', '0003_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customerjobrequests',
            old_name='id',
            new_name='job_request_id',
        ),
    ]
