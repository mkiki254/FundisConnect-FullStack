# Generated by Django 4.2.2 on 2023-07-12 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers_api', '0005_alter_customerjobrequests_schedule'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customerjobrequests',
            name='schedule',
            field=models.DateTimeField(),
        ),
    ]
