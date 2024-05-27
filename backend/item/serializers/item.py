from rest_framework import serializers
from item.models import Item, ItemPicture
from studio.serializers import StudioSummarySerializer
from category.serializers import CategorySummarySerializer
from rate.serializers import ReadRateSerializer
from item.serializers.product import VariationDetailSerializer


class ItemPictureSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ItemPicture
        fields = ['id', 'picture']


class ItemDetailSerializer(serializers.ModelSerializer):
    studio = StudioSummarySerializer(read_only=True)
    pictures = ItemPictureSerializer(read_only=True, many=True)
    category = CategorySummarySerializer(read_only=True)
    rates = ReadRateSerializer(read_only=True, many=True)
    variation = VariationDetailSerializer(read_only=True, required=False, many = True)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        option_lst = []
        for option in instance.option.all():
            option_dict = {}
            option_dict['name'] = option.name
            option_dict['value'] = option.option_value.all().values_list('name', flat=True)
            option_lst.append(option_dict)
        ret['option'] = option_lst
        return ret
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'type', 'category', 'pictures', 'status', 
                  'studio', 'min_price', 'max_price', "fixed_price", "star", "rates", "variation"]
        

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
        

class CreateItemPictureSerializer(serializers.ModelSerializer):

    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), required=True)
    picture = serializers.ImageField(use_url = True)
    
    class Meta:
        model = ItemPicture
        fields = ['item', 'picture']