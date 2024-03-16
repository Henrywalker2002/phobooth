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
        exclude = ('province',)


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
    
    ward = serializers.PrimaryKeyRelatedField(queryset=Ward.objects.all(), required=True)
    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all(), required=True)
    province = serializers.PrimaryKeyRelatedField(queryset=Province.objects.all(), required=True)
    street = serializers.CharField(required=True)
    
    def validate_street(self, value):
        if value == "" or value == None:
            raise serializers.ValidationError("Street is required")
        return value
    
    def validate(self, data):
        try: 
            if data['ward'].district != data['district']:
                raise serializers.ValidationError("Ward and district does not match")
            if data['district'].province != data['province']:
                raise serializers.ValidationError("District and province does not match")
        except KeyError as e:
            raise serializers.ValidationError(f"{e.args[0]} is required")
        return data
    
    
    class Meta:
        model = Address
        fields = ['id', 'street', 'ward', 'district', 'province']


class ReadWardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ward
        fields = ['code', 'name', 'code_name', 'type', 'name_with_type']


class ReadDistrictSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = ['code', 'name', 'code_name', 'type', 'name_with_type']

class ReadProvinceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = ['code', 'name', 'code_name', 'type', 'name_with_type']


class ReadAddressSerializer(serializers.ModelSerializer):

    ward = ReadWardSerializer()
    district = ReadDistrictSerializer()
    province = ReadProvinceSerializer()

    class Meta:
        model = Address
        fields = ['id', 'street', 'ward', 'district', 'province']