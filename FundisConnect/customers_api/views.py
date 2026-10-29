from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CustomerJobRequests
from .serializers import CustomerJobRequestSerializer, CustomerDetailsSerializer
from user_api.permissions import IsCustomer
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user, get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from payment_api.models import ArtisanPayment
from user_api.permissions import IsArtisan

def visible_job_requests(user):
    """Job requests this user may read: a customer's own, or those addressed to the artisan."""
    if user.usertype == 'customer':
        return CustomerJobRequests.objects.filter(customer=user)
    if user.usertype == 'artisan':
        return CustomerJobRequests.objects.filter(selected_artisan__user=user)
    return CustomerJobRequests.objects.none()


def owned_job_requests(user):
    """Job requests this user may change or delete: only the customer who created them."""
    return CustomerJobRequests.objects.filter(customer=user)


class CustomerJobRequestsListAPIView(APIView):
    def get_permissions(self):
        # Anyone logged in may list (the queryset is scoped by role); only customers may create
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsCustomer()]
        return [permissions.IsAuthenticated()]
    authentication_classes = (SessionAuthentication, )
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        customer_job_requests = visible_job_requests(request.user)
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

    def get(self, request, job_request_id):
        customer_job_request = get_object_or_404(
            visible_job_requests(request.user), job_request_id=job_request_id)
        serializer = CustomerJobRequestSerializer(customer_job_request)
        return Response(serializer.data)

    def put(self, request, job_request_id):
        customer_job_request = get_object_or_404(
            owned_job_requests(request.user), job_request_id=job_request_id)
        serializer = CustomerJobRequestSerializer(customer_job_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, job_request_id):
        customer_job_request = get_object_or_404(
            owned_job_requests(request.user), job_request_id=job_request_id)
        customer_job_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

User = get_user_model()
class CustomerDetailsAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsArtisan)
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        paid_customer_ids = ArtisanPayment.objects.filter(
            artisan=request.user).values_list('job_request_id__customer', flat=True)
        customer_details = User.objects.filter(pk__in=paid_customer_ids, usertype='customer')
        serializer = CustomerDetailsSerializer(customer_details, many=True)
        return Response(serializer.data)