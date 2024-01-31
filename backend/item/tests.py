from base.tests import BaseTestWithStudio
from unittest.mock import patch
from item.models import get_current_studio, Item
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from studio.models import Studio
from unittest.mock import patch
from item.views.product import ProductViewSet
from category.models import Category


class ItemServiceTest(BaseTestWithStudio):
    
    def test_add_item(self):
        data = {
            "name": "name",
            "description": "description",
            "type": "SERVICE",
            "min_price": 1000,
            "max_price": 2000,
            "category": 1
        }

        response = self.client.post("/item-service/", data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json["name"] == data["name"]

    def test_add_item_with_pic(self):
        image_names = ['assets/item/images.jpg',
                       'assets/item/anh-avatar-dep-35.jpg', ]
        image_file = []
        for name in image_names:
            img = Image.open(name)
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG')
            # Rewind the file pointer to the beginning
            img_io.seek(0)
            # Create a SimpleUploadedFile from the BytesIO object
            image_file.append(SimpleUploadedFile(
                "avatar.jpg", img_io.read(), content_type='image/jpeg'))
        data = {
            "name": "name",
            "description": "description",
            "type": "SERVICE",
            "min_price": 1000,
            "max_price": 2000,
            "category" : 1,
            "pictures": image_file
        }

        response = self.client.post(
            "/item-service/", data=data, format="multipart")
        assert response.status_code == 201
        json = response.json()
        assert len(json["pictures"]) == len(image_file)

        item_id = json['id']
        response = self.client.get(f"/item-service/{item_id}/", format="json")
        assert response.status_code == 200
        response = self.client.delete(
            f"/item-service/{item_id}/", format="json")
        assert response.status_code == 204

        response = self.client.get(f"/item-service/{item_id}/", format="json")
        assert response.status_code == 404


class TestProduct(BaseTestWithStudio):

    def test_add_product(self):
        category = Category.objects.get(title = "category2")
        data = {
            "name": "ảnh",
            "description": "no",
            "width": 11,
            "length": 11,
            "weight": 11,
            "height": 11,
            "category" : category.id,
            "fixed_price": 123,
        }
        response = self.client.post("/item-product/", data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json["name"] == data["name"]

        item_id = json['id']
        response = self.client.get(f"/item-product/{item_id}/", format="json")
        assert response.status_code == 200
        response = self.client.delete(
            f"/item-product/{item_id}/", format="json")
        assert response.status_code == 204

    def test_add_product_with_image(self):
        image_names = ['assets/item/images.jpg',
                       'assets/item/anh-avatar-dep-35.jpg', ]
        image_file = []
        for name in image_names:
            img = Image.open(name)
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            image_file.append(SimpleUploadedFile(
                "avatar.jpg", img_io.read(), content_type='image/jpeg'))
        category = Category.objects.get(title = "category2")
        data = {
            "name": "ảnh",
            "description": "no",
            "width": 11,
            "length": 11,
            "weight": 11,
            "height": 11,
            "fixed_price": 123,
            "category" : category.id,
            "pictures": image_file
        }

        repsonse = self.client.post(
            "/item-product/", data=data, format="multipart")
        assert repsonse.status_code == 201
        json = repsonse.json()
        assert len(json["pictures"]) == len(image_file)

    def test_add_product_with_variation(self):
        category = Category.objects.get(title = "category2")
        data = {
            "name": "ảnh",
            "description": "no",
            "width": 11,
            "length": 11,
            "weight": 11,
            "height": 11,
            "fixed_price": 123,
            "category" : category.id,
            "option": {
                "option_names": ["size", "color"],
                "variation": [
                    {
                        "price": 123,
                        "stock": 123,
                        "option_values": ["S", "red"]
                    },
                    {
                        "price": 123,
                        "stock": 123,
                        "option_values": ["M", "blue"]
                    }
                ]
            }
        }

        response = self.client.post("/item-product/", data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json["name"] == data["name"]

        item_id = json['id']
        response = self.client.get(f"/item-product/{item_id}/", format="json")
        assert response.status_code == 200
        response = self.client.delete(
            f"/item-product/{item_id}/", format="json")
        assert response.status_code == 204

    @patch("item.views.product.ProductViewSet.check_permissions", return_value=True)
    @patch("item.views.product.ProductViewSet.check_object_permissions", return_value=True)
    def test_update_product(self, mock1, mock2):
        studio = Studio.objects.get(code_name="best_1234")
        item = Item.objects.create(name="name", description="description",
                                   type="PRODUCT", studio=studio, min_price=1000, max_price=2000)

        data = {
            "fixed_price": 1456,
        }
        response = self.client.patch(f"/item-product/{item.id}/", data=data, format="json")
        assert response.status_code == 200
        json = response.json()
        assert json["fixed_price"] == data["fixed_price"]
        

class TestServicePack(BaseTestWithStudio):
    
    def test_add_serivce_pack(self):
        category = Category.objects.get(title = "category")
        studio = Studio.objects.get(code_name="best_1234")
        item = Item.objects.create(name="name", description="description",
                                   type="SERVICE", studio=studio, min_price=1000, max_price=2000)
        data = {
            "name": "name",
            "description": "description",
            "min_price": 1000,
            "max_price": 2000,
            "item" : [item.id],
            "category" : category.id
        }
        response = self.client.post("/item-service-pack/", data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json["name"] == data["name"]
        
        item_id = json['id']
        response = self.client.get(f"/item-service-pack/{item_id}/", format="json")
        assert response.status_code == 200
        response = self.client.delete(
            f"/item-service-pack/{item_id}/", format="json") 
        assert response.status_code == 204
        response = self.client.get(f"/item-service-pack/{item_id}/", format="json")
        assert response.status_code == 404
    
    def test_add_service_pack_with_image(self):
        image_names = ['assets/item/images.jpg',
                       'assets/item/anh-avatar-dep-35.jpg', ]
        category = Category.objects.get(title = "category")
        image_file = []
        for name in image_names:
            img = Image.open(name)
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            image_file.append(SimpleUploadedFile(
                "avatar.jpg", img_io.read(), content_type='image/jpeg'))

        studio = Studio.objects.get(code_name="best_1234")
        item = Item.objects.create(name="name", description="description",
                                   type="SERVICE", studio=studio, min_price=1000, max_price=2000)
        data = {
            "name": "name",
            "description": "description",
            "min_price": 1000,
            "max_price": 2000,
            "item" : [item.id],
            "pictures": image_file,
            "category" : category.id
        }
        response = self.client.post("/item-service-pack/", data=data, format="multipart")
        assert response.status_code == 201
        json = response.json()
        assert len(json["pictures"]) == len(image_file)
        
        item_id = json['id']
        response = self.client.get(f"/item-service-pack/{item_id}/", format="json")
        assert response.status_code == 200
        response = self.client.delete(
            f"/item-service-pack/{item_id}/", format="json") 
        assert response.status_code == 204
        response = self.client.get(f"/item-service-pack/{item_id}/", format="json")
        assert response.status_code == 404