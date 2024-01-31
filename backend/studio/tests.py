from base.tests import BaseTestWithCustomer
from unittest.mock import patch
from studio.serializers import get_current_user
from studio.views import StudioPermission, StudioViewSet
from studio.models import Studio
from PIL import Image
import io
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse


class TestStudio(BaseTestWithCustomer):
    
    def test_create_studio(self):
        data = {
            "code_name" : "best_123",
            "friendly_name" : "studio 123",
            "phone" : "084662131",
            "email" : "exmael@email.com",
            "description" : "no descr",
            "address" : {
                "province" : 1,
                "district" : 1, 
                "ward" : 1,
                "street" : "name"
            }
        }
        response = self.client.post(reverse('studio-list'), data=data, format='json')
        assert response.status_code == 201
        
        response = self.client.get(reverse('studio-list') + data['code_name'] + '/', format='json')
        assert response.status_code == 200
        
        data = {
            "code_name" : "best_1234",
            "friendly_name" : "studio 123",
            "phone" : "0846621431",
            "email" : "exmael2@email.com",
            "description" : "no descr",
            "address" : {
                "province" : 1,
                "district" : 1, 
                "ward" : 1,
                "street" : "name"
            }
        }
        response = self.client.post(reverse('studio-list'), data=data, format='json')
        assert response.status_code == 400
        assert response.json() == { "detail" : "You already have a studio"}
    
    @patch('studio.views.StudioViewSet.check_permissions', return_value=None)
    @patch('studio.views.StudioViewSet.check_object_permissions', return_value=None)
    def test_update_studio(self, mock1, mock2):
        studio = Studio.objects.create(
            code_name = "best_123",
            friendly_name = "studio 123",
            phone = "084662131",
            email = "email@email.com",
            description = "no descr",
        )
        
        response = self.client.get(reverse('studio-list') + studio.code_name + '/', format='json')
        assert response.status_code == 200
        img = Image.open("assets/avatars/avatar.jpg")
        
        img_io = io.BytesIO()
        img.save(img_io, format='JPEG')

        # Rewind the file pointer to the beginning
        img_io.seek(0)

        # Create a SimpleUploadedFile from the BytesIO object
        img_file = SimpleUploadedFile("avatar.jpg", img_io.read(), content_type='image/jpeg')
        
        response = self.client.patch(reverse('studio-list') + studio.code_name + '/', data = {"avatar": img_file}, format = "multipart")
        assert response.status_code == 200
        assert response.json()['avatar'] != None