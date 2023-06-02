from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import ArtisanPersonalInfo

@admin.register(ArtisanPersonalInfo)
class ArtisanPersonalInfoAdmin(OSMGeoAdmin):
    list_display = ('user', 'first_name', 'last_name', 'location', 'specialization', "profile_picture")
