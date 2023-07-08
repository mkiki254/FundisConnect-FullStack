from customers_api.models import CustomerJobRequests
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

class CustomerJobRequestSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = CustomerJobRequests
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['customer']


User = get_user_model()   
class CustomerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'email', 'username', 'usertype', 'phone')

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(usertype='customer')
