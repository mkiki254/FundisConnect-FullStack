from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import CustomerJobRequests
from django_api_admin.sites import site

@admin.register(CustomerJobRequests)
class CustomerJobRequestsAdmin(OSMGeoAdmin):
    list_display = ('job_request_id', 'customer', 'selected_artisan', 'job_title', 'job_photo_video', 'job_description', 'schedule', 'address', 'location')

site.register(CustomerJobRequests)
