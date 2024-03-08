from base.views import BaseModelViewSet
from media.models import Media
from media.serializers import MediaSerializer


class MediaViewSet(BaseModelViewSet):
    queryset = Media.objects.all()
    serializer_class = {"default": MediaSerializer,}