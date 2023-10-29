from rest_framework import serializers
from user.models import User

class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only= True)
    
    class Meta: 
        model = User 
        fields = ['username', 'password', 'email' , 'full_name']
        
class LoginSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length = 128)
    password = serializers.CharField(max_length=128, write_only=True)