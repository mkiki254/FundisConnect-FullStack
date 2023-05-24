from django.urls import path
from .views import ArtisanPersonalInfoListAPIView, ArtisanPersonalInfoDetailAPIView

urlpatterns = [
    path('personal-info/', ArtisanPersonalInfoListAPIView.as_view(), name="PersonalInfo"),
    path('personal-info/<int:pk>/', ArtisanPersonalInfoDetailAPIView.as_view(), name="personalInfoDetails")
]