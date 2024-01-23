from base.permission import IsStudio


class ItemPermission(IsStudio):
    
    def has_object_permission(self, request, view, obj):
        return request.user.studio.id == obj.studio.id