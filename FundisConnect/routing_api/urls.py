from django.urls import path
from .views import RouteView, RouteDistancesView

urlpatterns = [
    path('', RouteView.as_view(), name='route'),
    path('distances/', RouteDistancesView.as_view(), name='route-distances'),
]