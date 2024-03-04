from rest_framework import serializers 
from studio_document.models import StudioDocument, StudioDocumentStatusChoices
from studio.serializers import StudioSummarySerializer
from studio_document.exceptions import StudioDocumentUpdateException
import re


class CreateStudioDocumentSerializer(serializers.ModelSerializer):
    
    def validate_phone(self, value):
        regex = re.compile(r"^0\d{9}$")
        if not regex.match(value):
            raise serializers.ValidationError("Invalid phone number")
        return value
    
    class Meta:
        model = StudioDocument
        fields = ['phone', 'email', 'license_date', 'license_number', 
                  'license_issue', 'front_ID_card', 'back_ID_card', 'license']


class StudioDocumentDetailSerializer(serializers.ModelSerializer):
    
    studio = StudioSummarySerializer()
    
    class Meta:
        model = StudioDocument
        fields = ['id', 'phone', 'email', 'license_date', 'license_number',
                  'license_issue', 'front_ID_card', 'back_ID_card', 'license', 
                  'denied_reason', 'status', 'created_at', 'studio', 'number_attempts']
        

class StudioDocumentUpdateSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        instance = self.instance
        if instance.status != StudioDocumentStatusChoices.PENDING:
            raise StudioDocumentUpdateException()
        return attrs
    
    class Meta:
        model = StudioDocument
        fields = ['status', 'denied_reason']
        extra_kwargs = {
            'status': {'required': True},
        }


class StudioDocumentSummarySerializer(serializers.ModelSerializer):
    
    studio = StudioSummarySerializer()
    
    class Meta:
        model = StudioDocument  
        fields = ['id', 'created_at', 'status', 'number_attempts', 'studio']