from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app_cierre = Flask(__name__)

cors = CORS(app_cierre , resources={r"/api/*": {"origins": "http://localhost", "supports_credentials": True}})


def conexion_oracle():
    connection_stringOracle = ('DRIVER={Oracle en OraDB21Home1};SERVER=192.168.56.1:1521/xe;UID=crud_conta;PWD=crud1234')
    return pyodbc.connect(connection_stringOracle)

#obtener las empresas y sus movimientos
@app_cierre.route('/api/empresas', methods=['GET', 'POST'])
def cierre_anual():
    if request.method == 'GET':
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()
            query = "SELECT EmpresaID, NombreEmpresa FROM Empresas"
            cursor.execute(query)
            empresas = cursor.fetchall()
            cursor.close()
            connection.close()
            empresas_list = [{'EmpresaID': int(e[0]), 'NombreEmpresa': e[1]} for e in empresas]

            return jsonify({'empresas': empresas_list}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500

    elif request.method == 'POST':
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()
            
            empresa_id = request.json.get('empresaID')
            filtro = request.json.get('filtro')  # Parámetro para el tipo de filtro (fecha, estado, todos)
            
            if filtro == 'todos':
                # Consulta para mostrar todos los movimientos
                query_movimientos = """
                    SELECT ID_Movimiento, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, 
                        DocumentoReferencia, Responsable, Categoria, EstadoCierre
                    FROM Movimientos
                    WHERE EmpresaID = ?
                """
                cursor.execute(query_movimientos, (empresa_id))
                
            elif filtro == 'fecha':
                # Consulta para filtrar por fecha
                fecha = request.json.get('fecha')
                
                query_movimientos = """
                    SELECT ID_Movimiento, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, 
                        DocumentoReferencia, Responsable, Categoria, EstadoCierre
                    FROM Movimientos
                    WHERE EmpresaID = ? AND Fecha = TO_DATE(?, 'dd mm yyyy')
                """
                cursor.execute(query_movimientos, (empresa_id, fecha))

            elif filtro == 'estado':
                # Consulta para filtrar por estado de cierre
                estado_cierre = request.json.get('EstadoCierre')
                query_movimientos = """
                    SELECT ID_Movimiento, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, 
                        DocumentoReferencia, Responsable, Categoria, EstadoCierre
                    FROM Movimientos
                    WHERE EmpresaID = ? AND EstadoCierre = ?
                """
                cursor.execute(query_movimientos, (empresa_id, estado_cierre))

            
            movimientos = cursor.fetchall()
            cursor.close()
            connection.close()

            movimiento_list = []
            for row in movimientos:
                movimiento_list.append({
                    'ID_Movimiento': int(row[0]),
                    'Fecha': row[1].strftime('%d %m %Y'),
                    'Tipo': row[2],
                    'Descripcion': row[3],
                    'Monto': float(row[4]),
                    'CuentaOrigen': row[5],
                    'CuentaDestino': row[6],
                    'DocumentoReferencia': row[7],
                    'Responsable': row[8],
                    'Categoria': row[9],
                    'EstadoCierre': row[10]
                })

            return jsonify({'Movimientos': movimiento_list}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500

#insert para los movimientos
@app_cierre.route('/api/empresas/movimientos-insert', methods=['POST'])
def insertar_movimiento():
    connection = conexion_oracle()
    if connection:
        cursor = connection.cursor()
        
        data = request.json
        empresa_id = data.get('empresaID')
        fecha = data.get('fecha')
        tipo = data.get('tipo')
        descripcion = data.get('descripcion')
        monto = data.get('monto')
        cuenta_origen = data.get('cuentaOrigen')
        cuenta_destino = data.get('cuentaDestino')
        documento_referencia = data.get('documentoReferencia')
        responsable = data.get('responsable')
        categoria = data.get('categoria')
        estado_cierre = data.get('estadoCierre')
        
        query_insert = """
            INSERT INTO Movimientos (EmpresaID, Fecha, Tipo, Descripcion, Monto, CuentaOrigen, CuentaDestino, 
            DocumentoReferencia, Responsable, Categoria, EstadoCierre)
            VALUES (?, TO_DATE(?, 'DD-MM-YYYY'), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        cursor.execute(query_insert, (empresa_id, fecha, tipo, descripcion, monto, cuenta_origen, cuenta_destino,
                    documento_referencia, responsable, categoria, estado_cierre))
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Movimiento insertado exitosamente'}), 201
    else:
        return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500

#update para los movimientos
@app_cierre.route('/api/empresas/movimientos-update/<int:movimiento_id>', methods=['PUT'])
def actualizar_movimiento(movimiento_id):
    connection = conexion_oracle()
    if connection:
        cursor = connection.cursor()
        
        data = request.json
        fecha = data.get('fecha')
        tipo = data.get('tipo')
        descripcion = data.get('descripcion')
        monto = data.get('monto')
        cuenta_origen = data.get('cuentaOrigen')
        cuenta_destino = data.get('cuentaDestino')
        documento_referencia = data.get('documentoReferencia')
        responsable = data.get('responsable')
        categoria = data.get('categoria')
        estado_cierre = data.get('estadoCierre')
        
        query_update = """
            UPDATE Movimientos
            SET Fecha = TO_DATE(?, 'DD-MM-YYYY'), Tipo=?, Descripcion=?, Monto=?, CuentaOrigen=?, CuentaDestino=?, 
            DocumentoReferencia=?, Responsable=?, Categoria=?, EstadoCierre=?
            WHERE ID_Movimiento=?
        """
        
        cursor.execute(query_update, (fecha, tipo, descripcion, monto, cuenta_origen, cuenta_destino,
                    documento_referencia, responsable, categoria, estado_cierre, movimiento_id))
        connection.commit() 
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Movimiento actualizado exitosamente'}), 200
    else:
        return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500

#delete para los movimientos
@app_cierre.route('/api/empresas/movimientos-delete/<int:movimiento_id>', methods=['DELETE'])
def eliminar_movimiento(movimiento_id):
    connection = conexion_oracle()
    if connection:
        cursor = connection.cursor()
        
        query_delete = "DELETE FROM Movimientos WHERE ID_Movimiento=?"
        
        cursor.execute(query_delete, (movimiento_id,))
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Movimiento eliminado exitosamente'}), 200
    else:
        return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500


#obtener las cuentas contables
@app_cierre.route('/api/empresas/cuentas-contables/<int:empresa_id>', methods=['GET'])
def obtener_cuentas_contables(empresa_id):
    try:
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()
            
            query_select = "SELECT CuentaID, CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable FROM CuentasContables WHERE EmpresaID = ?"
            cursor.execute(query_select, empresa_id)
            
            cuentas = []
            for row in cursor:
                cuenta = {
                    'CuentaID': int(row[0]),
                    'CodigoCuenta': int(row[1]),
                    'DescripcionCuenta': row[2],
                    'NivelCuenta': int(row[3]),
                    'MascaraContable': row[4]
                }
                cuentas.append(cuenta)
            
            cursor.close()
            connection.close()
            
            return jsonify(cuentas), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#insertar cuentas contables
@app_cierre.route('/api/empresas/cuentas-insert', methods=['POST'])
def insertar_cuenta_contable():
    try:
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()

            data = request.json
            codigo_cuenta = data.get('CodigoCuenta')
            descripcion_cuenta = data.get('DescripcionCuenta')
            nivel_cuenta = data.get('NivelCuenta')
            mascara_contable = data.get('MascaraContable')
            empresa_id = data.get('EmpresaID')

            query_insert = """
                INSERT INTO CuentasContables (CodigoCuenta, DescripcionCuenta, NivelCuenta, MascaraContable, EmpresaID)
                VALUES (?, ?, ?, ?, ?)
            """

            cursor.execute(query_insert, (codigo_cuenta, descripcion_cuenta, nivel_cuenta, mascara_contable, empresa_id))
            connection.commit()
            cursor.close()
            connection.close()

            return jsonify({'message': 'Cuenta contable insertada exitosamente'}), 201
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#actualizar cuentas contables
@app_cierre.route('/api/empresas/cuentas-update/<int:cuenta_id>', methods=['PUT'])
def actualizar_cuenta_contable(cuenta_id):
    try:
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()

            data = request.json
            codigo_cuenta = data.get('CodigoCuenta')
            descripcion_cuenta = data.get('DescripcionCuenta')
            nivel_cuenta = data.get('NivelCuenta')
            mascara_contable = data.get('MascaraContable')

            query_update = """
                UPDATE CuentasContables
                SET CodigoCuenta=?, DescripcionCuenta=?, NivelCuenta=?, MascaraContable=?
                WHERE CuentaID=?
            """

            cursor.execute(query_update, (codigo_cuenta, descripcion_cuenta, nivel_cuenta, mascara_contable, cuenta_id))
            connection.commit()
            cursor.close()
            connection.close()

            return jsonify({'message': 'Cuenta contable actualizada exitosamente'}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#eliminar cuentas contables
@app_cierre.route('/api/empresas/cuentas-delete/<int:cuenta_id>', methods=['DELETE'])
def eliminar_cuenta_contable(cuenta_id):
    try:
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()
        
            query_delete = "DELETE FROM CuentasContables WHERE CuentaID=?"

            cursor.execute(query_delete, (cuenta_id,))
            connection.commit()
            cursor.close()
            connection.close()
        
            return jsonify({'message': 'Cuenta contable eliminada exitosamente'}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#realizar cierre
@app_cierre.route('/api/empresas/actualizar-estado-cierre/<int:empresa_id>', methods=['PUT'])
def actualizar_estado_cierre(empresa_id):
    try:
        # Realizar la actualización en la base de datos
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()

            query_update = "UPDATE Movimientos SET EstadoCierre = 'Cerrado' WHERE EmpresaID = ?"
            cursor.execute(query_update, empresa_id)
            connection.commit()
            cursor.close()
            connection.close()

            return jsonify({'message': 'EstadoCierre actualizado exitosamente a "Cerrado"'}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#obtener descripcion de cuentas
@app_cierre.route('/api/empresas/cuentas-descripcion/<int:empresa_id>', methods=['GET'])
def obtener_descripcion(empresa_id):
    try:
        connection = conexion_oracle()
        if connection:
            cursor = connection.cursor()
            
            query_descripcion = "SELECT DescripcionCuenta FROM CuentasContables WHERE EmpresaID = ?"
            cursor.execute(query_descripcion, empresa_id)
            
            descripcion = []
            for row in cursor:
                desc = {
                    'DescripcionCuenta': row[0]
                    }
                descripcion.append(desc)
            
            cursor.close()
            connection.close()
            
            return jsonify(descripcion), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos de Oracle'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app_cierre.run(debug=True, port=5000)