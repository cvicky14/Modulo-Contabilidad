ALTER SESSION SET "_oracle_script"=TRUE;
--manejar diferentes empresas(catalogos contables)

CREATE TABLE Admin_user.Empresas (
  EmpresaID NUMBER PRIMARY KEY,
  NombreEmpresa VARCHAR(255)
)TABLESPACE conta_ts;
--otrogar permisos de la secuencia a mi usuario crud
GRANT SELECT ON Movimientos_Seq TO crud_conta;
--secuencia publica
GRANT SELECT ON Movimientos_Seq TO PUBLIC;
GRANT SELECT ON secuencia_cuenta_id TO PUBLIC;

CREATE SEQUENCE Movimientos_Seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE SEQUENCE secuencia_cuenta_id
  MINVALUE 1
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
ALTER TABLE CuentasContables
MODIFY (CuentaID NUMBER DEFAULT secuencia_cuenta_id.NEXTVAL);


-- Crear la tabla Movimientos con ID autoincrementable
CREATE TABLE Admin_user.Movimientos (
    ID_Movimiento NUMBER DEFAULT Movimientos_Seq.NEXTVAL PRIMARY KEY,
    EmpresaID NUMBER,
    Fecha DATE,
    Tipo VARCHAR2(50),
    Descripcion VARCHAR2(255),
    Monto NUMBER(10, 2),
    CuentaOrigen VARCHAR2(100),
    CuentaDestino VARCHAR2(100),
    DocumentoReferencia VARCHAR2(50),
    Responsable VARCHAR2(100),
    Categoria VARCHAR2(50),
    EstadoCierre VARCHAR2(10),
    FOREIGN KEY (EmpresaID) REFERENCES Admin_user.Empresas(EmpresaID)
)TABLESPACE conta_ts;

drop table Admin_user.CuentasContables;
--almacenar informacion de las cuentas
CREATE TABLE Admin_user.CuentasContables (
  CuentaID NUMBER PRIMARY KEY,
  CodigoCuenta NUMBER,
  DescripcionCuenta VARCHAR(255),
  NivelCuenta NUMBER,
  MascaraContable VARCHAR(50),
  EmpresaID NUMBER REFERENCES Empresas(EmpresaID)
)TABLESPACE conta_ts;

--gestionar los centros de costos 
CREATE TABLE Admin_user.CentrosDeCosto (
  CentroCostoID NUMBER PRIMARY KEY,
  NombreCentroCosto VARCHAR(255),
  EmpresaID NUMBER REFERENCES Empresas(EmpresaID)
)TABLESPACE conta_ts;

--Detalles de asientos contables
CREATE TABLE Admin_user.AsientosContables (
  AsientoID NUMBER PRIMARY KEY,
  FechaAsiento DATE,
  DescripcionAsiento VARCHAR(255),
  MontoDebito NUMBER,
  MontoCredito NUMBER,
  CuentaID_Debito NUMBER REFERENCES CuentasContables(CuentaID),
  CuentaID_Credito NUMBER REFERENCES CuentasContables(CuentaID),
  CentroCostoID NUMBER REFERENCES CentrosDeCosto(CentroCostoID)
)TABLESPACE conta_ts;

--periodos vinculados a empresas especificas
CREATE TABLE Admin_user.PeriodosFiscales (
    PeriodoID NUMBER PRIMARY KEY,
    AnioFiscal NUMBER,
    MesFiscal NUMBER,
    FechaInicio DATE,
    FechaCierre DATE,
    EstadoPeriodo VARCHAR2(20),
    EmpresaID NUMBER,
    FOREIGN KEY (EmpresaID) REFERENCES Empresas(EmpresaID)
)TABLESPACE conta_ts;

--archivos asociados a empresas
CREATE TABLE Admin_user.ArchivosElectronicos (
    ArchivoID NUMBER PRIMARY KEY,
    NombreArchivo VARCHAR2(100),
    TipoArchivo VARCHAR2(20),
    RutaArchivo VARCHAR2(200),
    FechaCreacion DATE,
    UsuarioCreacion VARCHAR2(50),
    EmpresaID NUMBER,
    FOREIGN KEY (EmpresaID) REFERENCES Empresas(EmpresaID)
)TABLESPACE conta_ts;



INSERT INTO Admin_user.Empresas (EmpresaID, NombreEmpresa)
VALUES (1, 'EcoPower');

INSERT INTO Admin_user.Empresas (EmpresaID, NombreEmpresa)
VALUES (2, 'skyline');

INSERT INTO Admin_user.Empresas (EmpresaID, NombreEmpresa)
VALUES (3, 'SecureData');

INSERT INTO Admin_user.Empresas (EmpresaID, NombreEmpresa)
VALUES (4, 'Pixel');



---Movimietos

