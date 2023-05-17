from rest_framework.permissions import BasePermission

# Defining permissions based on usertype

# For artisans
class IsArtisan(BasePermission):
    def has_permission(self, request, view):
        return request.user.usertype == 'artisan'

# For customers
class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.usertype == 'customer'

# For admin
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.usertype == 'admin'