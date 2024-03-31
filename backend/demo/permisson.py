from base.permission import BaseAdvancedPermission


class ImageDemoPermission(BaseAdvancedPermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return True


class ImageDemoCommentPermission(BaseAdvancedPermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return True
    