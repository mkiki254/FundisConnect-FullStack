# Generated by Django 4.2.1 on 2023-06-02 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artisans_api', '0011_remove_artisanpersonalinfo_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='artisanpersonalinfo',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
