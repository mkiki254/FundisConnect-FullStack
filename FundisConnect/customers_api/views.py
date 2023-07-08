from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CustomerJobRequests
from .serializers import CustomerJobRequestSerializer, CustomerDetailsSerializer
from user_api.permissions import IsCustomer
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user, get_user_model
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
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    # Deriving objects based on logged in user
    def get_object(self, job_request_id):
        try:
            return CustomerJobRequests.objects.get(job_request_id=job_request_id)
        except CustomerJobRequests.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
    
    def get(self, request, job_request_id):
        customer_job_request = self.get_object(job_request_id)
        serializer = CustomerJobRequestSerializer(customer_job_request)
        return Response(serializer.data)
    
    def put(self, request, job_request_id):
        customer_job_request = self.get_object(job_request_id)
        serializer = CustomerJobRequestSerializer(customer_job_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, job_request_id):
        customer_job_request = self.get_object(job_request_id)
        customer_job_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

User = get_user_model()
class CustomerDetailsAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        customer_details = User.objects.filter(usertype='customer')
        serializer = CustomerDetailsSerializer(customer_details, many=True)
        return Response(serializer.data)