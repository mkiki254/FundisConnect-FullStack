from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ArtisanPersonalInfo
from .serializers import ArtisanPersonalInfoSerializer
from user_api.permissions import IsArtisan
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user
from .validations import profileCustomValidation
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

class ArtisanPersonalInfoListAPIView(APIView):
    def get_permissions(self):
        # Browsing artisans is open to any logged-in user; creating a profile is for artisans only
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsArtisan()]
        return [permissions.IsAuthenticated()]
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        artisan_personal_info = ArtisanPersonalInfo.objects.all()
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        if ArtisanPersonalInfo.objects.filter(user=request.user).exists():
            return Response({'detail': ['You already have an artisan profile.']},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = ArtisanPersonalInfoSerializer(data=request.data)
        if serializer.is_valid():
            user = get_user(request)   #Get the logged in user
            serializer.save(user=user) #Set the foreign key to the logged in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArtisanPersonalInfoDetailAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsArtisan, )
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    # Deriving objects based on logged in user
    def get_object(self, user_id):
        return get_object_or_404(ArtisanPersonalInfo, user_id=user_id)
    
    def get(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        artisan_personal_info = self.get_object(user_id = userId)
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info)
        return Response(serializer.data)
    
    def put(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        artisan_personal_info = self.get_object(user_id= userId)
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        artisan_personal_info = self.get_object(user_id= userId)
        artisan_personal_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

