from base.tests import BaseTestWithItem
from django.urls import reverse
import datetime


class PaymentTest(BaseTestWithItem):
    order_id = None
    def _pre_setup(self):
        super()._pre_setup()
        data = {
            "note" : "note", 
            "order_item" : [
                {
                    "item" : self.item_id[0],
                    "quantity" : 1
                },
                {
                    "item" : self.item_id[1],
                    "quantity" : 1
                }
            ]
        }
        response = self.client.post(reverse('order-list'), data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        self.order_id = json["id"]
        response = self.client.patch(
            reverse('order-list') + str(self.order_id) + "/", 
            data = {"status" : "IN_PROCESS"}, format="json")
        assert response.status_code == 200
        
        base_url = reverse('order-item-list')
        url = base_url + str(json["order_item"][0]["id"]) + "/"
        response = self.client.patch(url, data = {"price" : 50000}, format="json")
        assert response.status_code == 200
        url = base_url + str(json["order_item"][1]["id"]) + "/"
        response = self.client.patch(url, data = {"price" : 100000 }, format="json")
        
        assert response.status_code == 200
            
    def test_add_payment(self):
        data = {
            "expiration_date" : "2022-12-12",
            "order" : self.order_id,
            "amount" : 10000
        }
        response = self.client.post(reverse('payment-list'), data=data, format="json")
        assert response.status_code == 400
        assert 'expiration_date' in response.json()
        tomorow = datetime.date.today() + datetime.timedelta(days=1)
        data = {
            "expiration_date" : tomorow.strftime("%Y-%m-%d"),
            "order" : self.order_id,
            "amount" : 100000
        }
        
        response = self.client.post(reverse('payment-list'), data=data, format="json")
        assert response.status_code == 201
        json = response.json()
        payment_id = json.get('id')
        assert json["payment"][0]["status"] == "PENDING"    
        assert json["amount_created"] == data["amount"]
        
        data = {
            "expiration_date" : tomorow.strftime("%Y-%m-%d"),
            "order" : self.order_id,
            "amount" : 50000
        }
        response = self.client.post(reverse('payment-list'), data=data, format="json")
        assert response.status_code == 201
        js = response.json()
        assert js['amount_created'] == 150000
        payment_id_2 = js.get('payment')[1].get('id')
        
        response = self.client.delete(reverse('payment-list') + str(payment_id) + "/")
        assert response.status_code == 200
        assert response.json().get("amount_created") == 50000
        
        response = self.client.patch(reverse('payment-list') + str(payment_id_2) + "/", 
                                     data = {"amount" : 80000}, format = "json")
        assert response.status_code == 200
        assert response.json().get("amount_created") == 80000
        
        response = self.client.delete(reverse('payment-list') + str(payment_id_2) + "/")
        assert response.status_code == 200
        assert response.json().get("amount_created") == 0
        assert len(response.json().get("payment")) == 0
    
    def test_update_payment(self):
        tomorow = datetime.date.today() + datetime.timedelta(days=1)
        data = {
            "expiration_date" : tomorow.strftime("%Y-%m-%d"),
            "order" : self.order_id,
            "amount" : 100000
        }
        
        response = self.client.post(reverse('payment-list'), data=data, format="json")
        assert response.status_code == 201
        payment_id = response.json().get('payment')[0].get('id')
        data = {
            "amount" : 150000
        }
        url = f"{reverse('payment-list')}{payment_id}/"
        response = self.client.patch(url, data = data, format = "json")
        assert response.status_code == 200
        js = response.json()
        assert js['amount_created'] == 150000
        
        data = {
            "amount" : 200000
        }
        response = self.client.patch(url, data=data, format="json")
        assert response.status_code == 400
        assert response.json().get("detail") == "The amount exceed the remaining amount"
        
    def test_paid_payment(self):
        pass 