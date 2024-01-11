ALTER SESSION SET "_oracle_script"=TRUE;

--crear rol insertar,modificar, eliminar datos
CREATE ROLE ROL_IMED;

--Agregarlo a las tablas del modulo contabilidad
GRANT INSERT, UPDATE, DELETE ON Empresas TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON CuentasContables TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON CentrosDeCosto TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON AsientosContables TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON PeriodosFiscales TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON ArchivosElectronicos TO ROL_IMED;
GRANT INSERT, UPDATE, DELETE ON Movimientos TO ROL_IMED;
--Agrgarlo a la tabla del modulo auditoria
GRANT INSERT, UPDATE, DELETE ON Auditoria TO ROL_IMED;

--Crear rol para consultar informacion
CREATE ROLE ROL_CONSI;

--Agregarlo a las tablas del modulo contabilidad
GRANT SELECT ON Empresas TO ROL_CONSI;
GRANT SELECT ON CuentasContables TO ROL_CONSI;
GRANT SELECT ON CentrosDeCosto TO ROL_CONSI;
GRANT SELECT ON AsientosContables TO ROL_CONSI;
GRANT SELECT ON PeriodosFiscales TO ROL_CONSI;
GRANT SELECT ON ArchivosElectronicos TO ROL_CONSI;
GRANT SELECT ON Movimientos TO ROL_CONSI;
--Agrgarlo a las tablas del modulo auditoria
GRANT SELECT ON Auditoria TO ROL_CONSI;

--Asignar los roles al usuario CRUD
GRANT ROL_IMED TO crud_conta;
GRANT ROL_CONSI TO crud_conta;
