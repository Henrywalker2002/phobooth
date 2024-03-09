from base.permission import BaseAdvancedPermission


class ReplyPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        return request.user.is_authenticated