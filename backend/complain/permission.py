from base.permission import BaseAdvancedPermission
from rest_framework.permissions import SAFE_METHODS

class CompainPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        elif view.action == "create":
            return self.is_customer(request)
        elif view.action in ['update', 'partial_update']:
            return self.is_staff(request) or self.is_admin(request)
        return True

    