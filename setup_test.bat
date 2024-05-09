@echo off
set PGPASSWORD=1
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS test_db"
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE DATABASE test_db"

IF EXIST "%cd%\test_db.sql" (
    "C:\Program Files\PostgreSQL\15\bin\psql.exe" -h localhost -p 5432 -U postgres -d test_db -f "%cd%\test_db.sql"

   cd backend && py manage.py migrate 
   exit /B 1 
)

cd backend


py manage.py migrate
start cmd.exe /C py manage.py runserver 

py manage.py create_role 
py manage.py create_admin

cd .. 
cd data 
 
py create_address.py 
py create_category.py 

cd .. 

"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -h localhost -p 5432 -U postgres -d test_db -f "%cd%\test_db.sql"
