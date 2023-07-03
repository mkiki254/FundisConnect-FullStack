from django.urls import path, include
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('artisan', views.ArtisanView.as_view(), name='artisan'),
    path('customer', views.CustomerView.as_view(), name='customer'),
    path('permissions', views.UserPermissionsView.as_view(), name='permissions'),
    path('admin', views.AdminView.as_view(), name='admin'),
    path('artisan/profile/', include('artisans_api.urls')),
    path('customer/jobrequest/', include('customers_api.urls')),
    path('password_reset/', views.PasswordResetRequestView.as_view(), name='initiate_password_reset'),
    path('password_reset_confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
