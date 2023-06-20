from customers_api.models import CustomerJobRequests
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class CustomerJobRequestSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CustomerJobRequests
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['customer']