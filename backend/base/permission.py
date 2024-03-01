from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and "admin" in request.user.role.values_list("code_name", flat=True)


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and "staff" in request.user.role.values_list("code_name", flat=True)


class IsCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and "customer" in request.user.role.values_list("code_name", flat=True)
    

class IsStudio(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and "studio" in request.user.role.values_list("code_name", flat=True)
    

class BaseAdvancedPermission(permissions.BasePermission):
    """
    Have 4 methods to check user role
    """
    
    def is_admin(self, request):
        return request.user.is_authenticated and "admin" in request.user.role.values_list("code_name", flat=True)
    
    def is_staff(self, request):
        return request.user.is_authenticated and "staff" in request.user.role.values_list("code_name", flat=True)
    
    def is_customer(self, request):
        return request.user.is_authenticated and "customer" in request.user.role.values_list("code_name", flat=True)
    
    def is_studio(self, request):
        return request.user.is_authenticated and "studio" in request.user.role.values_list("code_name", flat=True)