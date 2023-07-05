from rest_framework import serializers

class MpesaNumberSerializer(serializers.Serializer):
    mpesa_number = serializers.CharField()