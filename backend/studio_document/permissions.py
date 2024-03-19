from base.permission import BaseAdvancedPermission
from rest_framework.permissions import SAFE_METHODS


class StudioDocumentPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if view.action == "create":
            return self.is_studio(request)
        elif view.action in SAFE_METHODS:
            return self.is_admin(request) or self.is_staff(request) or self.is_studio(request)
        else:
            return self.is_admin(request) or self.is_staff(request) 
    
    def has_object_permission(self, request, view, obj):
        return self.is_admin(request) or self.is_staff(request) or (self.is_studio(request) and obj.studio == request.user.studio)