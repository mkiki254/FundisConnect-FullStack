from artisans_api.models import ArtisanPersonalInfo
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class ArtisanPersonalInfoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ArtisanPersonalInfo
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['user']
        
   