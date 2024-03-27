from rest_framework import serializers
from category.models import Category

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['type', 'title', 'description']

class CategoryDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'type', 'title', 'description', "code_name"]


class CategorySummarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'title', "code_name", "type", 'description']
        
