from rest_framework import serializers
from customers_api.models import CustomerJobRequests
from .models import ArtisanPayment

class MpesaNumberSerializer(serializers.Serializer):
    mpesa_number = serializers.CharField()
    # job_request_id = serializers.IntegerField()
    job_request_id = serializers.PrimaryKeyRelatedField(queryset=CustomerJobRequests.objects.all())


class ArtisanPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanPayment
        fields = '__all__'