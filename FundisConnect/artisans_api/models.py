from django.contrib.gis.db import models
from user_api.models import AppUser


class ArtisanPersonalInfo(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, limit_choices_to={'usertype': 'artisan'})
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    # https://hackernoon.com/how-to-build-location-based-app-with-geodjango-bk1i356x
    location = models.PointField()
    SPECIALIZATION_CHOICES = [
        ('plumber', 'plumber'),
        ('electrician', 'electrician'),
        ('carpenter', 'carpenter'),
        ('mason', 'mason'),
        ('tiling', 'tiling'),
        ('painter', 'painter')
    ]
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES)
    profile_picture = models.ImageField(upload_to='images/', blank=True, null=True)