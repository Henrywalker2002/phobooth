from rest_framework import permissions 


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "sign_up":
            return True 
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.id == request.user.id