cd backend 

start cmd.exe /C py manage.py runserver 0.0.0.0:8000
start cmd.exe /C py manage.py check_order_item
start cmd.exe /C py manage.py check_order_pay 
start cmd.exe /C py manage.py create_email 
start cmd.exe /C py manage.py send_mail

cd ..
cd frontend 
start cmd.exe /C npm run dev -- --host