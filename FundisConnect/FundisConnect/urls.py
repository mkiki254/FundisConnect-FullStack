from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django_api_admin.sites import site

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api_admin/', site.urls),
    path('api/', include('user_api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
