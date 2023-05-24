from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ArtisanPersonalInfo
from .serializers import ArtisanPersonalInfoSerializer


class ArtisanPersonalInfoListAPIView(APIView):
    def get(self, request):
        artisan_personal_info = ArtisanPersonalInfo.objects.all()
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ArtisanPersonalInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArtisanPersonalInfoDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return ArtisanPersonalInfo.objects.get(pk=pk)
        except ArtisanPersonalInfo.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    
    def get(self, request, pk):
        artisan_personal_info = self.get_object(pk)
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info)
        return Response(serializer.data)
    
    def put(self, request, pk):
        artisan_personal_info = self.get_object(pk)
        serializer = ArtisanPersonalInfoSerializer(artisan_personal_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        artisan_personal_info = self.get_object(pk)
        artisan_personal_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

