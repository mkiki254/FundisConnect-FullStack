from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .permissions import IsAdmin, IsArtisan, IsCustomer


UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model =  UserModel
        fields = '__all__'
    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'],
            username=clean_data['username'], usertype=clean_data['usertype'], 
            phone=clean_data['phone'], password=clean_data['password'])
        user_obj.username = clean_data['username']
        user_obj.usertype = clean_data['usertype']
        user_obj.phone = clean_data['phone']
        user_obj.save()
        return user_obj

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'password')
    email = serializers.EmailField()
    password = serializers.CharField()
    ##
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('User not found. The email or password might be incorrect')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('user_id', 'email', 'username')


class CustomPermissionField(serializers.Field):
    def to_representation(self, value):
        # Convert custom permission value to its string representation
        return str(value)
    
    def to_internal_value(self, data):
        # Convert string representation to custom permission value
        return data

class UserPermissionsSerializer(serializers.Serializer):
    permissions = serializers.ListField(child=CustomPermissionField(),)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user_permissions = []
        
        # Check if 'request' exists in the context
        request = self.context.get('request')
        if IsArtisan().has_permission(request, None):
            user_permissions.append('is_artisan')

        if IsCustomer().has_permission(request, None):
            user_permissions.append('is_customer')

        if IsAdmin().has_permission(request, None):
            user_permissions.append('is_admin')

        representation['permissions'] = user_permissions
        return representation