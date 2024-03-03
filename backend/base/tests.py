from rest_framework.test import testcases, APIClient
from role.models import Role, Permission
from address.models import District, Ward, Province
from category.models import Category
from django.urls import reverse
from user.models import User


class BaseTest(testcases.TestCase):

    @staticmethod
    def create_address():
        province = Province.objects.create(
            code=1, name="Hà Nội", code_name="Hà Nội", type="Thủ Đô", name_with_type="Thủ đô Hà Nội")
        dictrict = District.objects.create(
            code=1, name="Hà Đông", code_name="Hà Đông", type="Quận", name_with_type="Quận Hà Đông", province=province)
        ward = Ward.objects.create(code=1, name="Văn Quán", code_name="Văn Quán",
                                   type="Phường", name_with_type="Phường Văn Quán", district=dictrict)

    @staticmethod
    def create_category():
        category = Category.objects.create(
            type="SERVICE", title="category", description="category")
        category = Category.objects.create(
            type="PRODUCT", title="category2", description="category2")

    @classmethod
    def setUpClass(self):
        super().setUpClass()
        lst = ["customer", "studio", "admin", "staff"]
        for role in lst:
            permission_obj = Permission.objects.create(
                code_name=role, friendly_name=role, description=role)
            role_obj = Role.objects.create(
                code_name=role, friendly_name=role, description=role)
            role_obj.permission.set([permission_obj])

        self.create_address()
        self.create_category()


class BaseTestWithAdmin(BaseTest):
    
    def _pre_setup(self):
        super()._pre_setup()
        self.client = APIClient()
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
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + response.json()["access"])
        
        

class BaseTestWithCustomer(BaseTest):

    def _pre_setup(self):
        super()._pre_setup()
        self.client = APIClient()
        role = Role.objects.get(code_name="customer")
        data = {
            "username": "test", "password": "test13456", "email": "email@email.com", "full_name": "full name"}
        response = self.client.post(
            reverse('user-sign-up'), data=data, format="json")
        assert response.status_code == 201
        response = self.client.post(reverse('login'), data={
                                    "username": data["username"], "password": data["password"]}, format="json")

        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + response.json()["access"])


class BaseTestWithStudio(BaseTestWithCustomer):

    def _pre_setup(self):
        super()._pre_setup()
        data = {
            "code_name": "best_1234",
            "friendly_name": "studio 123",
            "phone": "0846621431",
            "email": "exmael2@email.com",
            "description": "no descr",
            "address": {
                "province": 1,
                "district": 1,
                "ward": 1,
                "street": "name"
            }
        }
        response = self.client.post(
            reverse('studio-list'), data=data, format="json")
        assert response.status_code == 201


class BaseTestWithItem(BaseTestWithStudio):

    item_id = []
    def _pre_setup(self):
        super()._pre_setup()
        self.item_id = []
        category = Category.objects.filter(type="SERVICE").first()
        data = {
            "name": "name",
            "description": "description",
            "min_price": 1000,
            "max_price": 2000,
            "category": category.id
        }
        response = self.client.post(
            reverse('item-service-list'), data=data, format="json")
        assert response.status_code == 201
        self.item_id.append(response.json().get('id'))
        data["name"] = "name2"
        response = self.client.post(
            reverse('item-service-list'), data=data, format="json")
        assert response.status_code == 201
        self.item_id.append(response.json().get('id'))  
