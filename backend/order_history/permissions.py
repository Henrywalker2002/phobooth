from base.permission import BaseAdvancedPermission
from rest_framework import permissions


class OrderHistoryPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return self.is_customer(request)
    
    def has_object_permission(self, request, view, obj):
        if self.is_staff(request) or self.is_admin(request):
            return True
        else:
            if request.method in permissions.SAFE_METHODS:
                if obj.order.customer == request.user:
                    return True
                elif self.is_studio(request) and obj.order.studio == request.user.studio:
                    return True 
            else:
                return self.is_customer(request) and obj.order.customer == request.user
                    
            