# Generated by Django 4.2 on 2023-05-15 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0005_alter_appuser_usertype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='usertype',
            field=models.CharField(max_length=20),
        ),
    ]
