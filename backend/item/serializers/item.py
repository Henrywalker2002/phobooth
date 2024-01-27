from rest_framework import serializers
from item.models import Item, ItemPicture
from studio.serializers import StudioSummarySerializer
from category.serializers import CategorySerializer


class ItemPictureSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ItemPicture
        fields = ['picture']


class ItemDetailSerializer(serializers.ModelSerializer):
    studio = StudioSummarySerializer(read_only=True)
    pictures = ItemPictureSerializer(read_only=True, many=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'type', 'category', 'pictures', 'status', 
                  'studio', 'min_price', 'max_price', "fixed_price" ]
        

class ItemSummarySerializer(serializers.ModelSerializer):
    pictures = ItemPictureSerializer(read_only=True, many=True)
    studio = StudioSummarySerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.pictures:
            ret['picture'] = ret['pictures'].pop(0)
            ret.pop('pictures')
        return ret 
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'pictures', 'type', 'studio', 'min_price', 'max_price', "fixed_price"]