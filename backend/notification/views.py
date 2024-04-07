from base.views import BaseGenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from notification.models import Notification
from notification.serializers import ReadNotificationSerializer, UpdateNotificationSerializer
from notification.permission import NotificationPermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class NotificationViewSet(BaseGenericViewSet, ListModelMixin, UpdateModelMixin):
    queryset = Notification.objects.all()
    serializer_class = {"default" : UpdateNotificationSerializer, "list" : ReadNotificationSerializer}
    permission_classes = [NotificationPermission]
    
    
    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user).order_by("-created_at")
    
    @action(methods = ['PUT', 'PATCH'], detail = False, url_path = 'read-all', )
    def read_all(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        notification_lst = []
        for notification in queryset:
            if not notification.is_read:
                notification.is_read = True
            notification_lst.append(notification)
        queryset.bulk_update(notification_lst, ["is_read"])
        return Response(status = status.HTTP_200_OK)