from base.permission import BaseAdvancedPermission


class RatePermission(BaseAdvancedPermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return True