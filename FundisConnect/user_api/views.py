from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserPermissionsSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from .permissions import IsArtisan, IsCustomer, IsAdmin

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=False):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.
                                HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny, )
    authentication_classes = (SessionAuthentication, )
    ##
    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogout(APIView):
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    ##
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
class UserPermissionsView(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, format=None):
        user_permissions = list(request.user.get_all_permissions())
        serializer = UserPermissionsSerializer(data={'permissions': user_permissions}, context={'request': request})
        serializer.is_valid()
        return Response(serializer.data)
    

class ArtisanView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsArtisan, )
    authentication_classes = (SessionAuthentication, )


class CustomerView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer, )
    authentication_classes = (SessionAuthentication, )

class AdminView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAdmin, )
    authentication_classes = (SessionAuthentication, )