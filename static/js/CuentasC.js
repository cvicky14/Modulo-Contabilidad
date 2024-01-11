function mostrarTablaCuentas(empresaID, nombreEmpresa) {
    const tablaDiv = document.getElementById('tabla-div');
    tablaDiv.innerHTML = '';

    // Crear un encabezado h2 con el nombre de la empresa
    const h2 = document.createElement('h2');
    h2.textContent = `Cuentas Contables de la empresa: ${nombreEmpresa}`;
    h2.classList.add('datos-empresa');
    tablaDiv.appendChild(h2);

    // Botón "Insertar Cuenta Contable"
    const insertarCuentaBtn = document.createElement('button');
    insertarCuentaBtn.textContent = 'Insertar';
    insertarCuentaBtn.classList.add('insertar-cuenta-btn');
    tablaDiv.appendChild(insertarCuentaBtn);

    insertarCuentaBtn.addEventListener('click', function() {
        const formularioInsercion = document.createElement('form');
        formularioInsercion.classList.add('formulario-insercion');
        formularioInsercion.innerHTML = `
            <label for="codigoCuenta">Código de Cuenta:</label>
            <input type="text" id="codigoCuenta" name="codigoCuenta" required>
            <label for="descripcionCuenta">Descripción de Cuenta:</label>
            <input type="text" id="descripcionCuenta" name="descripcionCuenta" required>
            <label for="nivelCuenta">Nivel de Cuenta:</label>
            <input type="number" id="nivelCuenta" name="nivelCuenta" required>
            <label for="mascaraContable">Máscara Contable:</label>
            <input type="text" id="mascaraContable" name="mascaraContable" required>
            <input type="hidden" name="empresaID" value="${empresaID}">
            <button type="submit" class="guardar-datos-btn">Guardar Datos</button>
        `;
        tablaDiv.appendChild(formularioInsercion);

        formularioInsercion.addEventListener('submit', function(event) {
            event.preventDefault();
            const nuevaCuenta = {
                CodigoCuenta: document.getElementById('codigoCuenta').value,
                DescripcionCuenta: document.getElementById('descripcionCuenta').value,
                NivelCuenta: parseInt(document.getElementById('nivelCuenta').value),
                MascaraContable: document.getElementById('mascaraContable').value,
                EmpresaID: document.querySelector('input[name="empresaID"]').value
            };

            fetch('http://localhost:5000/api/empresas/cuentas-insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaCuenta)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); 
                mostrarTablaCuentas(empresaID, nombreEmpresa)
            })
            .catch(error => {
                console.error('Error al insertar la cuenta contable:', error);
            });
        });
    });
    // Hacer una solicitud a la API para obtener las cuentas contables de la empresa
    fetch(`http://localhost:5000/api/empresas/cuentas-contables/${empresaID}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        // Crear una tabla HTML
        const nuevaTabla = document.createElement('table');
        nuevaTabla.classList.add('tabla-cuentas'); // Mantenemos la clase 'tabla-cuentas'

        // Crear encabezados de tabla
        const encabezados = document.createElement('thead');
        const encabezadoFila = document.createElement('tr');
        encabezadoFila.innerHTML = `
            <th>Código de Cuenta</th>
            <th>Descripción de Cuenta</th>
            <th>Nivel de Cuenta</th>
            <th>Máscara Contable</th>
        `;
        encabezados.appendChild(encabezadoFila);
        nuevaTabla.appendChild(encabezados);

        // Crear filas de datos
        const cuerpoTabla = document.createElement('tbody');
        data.forEach(cuenta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cuenta.CodigoCuenta}</td>
                <td>${cuenta.DescripcionCuenta}</td>
                <td>${cuenta.NivelCuenta}</td>
                <td>${cuenta.MascaraContable}</td>
                <td class="boton-td">
                    <button class="actualizar-btn" data-cuentas-id="${cuenta.CuentaID}"><i class="fas fa-pen"></i></button>
                    <button class="delete-btn" data-cuentas-id="${cuenta.CuentaID}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
                // Agregar un manejador de eventos para el botón "Actualizar"
                const actualizarBtn = fila.querySelector('.actualizar-btn');
                actualizarBtn.addEventListener('click', () => {
                    // Mostrar el formulario de actualización y prellenar los campos con los datos del movimiento
                    mostrarFormularioActualizacion(cuenta)
                });

                // Agregar un manejador de eventos para el botón "Eliminar"
                const deleteBtn = fila.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    // Aquí debes agregar la lógica para eliminar el movimiento
                    if (confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
                        eliminarMovimiento(cuenta.CuentaID);
                    }
                });

            cuerpoTabla.appendChild(fila);
        });
        nuevaTabla.appendChild(cuerpoTabla);

        tablaDiv.appendChild(nuevaTabla);

    })
    .catch(error => {
        console.error('Error al obtener cuentas contables:', error);
    });
    // Función para eliminar un movimiento
    function eliminarMovimiento(CuentaID) {
        // Realizar una solicitud DELETE para eliminar el movimiento en el servidor
        fetch(`http://localhost:5000/api/empresas/cuentas-delete/${CuentaID}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta y actualizar la tabla de movimientos
            if (data.message === 'Cuenta contable eliminada exitosamente') {
                mostrarTablaCuentas(empresaID, nombreEmpresa);
            }            
        })
        .catch(error => {
            console.error('Error al eliminar cuenta:', error);

        });
    }

    // Función para mostrar el formulario de actualización
    function mostrarFormularioActualizacion(cuenta) {
        const formularioActualizacion = document.createElement('form');
        formularioActualizacion.classList.add('formulario-actualizacion');
    
        formularioActualizacion.innerHTML = `
            <label for="codigoCuenta">Código de Cuenta:</label>
            <input type="text" id="codigoCuenta" name="codigoCuenta" value="${cuenta.CodigoCuenta}">
            <label for "descripcionCuenta">Descripción de Cuenta:</label>
            <input type="text" id="descripcionCuenta" name="descripcionCuenta" value="${cuenta.DescripcionCuenta}" required>
            <label for="nivelCuenta">Nivel de Cuenta:</label>
            <input type="number" id="nivelCuenta" name="nivelCuenta" value="${cuenta.NivelCuenta}" required>
            <label for="mascaraContable">Máscara Contable:</label>
            <input type="text" id="mascaraContable" name="mascaraContable" value="${cuenta.MascaraContable}" required>
            <button type="submit" class="guardar-actualizacion-btn">Actualizar Datos</button>
        `;
    
        formularioActualizacion.addEventListener('submit', function(event) {
            event.preventDefault();
            // Obtener los valores actualizados del formulario
            const actualizadaCuenta = {
                CodigoCuenta: document.getElementById('codigoCuenta').value,
                DescripcionCuenta: document.getElementById('descripcionCuenta').value,
                NivelCuenta: parseInt(document.getElementById('nivelCuenta').value),
                MascaraContable: document.getElementById('mascaraContable').value,
            };
            console.log('Datos a enviar:', actualizadaCuenta);
    
            fetch(`http://localhost:5000/api/empresas/cuentas-update/${cuenta.CuentaID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actualizadaCuenta)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Eliminar el formulario de actualización después de guardar los cambios
                formularioActualizacion.remove();
                mostrarTablaCuentas(empresaID, nombreEmpresa);
            })
            .catch(error => {
                console.error('Error al actualizar la cuenta contable:', error);
            });
        });
    
        tablaDiv.appendChild(formularioActualizacion);
    }
    
}
