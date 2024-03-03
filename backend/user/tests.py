from base.tests import BaseTest, BaseTestWithAdmin
from rest_framework.test import APIClient
from user.models import User
import json
from django.urls import reverse


class UserTestCase(BaseTest):

    def test_create_user_fail(self):
        data = {
            "username": "test",
            "password": "test",
            "email": "email",
            "full_name": "full_name",
        }
        response = self.client.post(
            '/user/sign-up/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('email' in response.json()
                        and 'password' in response.json())

    def test_create_user_success(self):
        global access_token, user_id
        data = {
            "username": "test",
            "password": "test125255",
            "email": "email@email.com",
            "full_name": "123"
        }
        response = self.client.post(
            '/user/sign-up/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['username'], data['username'])

        response = self.client.post('/login/',
                                    data={
                                        "username": data['username'],
                                        "password": data['password']
                                    }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        assert 'access' in response.json() and 'role' in response.json() and 'customer' in response.json()['role'][0]['code_name']
        access_token = response.json()['access']
        user_id = response.json()['id']
        
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        
        response = client.get('/user/' + str(user_id) + '/')
        assert response.status_code == 200
        
    def test_create_user_fail_duplicate(self):
        data = {
            "username": "test",
            "password": "test125255",
            "email": "" }
        response = self.client.post(
            '/user/sign-up/', data=data, content_type='application/json')

        assert response.status_code == 400
    
    def test_user_update(self):
        pass 
    
    def tearDown(self) -> None:
        pass 
    

class TestStaff(BaseTestWithAdmin):
    staff_id = None 
    def setUp(self) -> None:
        data = {
            "username": "test2",
            "password": "test125255",
            "email": "test2@email.com",
            "phone" : "0963313143",
            "full_name": "henry",
            "role" : "staff",
            "date_of_birth" : "1999-12-12"
        }
        response = self.client.post(reverse('staff-list'), data=data, format="json")
        assert response.status_code == 201
        self.staff_id = response.json()['id']
    
    def test_create_staff(self):
        data = {
            "username": "test",
            "password": "test125255",
            "email": "test@email.com",
            "phone" : "0965313143",
            "full_name": "henry",
            "role" : "staff",
            "date_of_birth" : "1999-12-12"
        }
        response = self.client.post(reverse('staff-list'), data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json['role'][0]['code_name'] == "staff"  
        staff_id = json['id']
        url = f"{reverse('staff-list')}{staff_id}/"
        response = self.client.patch(url, data={"role": "admin"}, format="json")
        assert response.status_code == 200
        json = response.json()
        assert json['role'][0]['code_name'] == "admin"
        
    def test_delete_staff(self):
        repsonse = self.client.delete(f"{reverse('staff-list')}{self.staff_id}/")
        assert repsonse.status_code == 204
    
    def test_permission(self):
        client = APIClient()
        response = client.post(reverse('login'), data={"username": "test2", "password": "test125255"}, format="json")
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.json()["access"])
        
        response = client.get(reverse('staff-list'))
        assert response.status_code == 403
        url = f"{reverse('staff-list')}{self.staff_id}/"
        response = client.get(url)
        assert response.status_code == 200
        
        response = client.patch(url, data={"role": "admin"}, format="json")
        assert response.status_code == 403
        response = client.patch(url, data = {"full_name" : "new name"}, format="json")
        assert response.status_code == 200 
        
        response = client.delete(url)
        assert response.status_code == 204
        