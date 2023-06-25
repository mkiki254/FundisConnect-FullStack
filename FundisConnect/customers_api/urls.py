from django.urls import path
from .views import CustomerJobRequestsListAPIView, CustomerJobRequestsDetailAPIView

urlpatterns = [
    path('', CustomerJobRequestsListAPIView.as_view(), name="JobInfo"),
    path('detail/', CustomerJobRequestsDetailAPIView.as_view(), name="JobInfoDetails"),
]