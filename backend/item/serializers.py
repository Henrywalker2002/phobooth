from rest_framework import serializers
from item.models import Item
from studio.serializers import StudioSerializer


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        exclude = ['created_by', 'updated_by']

class ItemServicesSerializer(serializers.ModelSerializer):
    type = serializers.CharField(max_length=255, read_only=True)
    studio = StudioSerializer(read_only=True)
    
    class Meta:
        model = Item
        fields = ['name', 'description', 'type', 'category', 'picture', 'status', 
                  'studio', 'min_price', 'max_price' ]
    

class ItemSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'picture', "type", "category", "picture", 
                  "status", "min_price", "max_price"]