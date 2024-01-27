from base.permission import IsStudio
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