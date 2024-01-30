from base.tests import BaseTest
from rest_framework.test import APIClient
from user.models import User
import json


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
        client = APIClient()
        
        user = User.objects.create(username = "test", password = "test125255", email = "email@email.com", full_name = "henry")
        client.force_authenticate(user=user)
        
        response = client.get('/user/' + str(user.id) + '/')
        assert response.status_code == 200
        
        response = client.patch('/user/' + str(user.id) + '/', data = json.dumps({"full_name": "henry"}), content_type= 'application/json')
        assert response.status_code == 200
        assert response.json()['full_name'] == "henry"
        
        User.objects.create(username = "tes2t", password = "test125255", email = "email2@email.com", full_name = "henry")
        response = client.get('/user/' + str(user.id + 1) + '/')
        assert response.status_code == 403
        
        response = client.delete('/user/' + str(user.id) + '/')
        assert response.status_code == 204
        response = client.get('/user/' + str(user.id) + '/')
        assert response.status_code == 404
    
    def tearDown(self) -> None:
        pass 
    