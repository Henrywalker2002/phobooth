import requests


def create_role():
    lst = ["customer", "studio", "admin", "staff"]
    url = "http://localhost:8000/"
    for role in lst:
        response = requests.get(url + 'role?code_name=' + role)
        json = response.json()
        if len(json) == 0:
            permission = requests.get(url + 'permission/?code_name=' + role)
            if len(permission.json()) == 0:
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
                    permission.json()[0]['id']
                ]
            }
            response = requests.post(url + 'role/', data=data)
        print(response.json())
        

create_role()