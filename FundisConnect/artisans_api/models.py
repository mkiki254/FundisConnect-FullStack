# from django.db import models as djangomodels
from django.contrib.gis.db import models
from user_api.models import AppUser
from django.contrib.postgres.fields import ArrayField

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
    
#     years_of_experience = models.PositiveIntegerField()
#     preferred_working_days = models.CharField(max_length=250)
#     preferred_working_hours = models.CharField(max_length=250)
#     preferred_daily_wage = models.DecimalField(max_digits=10, decimal_places=2)
#     geolocation = models.CharField(max_length=50)
#     certifications = models.CharField(max_length=50)
#     qualifications = models.CharField(max_length=50)
#     id_verification = models.BooleanField(default=False)
#     referee_1_name = models.CharField(max_length=50)
#     referee_1_contact = models.CharField(max_length=50)
#     referee_2_name = models.CharField(max_length=50)
#     referee_2_contact = models.CharField(max_length=50)
#     referee_3_name = models.CharField(max_length=50)
#     referee_3_contact = models.CharField(max_length=50)