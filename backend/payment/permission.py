from base.permission import BaseAdvancedPermission
from rest_framework import permissions

class PaymentPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if view.action == "handle_payment_return":
            return True
        elif view.action == "refund":
            return self.is_admin(request) or self.is_staff(request)
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return self.is_studio(request)
    
    def has_object_permission(self, request, view, obj):
        if view.action in ["get_payment_url"]:
            return obj.order.customer == request.user
        return obj.order.studio == request.user.studio or obj.order.customer == request.user
    