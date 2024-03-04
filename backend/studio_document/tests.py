from base.tests import BaseTestWithStudio
from rest_framework.test import APIClient
from django.urls import reverse
from user.models import User
from role.models import Role
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import io


class TestStudioDocumentViewSet(BaseTestWithStudio):

    def create_admin(self):
        client = APIClient()
        data = {
            "username" : "admin",
            "full_name" : "admin",
            "email" : "admin@email.com",
            "password" : "admin1234"
        }
        user = User(**data)
        user.set_password(data["password"])
        role = Role.objects.get(code_name="admin")
        user.save()
        user.role.set([role])
        response = self.client.post(
            reverse('login'), data={"username": data["username"], 
                                    "password": data["password"]}, format="json")
        client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + response.json()["access"])
        return client

    def test_create_studio_document(self):
        img = Image.open("assets/avatars/avatar.jpg")
        img_io = io.BytesIO()
        img.save(img_io, format='JPEG')
        img_io.seek(0)
        img = SimpleUploadedFile("avatar.jpg", img_io.read(), content_type="image/jpeg")
        img_io.seek(0)
        img2 = SimpleUploadedFile("avatar.jpg", img_io.read(), content_type="image/jpeg")
        license = SimpleUploadedFile("assets/studio_document/RTS.pdf", b"file_content", content_type="application/pdf")
        data = {
            "phone" : "0846621312",
            "email" : "email@email.com",
            "license_date" : "2021-01-01",
            "license_number" : "123456",
            "license_issue" : "issue",
            "front_ID_card" : img,
            "back_ID_card" : img2,
            "license" : license
        }
        response = self.client.post(reverse('studio-document-list'), data=data, format='multipart')
        assert response.status_code == 201
        id = response.json()["id"]
        
        response = self.client.post(reverse('studio-document-list'), data=data, format='multipart')
        assert response.status_code == 400
        
        admin_client = self.create_admin()
        url = f"{reverse('studio-document-list')}{id}/"
        response = admin_client.patch(url, data={"status": "ACCEPTED"}, format="json")
        assert response.status_code == 200
        
        