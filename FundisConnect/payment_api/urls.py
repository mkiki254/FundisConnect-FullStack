from django.urls import path, include
from .views import PaymentAPIView, PaymentResultsAPIView

urlpatterns = [
    path('', PaymentAPIView.as_view(), name="payment"),
    path('results/', PaymentResultsAPIView.as_view(), name="payment"),
]