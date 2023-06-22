from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import CustomerJobRequests

@admin.register(CustomerJobRequests)
class CustomerJobRequestsAdmin(OSMGeoAdmin):
    list_display = ('job_request_id', 'customer', 'selected_artisan', 'job_title', 'job_photo_video', 'job_description', 'schedule', 'address', 'location')


