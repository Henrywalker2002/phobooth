@echo off 
set DB_NAME=%~1
set PGPASSWORD=1

"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -h localhost -p 5432 -U postgres -d "test_db" -f "%cd%\temporary_db\%DB_NAME%.sql"