from rest_framework import permissions


class OrderPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        is_customer = request.user.is_authenticated and "customer" in request.user.role.values_list("code_name", flat=True)
        is_studio = request.user.is_authenticated and "studio" in request.user.role.values_list("code_name", flat=True)
        if view.action == "create":
            return is_customer
        if view.action in ["update", "partial_update"]:
            return is_studio or is_customer
        return is_customer or is_studio
    
    def has_object_permission(self, request, view, obj):
        return obj.customer == request.user or obj.studio == request.user.studio


class OrderItemPermission(permissions.BasePermission):
    
    def has_permission(self, request, view):
        is_customer = request.user.is_authenticated and "customer" in request.user.role.values_list("code_name", flat=True)
        is_studio = request.user.is_authenticated and "studio" in request.user.role.values_list("code_name", flat=True)
        if request.method not in permissions.SAFE_METHODS:
            return is_studio
        return is_customer or is_studio 
    
    def has_object_permission(self, request, view, obj):
        if request.method not in permissions.SAFE_METHODS:
            return obj.order.studio == request.user.studio
        return obj.order.customer == request.user or obj.order.studio == request.user.studio