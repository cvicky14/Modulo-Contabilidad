USE ContaBD

-- Tabla de Perfiles
CREATE TABLE conta_schema.Perfiles (
    PerfilID INT PRIMARY KEY,
    NombrePerfil VARCHAR(255),
);

-- Tabla de Usuarios
CREATE TABLE conta_schema.Usuarios (
    UsuarioID INT PRIMARY KEY,
    NombreUsuario VARCHAR(50),
    Contrasena VARCHAR(50),
    PerfilID INT,
    FOREIGN KEY (PerfilID) REFERENCES conta_schema.Perfiles(PerfilID)
);

-- Crear la tabla Menu
CREATE TABLE conta_schema.Menu (
    IdMenu INT PRIMARY KEY,
    NombreMenu VARCHAR(255),
    MenuPadreId INT,
    FOREIGN KEY (MenuPadreId) REFERENCES conta_schema.Menu (IdMenu),
);

--asignacion de menu/submenu a roles
CREATE TABLE conta_schema.ControlAcceso (
    PerfilID INT,
    IdMenu INT,
    FOREIGN KEY (PerfilID) REFERENCES conta_schema.Perfiles(PerfilID),
    FOREIGN KEY (IdMenu) REFERENCES conta_schema.Menu(IdMenu)
);


Use ContaBD
select * from conta_schema.ControlAcceso;

select * from conta_schema.Perfiles
SELECT * FROM conta_schema.Usuarios WHERE NombreUsuario = 'contador' AND Contrasena = 'co1234';

SELECT M.IdMenu, M.NombreMenu, M.MenuPadreID
FROM conta_schema.Menu AS M
INNER JOIN conta_schema.ControlAcceso AS CA ON M.IdMenu = CA.IdMenu
WHERE CA.PerfilID = 1
