from rest_framework import serializers
from studio.models import Studio
from django.db import transaction
from backend.custom_middleware import get_current_user
import re
from role.models import Role
from user.models import User
from address.serializers import AddressSerializer
from address.models import Address
        
        
class StudioSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ['id', 'code_name', 'friendly_name', "is_verified", "avatar"]


class StudioSerializer(serializers.ModelSerializer):

    is_verified = serializers.BooleanField(read_only=True)
    tax_code = serializers.CharField(read_only=True)
    address = AddressSerializer(required=True)
    
    def validate_code_name(self, value):
        pattern = re.compile(r'[a-zA-Z][a-zA-Z0-9_]*')
        if re.match(pattern, value):
            return value
        raise serializers.ValidationError("Code name must start with a letter and only contain letters, numbers and underscore")
    
    def validate_phone(self, value):
        pattern = re.compile(r'0[0-9]*')
        if re.match(pattern, value):
            return value
        raise serializers.ValidationError("Phone number must start with 0 and only contain numbers")
        
    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        studio = Studio.objects.create(address = address,**validated_data)
        user = get_current_user()
        user.own_studio = studio
        role = Role.objects.get(code_name = "studio")
        user.role.add(role)
        user.save()
        return studio
    
    
    class Meta:
        model = Studio
        fields = ['id', "code_name", 'friendly_name', 'phone', 'email', 'description', 'tax_code', 'is_verified', 'address', "avatar"]
        

class StudioUpdateSerializer(StudioSerializer):
    
    address = AddressSerializer()
    
    def validate(self, attrs):
        if 'bank_bin' in attrs:
            if 'account_number' not in attrs:
                raise serializers.ValidationError("Bank bin must be used with account number")
            else:
                #validate bank account
                pass 
        if 'account_number' in attrs:
            if 'bank_bin' not in attrs:
                raise serializers.ValidationError("Account number must be used with bank bin")
        return attrs
    
    class Meta:
        model = Studio
        fields = ['id', 'friendly_name', 'phone', 'email', 'description', 'tax_code', 'is_verified', 'address', "avatar", "bank_bin", "account_number"]
    

class StudioDetailSerializer(serializers.ModelSerializer):
    
    address = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Studio
        fields = ['id', "code_name", 'friendly_name', 'phone', 'email', 'description', 'tax_code', 'is_verified', 'address', "avatar"]


class AddEmployeeSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        user = User.objects.filter(email = value)
        if user:
            return user
        raise serializers.ValidationError("User not found")
    