from rest_framework import serializers
from user.models import User
from role.models import Role
from role.serializers import RoleDetailSerializer
from studio.serializers import StudioSummarySerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    studio = StudioSummarySerializer(read_only=True)
    
    
    class Meta:
        model = User
        fields = ["username", "password", "email", "full_name", "role", "avatar", "studio"]
        

class UserSummarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User 
        fields = ["id", "username", "email", "full_name", "avatar"]


class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleDetailSerializer(many=True, read_only=True)
    studio = StudioSummarySerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "role", "avatar", "studio"]


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
