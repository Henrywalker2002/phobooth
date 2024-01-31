from rest_framework import serializers
from item.models import Item, Option, OptionValue, Variation
from item.serializers.item import ItemPictureSerializer
from category.models import Category, CategoryTypeChoices


class VariationSerializer(serializers.Serializer):
    option_values = serializers.ListField(child=serializers.CharField(
        max_length=255), max_length=2, required=False)
    price = serializers.IntegerField(required=True)
    stock = serializers.IntegerField(required=True)
    

class VariationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variation
        fields = ['id', 'price', 'stock']


class OptionSertializer(serializers.Serializer):
    option_names = serializers.ListField(child=serializers.CharField(
        max_length=255), max_length=2, required=True)
    variation = VariationSerializer(many=True, required=True)


class ItemProductSerializer(serializers.ModelSerializer):

    option = OptionSertializer(required=False)   
    type = serializers.CharField(read_only=True) 
    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), 
        required=False,
        max_length=5
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(type=CategoryTypeChoices.PRODUCT)
    )
    
    def validate_option(self, value):
        if value:
            length = len(value.get("option_names"))
            for variation in value.get("variation"):
                if len(variation.get("option_values")) != length:
                    raise serializers.ValidationError("Option values must be equal to option names")
        return value
    
    class Meta:
        model = Item
        fields = ['name', 'description', 'type', 'category', 'status', 'option',
                  'width', 'length', 'weight', 'height', 'pictures', 'fixed_price']
        

class ItemProductUpdateSerializer(serializers.ModelSerializer):

    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), 
        required=False,
        max_length=5
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(type=CategoryTypeChoices.PRODUCT)
    )
    
    class Meta:
        model = Item
        fields = ['description', 'type', 'category', 'status',
                  'width', 'length', 'weight', 'height', 'pictures', 'fixed_price']
    
    
class OptionReadSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Option
        fields = ['name']


class OptionValueSerializer(serializers.ModelSerializer):
    
    option = OptionReadSerializer(read_only=True)
    
    class Meta:
        model = OptionValue
        fields = ['name', 'option']

class VariationDetailSerializer(serializers.ModelSerializer):
    value = OptionValueSerializer(many=True, read_only=True)
    option = OptionReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = Variation
        fields = ['id', 'value', 'price', 'stock', 'option']
    

class ItemProductDetailSerializer(serializers.ModelSerializer):
    variation = VariationDetailSerializer(many=True, read_only=True)
    pictures = ItemPictureSerializer(many = True)
    
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
        fields = ['id', 'name', 'description', 'type', 'category', 'status', 'variation',
                  'width', 'length', 'weight', 'height', 'pictures', 'fixed_price']