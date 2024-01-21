from rest_framework import permissions


class StudioPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            if request.user.is_authenticated and "customer" in request.user.role.values_list("code_name", flat=True):
                return True 
            return False
        return request.user.is_authenticated and "studio" in request.user.role.values_list("code_name", flat=True)
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user.studio and obj.id == request.user.studio.id