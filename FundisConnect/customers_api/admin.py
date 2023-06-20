from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import CustomerJobRequests

@admin.register(CustomerJobRequests)
class CustomerJobRequestsAdmin(OSMGeoAdmin):
    list_display = ('user', 'jobtitle', 'jobphotovideo', 'jobdescription', 'schedule', 'address', 'location')


