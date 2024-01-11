--crear tablespace modulo contabilidad y auditoria
CREATE TABLESPACE conta_ts DATAFILE 'C:\app\vicky\product\21c\oradata\proyecto\contabilidad_data.dbf' 
SIZE 100M AUTOEXTEND ON 
NEXT 10M MAXSIZE UNLIMITED;

CREATE TABLESPACE auditoria_ts DATAFILE 'C:\app\vicky\product\21c\oradata\proyecto\auditoria_data.dbf' 
SIZE 100M AUTOEXTEND ON 
NEXT 10M MAXSIZE UNLIMITED;

ALTER SESSION SET "_oracle_script"=TRUE;

--Ususario administrador 
CREATE USER admin_user IDENTIFIED BY ad1234
--conceder conexión
GRANT CREATE SESSION, CREATE TABLE, CREATE PROCEDURE, CREATE VIEW, 
CREATE TRIGGER, CREATE SEQUENCE, ALTER ANY TABLE TO admin_user;
--otorgar los privilegios
ALTER USER admin_user DEFAULT TABLESPACE conta_ts TEMPORARY TABLESPACE temp; 
ALTER USER admin_user DEFAULT ROLE ALL;
ALTER USER admin_user QUOTA UNLIMITED ON conta_ts, auditoria_ts;

--Usuario CRUD
CREATE USER crud_conta IDENTIFIED BY crud1234 
GRANT CREATE SESSION TO crud_conta;
--otorgar privilegios
ALTER USER crud_conta DEFAULT TABLESPACE conta_ts  TEMPORARY TABLESPACE temp;
ALTER USER crud_conta DEFAULT ROLE ALL;
