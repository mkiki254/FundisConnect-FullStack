from artisans_api.models import ArtisanPersonalInfo
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from FundisConnect.validators import validate_upload_size, validate_job_media_extension

class ArtisanPersonalInfoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ArtisanPersonalInfo
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['user']
        extra_kwargs = {
            'profile_picture' : {'validators': [validate_upload_size, validate_job_media_extension]},
        }
        
   