-- Inserciones para Empresa con ID 1
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(1, TO_DATE('10/10/2023', 'DD-MM-YYYY'), 'Venta', 'Venta de producto A', 1000.00, 'CuentaA', 'CuentaB', 'Factura001', 'Usuario1', 'Ventas', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(1, TO_DATE('11/10/2023', 'DD-MM-YYYY'), 'Gasto', 'Pago de proveedor', -500.00, 'CuentaB', 'CuentaC', 'Factura002', 'Usuario2', 'Gastos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(1, TO_DATE('12/10/2023', 'DD-MM-YYYY'), 'Ingreso', 'Ingreso por inversión', 1500.00, 'CuentaD', 'CuentaA', 'Recibo001', 'Usuario3', 'Ingresos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(1, TO_DATE('13/10/2023', 'DD-MM-YYYY'), 'Compra', 'Compra de suministros', -300.00, 'CuentaE', 'CuentaA', 'Factura003', 'Usuario4', 'Compras', 'Abierto');

-- Inserciones para Empresa con ID 2
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(2, TO_DATE('14/10/2023', 'DD-MM-YYYY'), 'Venta', 'Venta de producto B', 1200.00, 'CuentaA', 'CuentaB', 'Factura004', 'Usuario5', 'Ventas', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(2, TO_DATE('15/10/2023', 'DD-MM-YYYY'), 'Gasto', 'Pago de proveedor', -600.00, 'CuentaB', 'CuentaC', 'Factura005', 'Usuario6', 'Gastos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(2, TO_DATE('16/10/2023', 'DD-MM-YYYY'), 'Ingreso', 'Ingreso por inversión', 1800.00, 'CuentaD', 'CuentaA', 'Recibo002', 'Usuario7', 'Ingresos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(2, TO_DATE('17/10/2023', 'DD-MM-YYYY'), 'Compra', 'Compra de suministros', -400.00, 'CuentaE', 'CuentaA', 'Factura006', 'Usuario8', 'Compras', 'Abierto');

-- Inserciones para Empresa con ID 3
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(3, TO_DATE('10/10/2023', 'DD-MM-YYYY'), 'Venta', 'Venta de producto C', 800.00, 'CuentaA', 'CuentaB', 'Factura007', 'Usuario9', 'Ventas', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(3, TO_DATE('19/10/2023', 'DD-MM-YYYY'), 'Gasto', 'Pago de proveedor', -400.00, 'CuentaB', 'CuentaC', 'Factura008', 'Usuario10', 'Gastos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(3, TO_DATE('20/10/2023', 'DD-MM-YYYY'), 'Ingreso', 'Ingreso por inversión', 1000.00, 'CuentaD', 'CuentaA', 'Recibo003', 'Usuario11', 'Ingresos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(3, TO_DATE('21/10/2023', 'DD-MM-YYYY'), 'Compra', 'Compra de suministros', -250.00, 'CuentaE', 'CuentaA', 'Factura009', 'Usuario12', 'Compras', 'Abierto');

-- Inserciones para Empresa con ID 4
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(4, TO_DATE('22/10/2023', 'DD-MM-YYYY'), 'Venta', 'Venta de producto D', 700.00, 'CuentaA', 'CuentaB', 'Factura010', 'Usuario13', 'Ventas', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(4, TO_DATE('23/10/2023', 'DD-MM-YYYY'), 'Gasto', 'Pago de proveedor', -350.00, 'CuentaB', 'CuentaC', 'Factura011', 'Usuario14', 'Gastos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(4, TO_DATE('24/10/2023', 'DD-MM-YYYY'), 'Ingreso', 'Ingreso por inversión', 900.00, 'CuentaD', 'CuentaA', 'Recibo004', 'Usuario15', 'Ingresos', 'Abierto');
INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, DocumentoReferencia, Responsable, Categoria, EstadoCierre)
VALUES
(4, TO_DATE('25/10/2023', 'DD-MM-YYYY'), 'Compra', 'Compra de suministros', -280.00, 'CuentaE', 'CuentaA', 'Factura012', 'Usuario16', 'Compras', 'Abierto');

--insert cuentas contables.

-- Para la EmpresaID 1
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (1051, 'Cuenta de Activos', 1, 'Mascara 1', 1);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (1052, 'Cuenta de Pasivos', 1, 'Mascara 2', 1);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (1053, 'Cuenta de Ingresos', 1, 'Mascara 3', 1);

-- Para la EmpresaID 2
INSERT INTO Admin_user.CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (2014, 'Cuenta de Gastos', 1, 'Mascara 1', 2);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (2024, 'Cuenta de Capital', 1, 'Mascara 2', 2);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (2034, 'Cuenta de Ventas', 1, 'Mascara 3', 2);

-- Para la EmpresaID 3
INSERT INTO Admin_user.CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (3701, 'Cuenta de Impuestos', 1, 'Mascara 1', 3);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (3702, 'Cuenta de Depreciación', 1, 'Mascara 2', 3);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (3703, 'Cuenta de Utilidades', 1, 'Mascara 3', 3);

-- Para la EmpresaID 4
INSERT INTO Admin_user.CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (4801, 'Cuenta de Prestamos', 1, 'Mascara 1', 4);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (4802, 'Cuenta de Caja', 1, 'Mascara 2', 4);
INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
VALUES
  (4803, 'Cuenta de Costos', 1, 'Mascara 3', 4);
