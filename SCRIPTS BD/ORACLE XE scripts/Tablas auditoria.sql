CREATE TABLE Admin_user.Auditoria (
    IDAuditoria NUMBER PRIMARY KEY,
    IDUsuario NUMBER,
    NombreUsuario VARCHAR2(50) NOT NULL,
    RolUsuario VARCHAR2(20) NOT NULL,
    TipoEvento VARCHAR2(20) NOT NULL,
    DescripcionEvento VARCHAR2(200) NOT NULL,
    FechaHoraEvento TIMESTAMP NOT NULL,
    DireccionIP VARCHAR2(20)
) TABLESPACE auditoria_ts;
