from rest_framework import serializers
from item.models import Item, ItemPicture
from studio.serializers import StudioSummarySerializer
from category.serializers import CategorySummarySerializer


class ItemPictureSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ItemPicture
        fields = ['picture']


class ItemDetailSerializer(serializers.ModelSerializer):
    studio = StudioSummarySerializer(read_only=True)
    pictures = ItemPictureSerializer(read_only=True, many=True)
    category = CategorySummarySerializer(read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'type', 'category', 'pictures', 'status', 
                  'studio', 'min_price', 'max_price', "fixed_price", "star" ]
        

class ItemSummarySerializer(serializers.ModelSerializer):
    pictures = ItemPictureSerializer(read_only=True, many=True)
    studio = StudioSummarySerializer(read_only=True)
    category = CategorySummarySerializer(read_only=True)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get('pictures'):
            ret['picture'] = ret['pictures'].pop(0).get('picture')
        else :
            ret['picture'] = None
        ret.pop('pictures')
        return ret 
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'pictures', 'type', 'studio', 'min_price', 'max_price', "fixed_price", "category", "star"]
        

class ItemShortSerializer(ItemSummarySerializer):
    
    
    class Meta:
        model = Item 
        fields = ['id', 'name', 'pictures', 'type', 'category', "star"]