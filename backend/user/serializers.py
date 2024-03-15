from rest_framework import serializers
from user.models import User
from role.serializers import RoleDetailSerializer
from studio.serializers import StudioSummarySerializer
import re
from address.serializers import AddressSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    studio = StudioSummarySerializer(read_only=True)
    
    
    class Meta:
        model = User
        fields = ["username", "password", "email", "full_name", "role", "avatar", "studio"]
        

class UpdateUserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False, use_url=True)
    address = AddressSerializer(required=False, allow_null=True)
    
    def validate_phone(self, value):
        regex = re.compile(r"^0\d{9}$")
        if not regex.match(value):
            raise serializers.ValidationError("Invalid phone number")
        return value
    
    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long")
        return password
    
    class Meta:
        model = User
        fields = ["full_name", "username", "password", "phone", "address", "date_of_birth", "avatar", ]
        

class UserSummarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User 
        fields = ["id", "username", "email", "full_name", "avatar"]


class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleDetailSerializer(many=True, read_only=True)
    studio = StudioSummarySerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "role", "avatar", "studio", "date_of_birth", "phone", "address"]


class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )

    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long")
        return password
    
    class Meta:
        model = User
        fields = ["username", "password", "email", "full_name", "role"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=128)
    password = serializers.CharField(max_length=128, write_only=True)


class CreateStaffSerilizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices = [("staff", "staff"), ("admin", "admin")])
    
    def validate_phone(self, value):
        regex = re.compile(r"^0\d{9}$")
        if not regex.match(value):
            raise serializers.ValidationError("Invalid phone number")
        return value
    
    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long")
        return password
    
    class Meta:
        model = User 
        fields = ['username', 'full_name', 'email', 'password', 'role', 'phone', 'date_of_birth']


class UpdateStaffSerializer(CreateStaffSerilizer):
    
    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'date_of_birth', 'avatar', 'password', 'role', 'is_active']
        
    
class StaffSummarySerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(slug_field='code_name', many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "full_name", "role", "is_active", 'created_at']