from django.contrib.gis.db import models
from user_api.models import AppUser
from artisans_api.models import ArtisanPersonalInfo

class CustomerJobRequests(models.Model):
     id = models.BigAutoField(primary_key=True)
     customer = models.ForeignKey(AppUser, on_delete=models.CASCADE, limit_choices_to={'usertype': 'customer'})
     selected_artisan = models.ForeignKey(ArtisanPersonalInfo, on_delete=models.CASCADE)
     job_title = models.CharField(max_length=50)
     job_photo_video = models.FileField(upload_to='videos/', blank=True, null=True)
     job_description = models.TextField(max_length=500)
     schedule = models.DateTimeField()
     address = models.CharField(max_length=150)
     location = models.PointField()
