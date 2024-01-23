from rest_framework import serializers
from address.models import Province, District, Ward, Address


class WardSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Ward
        exclude = ('district',)
            
class DistrictSerializer(serializers.ModelSerializer):
    
    wards = WardSerializer(many=True)  
    class Meta:
        model = District
        exclude = ('provide',)


class ProvideSerializer(serializers.ModelSerializer):
    
    districts = DistrictSerializer(many=True)
    
    class Meta:
        model = Province
        fields = '__all__'
        

class ProvideSummarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Province
        fields = ['code', 'name', 'code_name', 'name_with_type']
        

class AddressSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Address
        fields = '__all__'
        