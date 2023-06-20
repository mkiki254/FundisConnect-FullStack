from django.contrib.gis.db import models
from user_api.models import AppUser

class CustomerJobRequests(models.Model):
     user = models.OneToOneField(AppUser, on_delete=models.CASCADE, limit_choices_to={'usertype': 'customer'})
     jobtitle = models.CharField(max_length=50)
     jobphotovideo = models.FileField(upload_to='videos/', blank=True, null=True)
     jobdescription = models.TextField(max_length=500)
     schedule = models.DateTimeField()
     address = models.CharField(max_length=150)
     location = models.PointField()
