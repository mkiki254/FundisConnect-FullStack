# Generated by Django 4.2.1 on 2023-06-01 08:50

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artisans_api', '0008_delete_artisanpersonalinfo'),
    ]

    operations = [
        migrations.CreateModel(
            name='ArtisanPersonalInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('specialization', models.CharField(choices=[('plumber', 'plumber'), ('electrician', 'electrician'), ('carpenter', 'carpenter'), ('mason', 'mason'), ('tiling', 'tiling'), ('painter', 'painter')], max_length=50)),
                ('user', models.OneToOneField(limit_choices_to={'usertype': 'artisan'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]