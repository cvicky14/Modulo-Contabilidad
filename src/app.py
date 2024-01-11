from flask import Flask, render_template, request, redirect, url_for, session
from conexion import crear_conexion

app = Flask(__name__, template_folder='../templates', static_folder='../static')
#clave para proteger sesiones de usuario
app.secret_key = 'ap1234'

#Redirigir al login
@app.route('/')
def root():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None 
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        #verificar el usuario en la base de datos
        conexion = crear_conexion()
        if conexion:
            cursor = conexion.cursor()
            query = "SELECT * FROM conta_schema.Usuarios WHERE NombreUsuario = ? AND Contrasena = ?"
            cursor.execute(query, (username, password))
            usuario = cursor.fetchone()
            conexion.close()
            
            #validacion
            if usuario:
                #si es correcto se inicia sesión
                session['username'] = username
                return redirect(url_for('dashboard'))
            else:
                #si es incorrecto se muestra mensaje de error y retorna al login
                error_message = "Usuario o contraseña incorrectos"
    
    return render_template('login.html', error_message=error_message)

# Función para construir una estructura jerárquica de menú
def construir_estructura_de_menu(menus, id_padre=None):
    #Construir jerarquicamente el menú a partir de una lista de menús y sus relaciones 
    estructura_de_menu = {}
    for id_menu, nombre_menu, id_menu_padre in menus:
        if id_menu_padre == id_padre:
            submenu = construir_estructura_de_menu(menus, id_menu)
            if submenu:
                estructura_de_menu[nombre_menu] = submenu
            else:
                estructura_de_menu[nombre_menu] = {}
    return estructura_de_menu

# Ruta para la página de dashboard
@app.route('/dashboard')
def dashboard():
    # Verificar si el usuario tiene una sesión activa
    if 'username' in session:
        username = session['username']
        conexion = crear_conexion()

        if conexion:
            cursor = conexion.cursor()

            # Obtener el PerfilID del usuario actual
            consulta_obtener_perfil = "SELECT PerfilID FROM conta_schema.Usuarios WHERE NombreUsuario = ?"
            cursor.execute(consulta_obtener_perfil, (username,))
            perfil_usuario = cursor.fetchone()[0]

            # Obtener los menús permitidos para el usuario actual
            consulta_obtener_menus = """
                SELECT M.IdMenu, M.NombreMenu, M.MenuPadreID
                FROM conta_schema.Menu AS M
                INNER JOIN conta_schema.ControlAcceso AS CA ON M.IdMenu = CA.IdMenu
                WHERE CA.PerfilID = ?
            """

            cursor.execute(consulta_obtener_menus, (perfil_usuario,))
            menus_permitidos = cursor.fetchall()

            # Construir una estructura de menú jerárquica
            jerarquia_de_menu = construir_estructura_de_menu(menus_permitidos)

            conexion.close()
            return render_template('dashboard.html', username=session['username'], menu_hierarchy=jerarquia_de_menu)

    return redirect(url_for('login'))


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)