from rest_framework.viewsets import ReadOnlyModelViewSet
from item.models import Item, ItemTypeChoices, ItemStatusChoices
from item.serializers.item import ItemDetailSerializer
from item.permission import ItemPermission


class ItemViewSet(ReadOnlyModelViewSet):
    
    queryset = Item.objects.all()
    serializer_class = ItemDetailSerializer
    permission_classes = [ItemPermission]
    
    
    def get_queryset(self):
        return super().get_queryset().filter(status = ItemStatusChoices.ACTIVE).exclude(type = ItemTypeChoices.ACCESSORY)