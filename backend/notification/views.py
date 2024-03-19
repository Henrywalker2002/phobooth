from base.views import BaseGenericViewSet
from rest_framework.mixins import ListModelMixin
from notification.models import Notification
from notification.serializers import ReadNotificationSerializer
from notification.permission import NotificationPermission


class NotificationViewSet(BaseGenericViewSet, ListModelMixin):
    queryset = Notification.objects.all()
    serializer_class = {"default" : ReadNotificationSerializer,}
    permission_classes = [NotificationPermission]
    
    
    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).order_by("-created_at")
    