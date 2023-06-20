from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserPermissionsSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from .permissions import IsArtisan, IsCustomer, IsAdmin
# from django.views.decorators.csrf import csrf_exempt
# from django.core.mail import send_mail
# import json
# from django.contrib.auth.tokens import default_token_generator
# from django.contrib.auth import get_user_model
# from django.http import JsonResponse
# from .models import PasswordResetToken


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


# @csrf_exempt
# def initiate_password_reset(request):
#     if request.method == 'POST':
#         body = json.loads(request.body)
#         email = body.get('email')
#         User = get_user_model()

#         # Find the user with the provided email
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return JsonResponse({'message': 'User not found'}, status=404)

#         # Generate a password reset token
#         token = default_token_generator.make_token(user)

#         # Build the password reset URL
#         # reset_url = f'{FRONTEND_URL}/password-reset/confirm/{token}/'
#         # print(reset_url)

#         # Save the password reset token to the database
#         PasswordResetToken.objects.create(user=user, token=token)

#         # Send the password reset email
#         send_mail(
#             'Password Reset',
#             f'Please click the following link to reset your password:',
#             'sender@example.com',
#             [email],
#             fail_silently=False,
#         )

#         return JsonResponse({'message': 'Password reset email sent'})
    

# @csrf_exempt
# def confirm_password_reset(request, token):
#     if request.method == 'POST':
#         body = json.loads(request.body)
#         password = body.get('password')
#         confirm_password = body.get('confirmPassword')
         
#         print(password)

#         # Validate the password and confirm password
#         if password != confirm_password:
#             return JsonResponse({'message': 'Passwords do not match'}, status=400)

#         # User model
#         User = get_user_model()
       
#         # Find the user with the provided token
#         try:
#             password_reset_token = PasswordResetToken.objects.get(token=token)
#         except User.DoesNotExist:
#             return JsonResponse({'message': 'Invalid token'}, status=400)

#         user = password_reset_token.user

#         # hashed_password = make_password(password)
#         # print("Password:", hashed_password)
#         print(password)
#         # Set the new password
#         user.set_password(password)
#         user.save()

#         return JsonResponse({'message': 'Password reset successfully'})




