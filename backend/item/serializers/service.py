from item.models import Item, ItemTypeChoices
from rest_framework import serializers
from studio.serializers import StudioSummarySerializer


class ItemServicesSerializer(serializers.ModelSerializer):
    type = serializers.CharField(max_length=255, default = ItemTypeChoices.SERVICE)
    studio = StudioSummarySerializer(read_only=True)
    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), 
        required=False,
        max_length=5
    )
    
    def validate_type(self, value):
        if value in [ItemTypeChoices.SERVICE, ItemTypeChoices.ACCESSORY]:
            return value
        raise serializers.ValidationError("Type must be SERVICE or ACCESSORY")
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'type', 'category', 'pictures', 'status', 
                  'studio', 'min_price', 'max_price' ]
        
        