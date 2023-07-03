from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserPermissionsSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from .permissions import IsArtisan, IsCustomer, IsAdmin
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from .serializers import PasswordResetRequestSerializer
from .models import PasswordResetToken
from django.urls import reverse
from .serializers import PasswordResetConfirmSerializer


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


class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            User = get_user_model()

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'message': 'User not found'}, status=404)

            token = default_token_generator.make_token(user)
            PasswordResetToken.objects.create(user=user, token=token)
            reset_url = request.build_absolute_uri(reverse('password_reset_confirm'))
            reset_url += f'?token={token}'

            # Send the password reset email
            send_mail(
                'Password Reset',
                f'Please click the following link to reset your password: {reset_url}',
                'sender@example.com',
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            token = request.query_params.get('token')

            if token is None:
                return Response({'message': 'Token not provided'}, status=400)

            try:
                password_reset_token = PasswordResetToken.objects.get(token=token)
            except PasswordResetToken.DoesNotExist:
                return Response({'message': 'Invalid token'}, status=400)

            user = password_reset_token.user
            user.set_password(password)
            user.save()

            password_reset_token.delete()

            return Response({'message': 'Password reset successful'})
        else:
            return Response(serializer.errors, status=400)



