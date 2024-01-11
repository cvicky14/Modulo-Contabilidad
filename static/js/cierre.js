function mostrarTablaCierre(empresaID, nombreEmpresa) {
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
            const fecha = new Date(fechaInput.value);
            const fechaFormatted = `${fecha.getDate()+1}-${fecha.getMonth()+1}-${fecha.getFullYear()}`;
            requestBody.fecha = fechaFormatted;
        } else if (selectedFilter === 'estado') {
            const estadoCheckboxes = document.querySelectorAll('.estado-checkbox:checked');
            if (estadoCheckboxes.length === 1) {
                requestBody.EstadoCierre = estadoCheckboxes[0].value;
            } else {
                const estadoValues = Array.from(estadoCheckboxes).map(checkbox => checkbox.value);
                requestBody.EstadoCierre = estadoValues;
            }
        }

        // Realizar la solicitud POST para obtener los datos
        fetch(`http://localhost:5000/api/empresas`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
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
                    `;
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
    // Crear un botón para actualizar el estado de cierre
    const actualizarEstadoCierreBtn = document.createElement('button');
    actualizarEstadoCierreBtn.textContent = 'Realizar Cierre';
    actualizarEstadoCierreBtn.classList.add('realizar-cierre');
    tablaDiv.appendChild(actualizarEstadoCierreBtn);

    // Event listener para el botón "Actualizar Estado de Cierre"
    actualizarEstadoCierreBtn.addEventListener('click', function () {
        // Realizar la solicitud PUT para actualizar el estado de cierre
        fetch(`http://localhost:5000/api/empresas/actualizar-estado-cierre/${empresaID}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'EstadoCierre actualizado exitosamente a "Cerrado"') {
                    // Actualizar la tabla de movimientos después de actualizar el estado de cierre
                    mostrarTablaCierre(empresaID, nombreEmpresa);
                }
            })
            .catch(error => {
                console.error('Error al actualizar el estado de cierre:', error);
            });
    });

    // Inicialmente, cargar todos los movimientos al seleccionar la empresa
    filtroSelect.value = 'todos';
    filtroForm.dispatchEvent(new Event('submit'));
}