from base.tests import BaseTestWithItem
from django.urls import reverse  


class OrderTest(BaseTestWithItem):

    def test_create_order(self):
        data = {
            "note": "note",
            "order_item": [
                {
                    "item": self.item_id[0],
                    "quantity": 1
                },
                {
                    "item": self.item_id[1],
                    "quantity": 1
                }
            ]
        }

        response = self.client.post(
            reverse('order-list'), data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        order_id = json.get('id')
        response = self.client.patch(reverse(
            'order-list') + f"{order_id}/", data={"status": "COMPLETED"}, format="json")
        assert response.status_code == 200
        json = response.json()
        assert json.get('status') == "COMPLETED"

        response = self.client.patch(reverse(
            'order-list') + f"{order_id}/", data={"status": "ORDERED"}, format="json")
        assert response.status_code == 400


class OrderItemTest(BaseTestWithItem):

    order_id = None 
    order_item_id = None 
    
    def _pre_setup(self):
        super()._pre_setup()
        data = {
            "note": "note",
            "order_item": [
                {
                    "item": self.item_id[0],
                    "quantity": 1
                }
            ]
        }

        response = self.client.post(
            reverse('order-list'), data=data, format="json")
        assert response.status_code == 201
        self.order_id = response.json().get('id')
        self.order_item_id = response.json().get('order_item')[0].get('id')
    
    def test_append_item(self):
        data = {
            "item" : self.item_id[1], 
            "quantity": 1, 
            "order" : self.order_id
        }
        
        response = self.client.post(f"{reverse('order-item-list')}", data=data, format="json")
        assert response.status_code == 201
    
    def test_update_price(self):
        data = {
            "price" : 1000,
        }
        url = f"{reverse('order-item-list')}{self.order_item_id}/"
        reponse = self.client.patch(url, data=data, format="json")
        assert reponse.status_code == 200
        json = reponse.json()
        assert json.get('total_price') == 1000
    
    def test_price(self):
        first_data = {
            "item" : self.item_id[1],
            "quantity" : 2,
            "price" : 1000, 
            "order" : self.order_id
        }
        base_url = reverse('order-item-list')
        response = self.client.post(base_url, data=first_data, format="json")
        assert response.status_code == 201
        json = response.json()
        assert json.get('total_price') == 2000 
        
        data = {
            "price" : 1000,
        }
        reponse = self.client.patch(f"{base_url}{self.order_item_id}/", data=data, format="json")
        assert reponse.status_code == 200
        json = reponse.json()
        assert json.get('total_price') == first_data["quantity"] * first_data["price"] + data["price"]

        response = self.client.delete(f"{base_url}{self.order_item_id}/")
        assert response.status_code == 200
        json = response.json()
        assert json.get('total_price') == first_data["price"] * first_data["quantity"]
        
    def test_delete_fail(self):
        response = self.client.delete(f"{reverse('order-item-list')}{self.order_item_id}/")
        assert response.status_code == 400