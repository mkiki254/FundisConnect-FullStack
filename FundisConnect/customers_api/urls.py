from django.urls import path
from .views import CustomerJobRequestsListAPIView, CustomerJobRequestsDetailAPIView

urlpatterns = [
    path('', CustomerJobRequestsListAPIView.as_view(), name="PersonalInfo"),
    path('detail/', CustomerJobRequestsDetailAPIView.as_view(), name="personalInfoDetails"),
]