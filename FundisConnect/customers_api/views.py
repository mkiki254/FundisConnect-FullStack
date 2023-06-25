from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CustomerJobRequests
from .serializers import CustomerJobRequestSerializer
from user_api.permissions import IsCustomer
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user
from rest_framework.parsers import MultiPartParser, FormParser

class CustomerJobRequestsListAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        customer_job_requests = CustomerJobRequests.objects.all()
        serializer = CustomerJobRequestSerializer(customer_job_requests, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CustomerJobRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = get_user(request)   #Get the logged in user
            serializer.save(customer=user) #Set the foreign key to the logged in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerJobRequestsDetailAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsCustomer, )
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    # Deriving objects based on logged in user
    def get_object(self, customer_id):
        try:
            return CustomerJobRequests.objects.get(customer_id=customer_id)
        except CustomerJobRequests.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    
    def get(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        customer_job_request = self.get_object(customer_id = userId)
        serializer = CustomerJobRequestSerializer(customer_job_request)
        return Response(serializer.data)
    
    def put(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        customer_job_request = self.get_object(customer_id= userId)
        serializer = CustomerJobRequestSerializer(customer_job_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        # Getting id of logged in user
        user = get_user(request)
        userId = user.pk

        customer_job_request = self.get_object(customer_id= userId)
        customer_job_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)