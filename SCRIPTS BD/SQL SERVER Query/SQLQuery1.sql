--crear un schema
USE ContaBD;
USE MASTER
CREATE SCHEMA conta_schema;
-- Crear el usuario dueño y administrador
CREATE LOGIN contaDB WITH PASSWORD = 'uda1234';
CREATE USER contaDB FOR LOGIN contaDB;
ALTER ROLE db_owner ADD MEMBER contaDB;
ALTER AUTHORIZATION ON SCHEMA::conta_schema TO contaDB;
ALTER USER contaDB WITH DEFAULT_SCHEMA = conta_schema;
--GRANT CONTROL SERVER TO contaDB;  
GRANT CONNECT ANY DATABASE TO contaDB;
--GRANT CREATE TABLE, CREATE VIEW, CREATE PROCEDURE TO contaDB AS dbo;
GRANT CREATE ROLE TO contaDB;


-- USUARIO CRUD
USE ContaBD;
CREATE LOGIN conta_crud WITH PASSWORD = 'crud1234';
CREATE USER conta_crud FOR LOGIN conta_crud WITH DEFAULT_SCHEMA = conta_schema;