from customers_api.models import CustomerJobRequests
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from FundisConnect.validators import validate_upload_size, validate_job_media_extension


class CustomerJobRequestSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CustomerJobRequests
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['customer']
        extra_kwargs = {
            'job_photo_video': {'validators' : [validate_upload_size, validate_job_media_extension]},
        }


User = get_user_model()   
class CustomerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'email', 'username', 'usertype', 'phone')

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(usertype='customer')
