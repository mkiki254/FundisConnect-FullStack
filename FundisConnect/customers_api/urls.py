from django.urls import path
from .views import CustomerJobRequestsListAPIView, CustomerJobRequestsDetailAPIView, CustomerDetailsAPIView

urlpatterns = [
    path('', CustomerJobRequestsListAPIView.as_view(), name="JobInfo"),
    path('<int:job_request_id>/', CustomerJobRequestsDetailAPIView.as_view(), name="JobInfoDetails"),
    path('customer-details/', CustomerDetailsAPIView.as_view(), name="customer details")
]