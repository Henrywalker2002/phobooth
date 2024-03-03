from rest_framework import permissions 
from base.permission import BaseAdvancedPermission


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "sign_up":
            return True 
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.id == request.user.id
    

class StaffPermission(BaseAdvancedPermission):
    def has_permission(self, request, view):
        if view.action in ["create", "list"]:
            return self.is_admin(request)
        return self.is_staff(request) or self.is_admin(request)
    
    def has_object_permission(self, request, view, obj):
        return self.is_admin(request) or obj.id == request.user.id