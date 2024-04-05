from base.permission import BaseAdvancedPermission
from rest_framework.permissions import SAFE_METHODS

class CategoryPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return self.is_admin(request) or self.is_staff(request)