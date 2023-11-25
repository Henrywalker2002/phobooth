from rest_framework import serializers
from studio.models import Studio, StudioAddress
from django.db import transaction
from backend.custom_middleware import get_current_user


class StudioAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioAddress
        fields = ['id', 'address', 'city', 'district', 'ward', 'postal_code']


class StudioSerializer(serializers.ModelSerializer):
    address = StudioAddressSerializer(many=True)
    is_verified = serializers.BooleanField(read_only=True)
    tax_code = serializers.CharField(read_only=True)
    
    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        studio = Studio.objects.create(**validated_data)
        for address in address_data:
            StudioAddress.objects.create(studio=studio, **address)
        user = get_current_user()
        user.studio = studio
        user.save()
        return studio
    
    
    class Meta:
        model = Studio
        fields = ['id', "code_name", 'friendly_name', 'phone', 'email', 'description', 'tax_code', 'is_verified', 'address']