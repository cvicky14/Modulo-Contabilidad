function mostrarTabla(empresaID, nombreEmpresa) {
    const tablaDiv = document.getElementById('tabla-div');
    tablaDiv.innerHTML = '';

    // Crear un encabezado h2 con el nombre de la empresa
    const h2 = document.createElement('h2');
    h2.textContent = `Movimientos de la empresa: ${nombreEmpresa}`;
    h2.classList.add('datos-empresa');
    tablaDiv.appendChild(h2);

    // Crear un formulario para los filtros
    const filtroForm = document.createElement('form');
    filtroForm.classList.add('filtro-form');
    filtroForm.innerHTML = `
        <label for="filtro-select">Filtrar por: </label>
        <select id="filtro-select" class="filtro-select">
            <option value="todos">Todos</option>
            <option value="fecha">Fecha</option>
            <option value="estado">Estado</option>
        </select>
        <input type="date" id="fecha-input" class="fecha-input" style="display: none;">
        <div class="estado-checkboxes" style="display: none;">
            <label>
                <input type="radio" name="estado" value="Abierto" class="estado-checkbox"> Abierto
            </label>
            <label>
                <input type="radio" name="estado" value="Cerrado" class="estado-checkbox"> Cerrado
            </label>
        </div>
        <button type="submit" class="filtro-submit">Aplicar Filtro</button>
    `;
    tablaDiv.appendChild(filtroForm);

    // Botón "Insertar Datos"
    const insertarDatosBtn = document.createElement('button');
    insertarDatosBtn.textContent = 'Insertar Datos';
    insertarDatosBtn.classList.add('insertar-datos-btn');
    tablaDiv.appendChild(insertarDatosBtn);

    insertarDatosBtn.addEventListener('click', function() {
        const formularioInsercion = document.createElement('form');
        formularioInsercion.classList.add('formulario-insercion');
        formularioInsercion.innerHTML = `
            <input type="hidden" name="empresaID" value="${empresaID}">
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" name="fecha" required>
            <label for="tipo">Tipo:</label>
            <input type="text" id="tipo" name="tipo" required>
            <label for="descripcion">Descripción:</label>
            <input type="text" id="descripcion" name="descripcion" required>
            <label for="monto">Monto:</label>
            <input type="number" id="monto" name="monto" required>
            <label for="cuentaOrigen">Cuenta Origen:</label>
            <select id="cuentaOrigen" name="cuentaOrigen" required>
                <!-- Opciones se llenarán aquí -->
            </select>
            <label for="cuentaDestino">Cuenta Destino:</label>
            <input type="text" id="cuentaDestino" name="cuentaDestino" required>
            <label for="documentoReferencia">Documento de Referencia:</label>
            <input type="text" id="documentoReferencia" name="documentoReferencia" required>
            <label for="responsable">Responsable:</label>
            <input type="text" id="responsable" name="responsable" required>
            <label for="categoria">Categoría:</label>
            <input type="text" id="categoria" name="categoria" required>
            <label for="estadoCierre">Estado de Cierre:</label>
            <select id="estadoCierre" name="estadoCierre" required>
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
            </select>

            <button type="submit" class="guardar-datos-btn">Guardar Datos</button>
        `;
        tablaDiv.appendChild(formularioInsercion);
        
        fetch(`http://localhost:5000/api/empresas/cuentas-descripcion/${empresaID}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            const cuentaOrigenSelect = formularioInsercion.querySelector('#cuentaOrigen');
            cuentaOrigenSelect.innerHTML = '';
    
            // Llenar el menú desplegable con las opciones obtenidas
            data.forEach(option => {
                cuentaOrigenSelect.innerHTML += `<option value="${option.DescripcionCuenta}">${option.DescripcionCuenta}</option>`;
            });
        })
        .catch(error => {
            console.error('Error al obtener las opciones de Cuenta Origen:', error);
        });
        // Event listener para el envío del formulario de inserción
        formularioInsercion.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(formularioInsercion);
            const requestBody = {};
        
            formData.forEach((value, key) => {
                if (key === 'fecha') {
                    const fecha = new Date(value);
                    const fechaFormatted = `${fecha.getDate()+ 1}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`;
                    requestBody[key] = fechaFormatted;
                } else if (key === 'estadoCierre') {
                    requestBody[key] = value;
                } else {
                    // Resto de campos
                    requestBody[key] = value;
                }
            });
        
            // Realiza la solicitud POST a la ruta de inserción
            fetch('http://localhost:5000/api/empresas/movimientos-insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
            .then(response => response.json())
            .then(data => {
                // Maneja la respuesta, por ejemplo, muestra un mensaje de éxito o error
                if (data.message === 'Movimiento insertado exitosamente') {
                    // Eliminar el formulario de inserción después de guardar los datos
                    formularioInsercion.remove();
                    mostrarTabla(empresaID, nombreEmpresa);

                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
                // Muestra un mensaje de error
            });
        });
        
    });

    // Event listener para el cambio en el select de filtro
    const filtroSelect = document.getElementById('filtro-select');
    filtroSelect.addEventListener('change', function() {
        const fechaInput = document.getElementById('fecha-input');
        const estadoCheckboxes = document.querySelector('.estado-checkboxes');
        
        if (filtroSelect.value === 'fecha') {
            fechaInput.style.display = 'block';
            estadoCheckboxes.style.display = 'none';
        } else if (filtroSelect.value === 'estado') {
            fechaInput.style.display = 'none';
            estadoCheckboxes.style.display = 'block';
        } else {
            fechaInput.style.display = 'none';
            estadoCheckboxes.style.display = 'none';
        }
    });

    // Event listener para el envío del formulario
    filtroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedFilter = filtroSelect.value;
    
        const requestBody = {
            empresaID: empresaID,
            filtro: selectedFilter,
        };
    
        if (selectedFilter === 'fecha') {
            const fechaInput = document.getElementById('fecha-input');
            const fecha = new Date(fechaInput.value); // Parsea la fecha
            const fechaFormatted = `${fecha.getDate() + 1} ${fecha.getMonth() + 1} ${fecha.getFullYear()}`; // Formatea la fecha
    
            requestBody.fecha = fechaFormatted;
        } else if (selectedFilter === 'estado') {
            const estadoCheckboxes = document.querySelectorAll('.estado-checkbox:checked');
            if (estadoCheckboxes.length === 1) {
                requestBody.EstadoCierre = estadoCheckboxes[0].value; // Si solo hay un checkbox seleccionado, toma su valor como cadena
            } else {
                // Si hay múltiples checkboxes seleccionados, toma los valores en un arreglo
                const estadoValues = Array.from(estadoCheckboxes).map(checkbox => checkbox.value);
                requestBody.EstadoCierre = estadoValues;
            }
        }

        // Realizar la solicitud POST para obtener los datos
        fetch('http://localhost:5000/api/empresas', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            // Enviar el cuerpo de la solicitud con el filtro seleccionado
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            // Limpiar la tabla actual antes de agregar los nuevos datos
            const tabla = tablaDiv.querySelector('.tabla-movimientos');
            if (tabla) {
                tabla.remove();
            }
    
            // Manejar los datos de respuesta y construir la tabla
            if (data.Movimientos) {
                const nuevaTabla = document.createElement('table');
                nuevaTabla.classList.add('tabla-movimientos');
    
                // Crear encabezados de tabla
                const encabezados = document.createElement('thead');
                const encabezadoFila = document.createElement('tr');
                encabezadoFila.innerHTML = `
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Cuenta Origen</th>
                    <th>Cuenta Destino</th>
                    <th>Documento de Referencia</th>
                    <th>Responsable</th>
                    <th>Categoría</th>
                    <th>Estado de Cierre</th>
                `;
                encabezados.appendChild(encabezadoFila);
                nuevaTabla.appendChild(encabezados);
    
                // Crear filas de datos
                const cuerpoTabla = document.createElement('tbody');
                data.Movimientos.forEach(movimiento => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${movimiento.Fecha}</td>
                        <td>${movimiento.Tipo}</td>
                        <td>${movimiento.Descripcion}</td>
                        <td>${movimiento.Monto}</td>
                        <td>${movimiento.CuentaOrigen}</td>
                        <td>${movimiento.CuentaDestino}</td>
                        <td>${movimiento.DocumentoReferencia}</td>
                        <td>${movimiento.Responsable}</td>
                        <td>${movimiento.Categoria}</td>
                        <td>${movimiento.EstadoCierre}</td>
                        <td class="boton-td">
                            <button class="actualizar-btn" data-movimiento-id="${movimiento.ID_Movimiento}"><i class="fas fa-pen"></i></button>
                            <button class="delete-btn" data-movimiento-id="${movimiento.ID_Movimiento}"><i class="fas fa-trash-alt"></i></button>
                        </td>

                    `;
                    
                        // Agregar un manejador de eventos para el botón "Actualizar"
                        const actualizarBtn = fila.querySelector('.actualizar-btn');
                        actualizarBtn.addEventListener('click', () => {
                            // Mostrar el formulario de actualización y prellenar los campos con los datos del movimiento
                            mostrarFormularioActualizacion(movimiento);
                        });

                        // Agregar un manejador de eventos para el botón "Eliminar"
                        const deleteBtn = fila.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', () => {
                            // Aquí debes agregar la lógica para eliminar el movimiento
                            if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
                                eliminarMovimiento(movimiento.ID_Movimiento);
                            }
                        });
                    cuerpoTabla.appendChild(fila);
                });
                nuevaTabla.appendChild(cuerpoTabla);
    
                tablaDiv.appendChild(nuevaTabla);
            } else {
                tablaDiv.innerHTML = 'No se encontraron datos para la empresa seleccionada.';
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            tablaDiv.innerHTML = 'Error al cargar los datos.';
        });
    });
    // Función para eliminar un movimiento
    function eliminarMovimiento(movimientoID) {
        // Realizar una solicitud DELETE para eliminar el movimiento en el servidor
        fetch(`http://localhost:5000/api/empresas/movimientos-delete/${movimientoID}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta y actualizar la tabla de movimientos
            if (data.message === 'Movimiento eliminado exitosamente') {
                mostrarTabla(empresaID, nombreEmpresa);
            }
        })
        .catch(error => {
            console.error('Error al eliminar el movimiento:', error);
            // Mostrar un mensaje de error
        });
    }

    function mostrarFormularioActualizacion(movimiento) {
        const formularioActualizacion = document.createElement('form');
        formularioActualizacion.classList.add('formulario-actualizacion');

        const fechaOriginal = movimiento.Fecha;
        const partesFecha = fechaOriginal.split(' ');// Dividir la fecha en día, mes y año
        const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;//formato "yyyy-mm-dd"

        formularioActualizacion.innerHTML = `
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" name="fecha" value="${fechaFormateada}">
            <label for="tipo">Tipo:</label>
            <input type="text" id="tipo" name="tipo" value="${movimiento.Tipo}">
            <label for="descripcion">Descripción:</label>
            <input type="text" id="descripcion" name="descripcion" value="${movimiento.Descripcion}" >
            <label for="monto">Monto:</label>
            <input type="number" id="monto" name="monto" value="${movimiento.Monto}" >
            <label for="cuentaOrigen">Cuenta Origen:</label>
            <select id="cuentaOrigen" name="cuentaOrigen" required>
                <!-- Opciones se llenarán aquí -->
            </select>
            <label for="cuentaDestino">Cuenta Destino:</label>
            <input type="text" id="cuentaDestino" name="cuentaDestino" value="${movimiento.CuentaDestino}" >
            <label for="documentoReferencia">Documento de Referencia:</label>
            <input type="text" id="documentoReferencia" name="documentoReferencia" value="${movimiento.DocumentoReferencia}">
            <label for="responsable">Responsable:</label>
            <input type="text" id="responsable" name="responsable" value="${movimiento.Responsable}" >
            <label for="categoria">Categoría:</label>
            <input type="text" id="categoria" name="categoria" value="${movimiento.Categoria}" >
            <label for="estadoCierre">Estado de Cierre:</label>
            <select id="estadoCierre" name="estadoCierre" required>
                <option value="Abierto" ${movimiento.EstadoCierre === 'Abierto' ? 'selected' : ''}>Abierto</option>
                <option value="Cerrado" ${movimiento.EstadoCierre === 'Cerrado' ? 'selected' : ''}>Cerrado</option>
            </select>
            <button type="submit" class="guardar-actualizacion-btn">Guardar Cambios</button>
        `;
        
        // Realizar solicitud para obtener las opciones de "Cuenta Origen"
        fetch(`http://localhost:5000/api/empresas/cuentas-descripcion/${empresaID}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            const cuentaOrigenSelect = formularioActualizacion.querySelector('#cuentaOrigen');
            cuentaOrigenSelect.innerHTML = ''; // Limpiar opciones anteriores
            // Llenar el menú desplegable con las opciones obtenidas
            data.forEach(option => {
                cuentaOrigenSelect.innerHTML += `<option value="${option.DescripcionCuenta}">${option.DescripcionCuenta}</option>`;
            });
            // Establecer el valor seleccionado en el menú desplegable
            cuentaOrigenSelect.value = movimiento.CuentaOrigen;
        }).catch(error => {
            console.error('Error al obtener las opciones de Cuenta Origen:', error);
        });

        // Agregar un manejador de eventos para el botón "Guardar Cambios"
        formularioActualizacion.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(formularioActualizacion);
            const requestBody = {};
        
            formData.forEach((value, key) => {
                if (key === 'fecha') {
                    const fecha = new Date(value);
                    const fechaFormatted = `${fecha.getDate() + 1}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`;
                    requestBody[key] = fechaFormatted;
                } else if (key === 'estadoCierre') {
                    // Si el campo es "estadoCierre" (menú desplegable), ya está formateado correctamente
                    requestBody[key] = value;
                } else {
                    // Resto de campos
                    requestBody[key] = value;
                }
            });
            // Realizar una solicitud PUT para actualizar el movimiento en el servidor
            fetch(`http://localhost:5000/api/empresas/movimientos-update/${movimiento.ID_Movimiento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta y actualizar la tabla de movimientos
                if (data.message === 'Movimiento actualizado exitosamente') {
                    // Eliminar el formulario de actualización después de guardar los cambios
                    formularioActualizacion.remove();
                    // Actualizar la tabla de movimientos
                    mostrarTabla(empresaID, nombreEmpresa);
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud de actualización:', error);
                // Mostrar un mensaje de error
            });
        });
    
        tablaDiv.appendChild(formularioActualizacion);
    }
    // Inicialmente, cargar todos los movimientos al seleccionar la empresa
    filtroSelect.value = 'todos';
    filtroForm.dispatchEvent(new Event('submit'));
}