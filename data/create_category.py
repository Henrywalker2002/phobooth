import requests


def create_catogory():
    url = "http://localhost:8000/"
    lst = ["ảnh gia đình", "ảnh tư nhân"]
    
    response = requests.post(url + 'login/', data = {
        "username": "admin",
        "password": "password"
    })
    access_token = response.json().get('access')
    for category in lst:
        data = {"title": category, "description": "no", "type": "SERVICE"}
        response = requests.post(url + 'category/', data=data, headers= {
            "content_type" : "application/json",
            'Authorization': 'Bearer ' + access_token
        })
        if response.status_code != 201:
            print(response.json())
    
    data = {"title": "phụ kiện", "description": "no", "type": "PRODUCT"}
    response = requests.post(url + 'category/', data=data, headers= {
            "content_type" : "application/json",
            "Authorization": "Bearer " + access_token 
        })
    if response.status_code != 201:
        print(response.json())

create_catogory()