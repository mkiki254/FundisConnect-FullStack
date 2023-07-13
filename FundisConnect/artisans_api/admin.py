from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from .models import ArtisanPersonalInfo
from django.templatetags.static import static

@admin.register(ArtisanPersonalInfo)
class ArtisanPersonalInfoAdmin(OSMGeoAdmin):
    list_display = ('user', 'first_name', 'last_name', 'location', 'specialization', "profile_picture")

   