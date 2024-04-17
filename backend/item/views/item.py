from rest_framework.viewsets import ReadOnlyModelViewSet
from item.models import Item, ItemTypeChoices, ItemStatusChoices, ItemPicture
from item.serializers.item import ItemDetailSerializer, ItemSummarySerializer, CreateItemPictureSerializer
from item.permission import ItemPermission, ItemPicturePermission
from item.filters.item import ItemFilter
from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework import status


class ItemViewSet(BaseGenericViewSet, ReadOnlyModelViewSet):
    
    queryset = Item.objects.all()
    serializer_class = {"retrieve": ItemDetailSerializer, "default": ItemDetailSerializer, "list": ItemSummarySerializer}
    permission_classes = [ItemPermission]
    filterset_class = ItemFilter
    search_fields = ["@name", "@description"]
    
    def get_queryset(self):
        return super().get_queryset().filter(status = ItemStatusChoices.ACTIVE).exclude(type = ItemTypeChoices.ACCESSORY)


class ItemImageViewSet(BaseGenericViewSet, CreateModelMixin, DestroyModelMixin):
    queryset = ItemPicture.objects.all()
    serializer_class = {"default": CreateItemPictureSerializer}
    permission_classes = [ItemPicturePermission]
    
    def get_serializer(self, *args, **kwargs):
        is_get = kwargs.pop('is_get', False)
        is_item = kwargs.pop('is_item', False)
        if is_get:
            serializer_class = self.serializer_class.get('retrieve', self.get_serializer_class())
        elif is_item:
            serializer_class = ItemDetailSerializer
        else :
            serializer_class = self.get_serializer_class()
        kwargs.setdefault('context', self.get_serializer_context())
        return serializer_class(*args, **kwargs)
        
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        item = serializer.instance.item

        data = self.get_serializer(item, is_item = True).data   
        
        return Response(data = data, status=status.HTTP_201_CREATED)
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        data = self.get_serializer(instance.item, is_item = True).data
        return Response(data = data, status=status.HTTP_200_OK)