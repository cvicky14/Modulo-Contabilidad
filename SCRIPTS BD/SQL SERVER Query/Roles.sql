--ROLES
--ROL consultar informacion
CREATE ROLE Conta_CONSI;
--ROL insertar, modificar y eliminar datos
CREATE ROLE Conta_IMBD;

USE ContaBD;

--asignar mis tablas al rol Conta_IMBD
GRANT INSERT, UPDATE, DELETE ON conta_Schema.Menu TO Conta_IMBD;
GRANT INSERT, UPDATE, DELETE ON conta_Schema.Perfiles TO Conta_IMBD;
GRANT INSERT, UPDATE, DELETE ON conta_Schema.Usuarios TO Conta_IMBD;
GRANT INSERT, UPDATE, DELETE ON conta_Schema.ControlAcceso TO Conta_IMBD;

--asignar mis tablas al rol Conta_CONSI
GRANT SELECT ON conta_Schema.Menu TO Conta_CONSI;
GRANT SELECT ON conta_Schema.Perfiles TO Conta_CONSI;
GRANT SELECT ON conta_Schema.Usuarios TO Conta_CONSI;
GRANT SELECT ON conta_Schema.ControlAcceso TO Conta_CONSI;

EXEC sp_addrolemember 'Conta_IMBD', 'conta_crud';
EXEC sp_addrolemember 'Conta_CONSI', 'conta_crud';
