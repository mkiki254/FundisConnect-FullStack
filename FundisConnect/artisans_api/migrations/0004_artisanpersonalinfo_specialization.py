# Generated by Django 4.2.1 on 2023-05-24 10:41

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artisans_api', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='artisanpersonalinfo',
            name='specialization',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, choices=[('plumber', 'plumber'), ('electrician', 'electrician'), ('carpenter', 'carpenter'), ('mason', 'mason'), ('tiling', 'tiling')], max_length=50), default=('plumber', 'plumber'), size=None),
            preserve_default=False,
        ),
    ]