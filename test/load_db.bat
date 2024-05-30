@echo off 
set DB_NAME=%~1
set PGPASSWORD=10042002

"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 5432 -U postgres -c "DROP DATABASE IF EXISTS test_db"
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 5432 -U postgres -c "CREATE DATABASE test_db"
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 5432 -U postgres -d test_db -f "%cd%\temporary_db/%DB_NAME%.sql"