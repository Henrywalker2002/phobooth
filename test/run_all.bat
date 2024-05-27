cd ..
cd backend 

start cmd.exe /C py manage.py runserver 0.0.0.0:8000
@REM py manage.py check_order_item
@REM py manage.py check_order_pay 
@REM py manage.py create_email 

cd ..
cd frontend 
start cmd.exe /C npm run dev -- --host