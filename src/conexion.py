import pyodbc

# Configura los detalles de la conexión
server = 'DESKTOP-U9U5LKB\SQLEXPRESS'
database = 'ContaBD'
username = 'conta_crud'
password = 'crud1234'
connection_string = f'DRIVER=SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'

def crear_conexion():
    try:
        conexion = pyodbc.connect(connection_string)
        return conexion
    except Exception as e:
        print("Error al conectar a la base de datos:", e)
        return None
