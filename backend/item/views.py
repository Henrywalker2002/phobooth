from base.views import CustomModelViewSetBase
from item.models import Item
from item.serializers import ItemServicesSerializer, ItemSerializer


class ItemViewSet(CustomModelViewSetBase):
    queryset = Item.objects.all()
    serializer_class = {"default": ItemSerializer}


class ItemServicesViewSet(CustomModelViewSetBase):
    queryset = Item.objects.all()
    serializer_class = {"default": ItemServicesSerializer}  
    
    def create(self, request, *args, **kwargs):
        request.data['type'] = 'SERVICE'
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        request.data['type'] = 'SERVICE'
        return super().update(request, *args, **kwargs) 