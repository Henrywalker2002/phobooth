from base.permission import IsStudio, BaseAdvancedPermission
from rest_framework import permissions


class ItemPermission(IsStudio):
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.studio.id == obj.studio.id
    

class VariationPermission(IsStudio):
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.studio.id == obj.product.studio.id


class ItemPicturePermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return self.is_studio(request)
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.studio.id == obj.item.studio.id