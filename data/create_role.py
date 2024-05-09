import requests


def create_role():
    lst = ["customer", "studio", "admin", "staff"]
    url = "http://localhost:8000/"
    
    for role in lst:
        response = requests.get(url + 'role?code_name=' + role)
        json = response.json()
        if json.get('count', 0) == 0:
            permission = requests.get(url + 'permission/?code_name=' + role)
            if permission.json().get('count') == 0:
                data = {
                    "code_name": role,
                    "friendly_name": role,
                    "description": role
                }
                response = requests.post(url + 'permission/', data=data)
            permission = requests.get(url + 'permission/?code_name=' + role)
            data = {
                "code_name": role,
                "friendly_name": role,
                "description": role,
                "permission": [
                    permission.json()['results'][0]['id']
                ]
            }
            response = requests.post(url + 'role/', data=data)
        print(response.json())
        

create_role()