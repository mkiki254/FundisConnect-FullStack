from artisans_api.models import ArtisanPersonalInfo
from rest_framework import serializers

class ArtisanPersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanPersonalInfo
        fields = '__all__'
        
   