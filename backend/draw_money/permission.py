from base.permission import BaseAdvancedPermission


class DrawMoneyPermission(BaseAdvancedPermission):
    
    def has_permission(self, request, view):
        if request.method == "POST":
            return self.is_studio(request)
        else:
            return self.is_admin(request) or self.is_staff(request)

    def has_object_permission(self, request, view, obj):
        return True
