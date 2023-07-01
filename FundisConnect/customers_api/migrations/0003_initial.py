# Generated by Django 4.2.1 on 2023-06-20 18:08

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('artisans_api', '0012_artisanpersonalinfo_profile_picture'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('customers_api', '0002_delete_customerjobrequests'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerJobRequests',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('job_title', models.CharField(max_length=50)),
                ('job_photo_video', models.FileField(blank=True, null=True, upload_to='videos/')),
                ('job_description', models.TextField(max_length=500)),
                ('schedule', models.DateTimeField()),
                ('address', models.CharField(max_length=150)),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('customer', models.ForeignKey(limit_choices_to={'usertype': 'customer'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('selected_artisan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='artisans_api.artisanpersonalinfo')),
            ],
        ),
    ]