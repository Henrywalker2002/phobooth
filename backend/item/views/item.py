from rest_framework.viewsets import ReadOnlyModelViewSet
from item.models import Item, ItemTypeChoices, ItemStatusChoices
from item.serializers.item import ItemDetailSerializer, ItemSummarySerializer
from item.permission import ItemPermission


class ItemViewSet(ReadOnlyModelViewSet):
    
    queryset = Item.objects.all()
    serializer_class = {"retrieve": ItemDetailSerializer, "default": ItemDetailSerializer, "list": ItemSummarySerializer}
    permission_classes = [ItemPermission]
    
    
    def get_serializer_class(self):
        # ensure that serializer_class must be a dict and have default 
        assert self.serializer_class is not None, (
            "'%s' should either include a `serializer_class` attribute, "
            "or override the `get_serializer_class()` method."
            % self.__class__.__name__
        )
        assert isinstance(self.serializer_class, dict), (
            f"{self.__class__.__name__} serialize_class must be a dict"
        )
        assert "default" in self.serializer_class.keys(), (
            f"{self.__class__.__name__} serializer_class must have default keys"
        )
        
        if self.action in self.serializer_class.keys():
            return self.serializer_class[self.action]
        return self.serializer_class['default']
    
    def get_queryset(self):
        return super().get_queryset().filter(status = ItemStatusChoices.ACTIVE).exclude(type = ItemTypeChoices.ACCESSORY)