import json 
import requests
import os 

url = "http://127.0.0.1:8000/"

data = json.load(open('tree.json', encoding='utf-8'))
count = 0

for provide_code in data:
    provide = data[provide_code]   
    
    districts = provide.pop('quan-huyen')
    district_lst = []
    for district_code in districts:
        dictrict = districts[district_code]
        wards = dictrict.pop('xa-phuong')
        ward_lst = []
        
        for ward_code in wards:
            ward = wards[ward_code]
            ward['code'] = int(ward_code)
            ward_lst.append(ward)
        
        dictrict['wards'] = ward_lst
        dictrict['code'] = int(district_code)
        district_lst.append(districts[district_code])
    
    provide['districts'] = district_lst    
    provide['code'] = int(provide_code)
    
    response = requests.post(url + 'province/', json=provide)
    
    print(count, '/', len(data.keys()))
    count += 1
    
    if (response.status_code != 201):
        print(response.status_code)
        print(response.text)
        
        