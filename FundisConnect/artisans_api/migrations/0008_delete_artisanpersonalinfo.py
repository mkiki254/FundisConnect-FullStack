# Generated by Django 4.2.1 on 2023-06-01 08:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artisans_api', '0007_alter_artisanpersonalinfo_specialization'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ArtisanPersonalInfo',
        ),
    ]
