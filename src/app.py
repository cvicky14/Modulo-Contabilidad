from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
app.secret_key = 'clave123456'
app.config['SESSION_TYPE'] = 'filesystem'

cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost", "supports_credentials": True}})

def conexion_sql():
    connection_string = f'DRIVER=SQL Server;SERVER=DESKTOP-U9U5LKB\SQLEXPRESS;DATABASE=ContaBD;UID=conta_crud;PWD=crud1234'
    return pyodbc.connect(connection_string)


def construir_estructura_de_menu(menus, id_padre=None):
    # Construir jerárquicamente el menú a partir de una lista de menús y sus relaciones
    estructura_de_menu = []
    for id_menu, nombre_menu, id_menu_padre in menus:
        if id_menu_padre == id_padre:
            submenu = construir_estructura_de_menu(menus, id_menu)
            if submenu:
                # Añadir el menú o submenú en orden
                estructura_de_menu.append({"id_menu": id_menu, "nombre_menu": nombre_menu, "submenu": submenu})
            else:
                estructura_de_menu.append({"id_menu": id_menu, "nombre_menu": nombre_menu, "submenu": []})
    return estructura_de_menu


@app.route('/api/login', methods=['POST', 'GET'])
def login_dashboard():
    if request.method == 'POST':
        # Manejar la solicitud de inicio de sesión
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        error_message = None

        conexion = conexion_sql()
        if conexion:
            cursor = conexion.cursor()
            query = "SELECT UsuarioID, PerfilID FROM conta_schema.Usuarios WHERE NombreUsuario = ? AND Contrasena = ?"
            cursor.execute(query, (username, password))
            usuario = cursor.fetchone()

            if usuario:
                perfil_id = usuario[1]
                query_perfil = "SELECT NombrePerfil FROM conta_schema.Perfiles WHERE PerfilID = ?"
                cursor.execute(query_perfil, (perfil_id,))
                perfil = cursor.fetchone()

                if perfil:
                    # Almacenar los datos del usuario y los menús permitidos en la sesión
                    session['username'] = username
                    session['perfil'] = perfil[0]

                    # Obtener los menús permitidos y almacenarlos en la sesión
                    consulta_obtener_menus = """
                        SELECT M.IdMenu, M.NombreMenu, M.MenuPadreID
                        FROM conta_schema.Menu AS M
                        INNER JOIN conta_schema.ControlAcceso AS CA ON M.IdMenu = CA.IdMenu
                        WHERE CA.PerfilID = ?
                    """
                    cursor.execute(consulta_obtener_menus, (perfil_id,))
                    menus_permitidos = cursor.fetchall()
                    session['menus'] = construir_estructura_de_menu(menus_permitidos)

                    conexion.close()
                    return jsonify({"perfil": perfil[0]}), 200
                else:
                    error_message = "Perfil no encontrado"
            else:
                error_message = "Usuario o contraseña incorrectos"
            conexion.close()
        return jsonify({"error": error_message}), 401

    elif request.method == 'GET':
        # Manejar la solicitud de dashboard
        if 'username' in session:
            # Obtener los datos de la sesión, incluyendo los menús permitidos
            username = session['username']
            perfil = session['perfil']
            menus = session['menus']

            return jsonify({'perfil': perfil, 'menus': menus}), 200

        return jsonify({'message': 'Acceso no autorizado'}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    # Verificar si el usuario está autenticado (en la sesión)
    if 'username' in session:
        # Eliminar los datos de la sesión para cerrar la sesión del usuario
        session.pop('username', None)
        session.pop('perfil', None)
        session.pop('menus', None)

        return jsonify({'message': 'Sesión cerrada exitosamente'}), 200
    else:
        return jsonify({'message': 'El usuario no ha iniciado sesión'}), 401


if __name__ == '__main__':
    app.run(debug=True, port=4000)