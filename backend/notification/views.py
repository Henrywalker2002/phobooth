from base.views import BaseGenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from notification.models import Notification
from notification.serializers import ReadNotificationSerializer, UpdateNotificationSerializer
from notification.permission import NotificationPermission
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from django.shortcuts import get_object_or_404 as _get_object_or_404
from django.http import Http404
from django.core.exceptions import ValidationError

def get_object_or_404(queryset, *filter_args, **filter_kwargs):
    """
    Same as Django's standard shortcut, but make sure to also raise 404
    if the filter_kwargs don't match the required types.
    """
    try:
        return _get_object_or_404(queryset, *filter_args, **filter_kwargs)
    except (TypeError, ValueError, ValidationError):
        raise Http404


class NotificationViewSet(BaseGenericViewSet, ListModelMixin, UpdateModelMixin):
    queryset = Notification.objects.all()
    serializer_class = {"default" : UpdateNotificationSerializer, "list" : ReadNotificationSerializer}
    permission_classes = [NotificationPermission]
    lookup_field = "id"
    
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {self.lookup_field: ObjectId(self.kwargs[lookup_url_kwarg])}
        obj = get_object_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj
    
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