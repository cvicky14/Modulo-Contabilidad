function realizarSolicitudCierreAnual(menuID) {
    const empresasList = document.getElementById('empresas-list');
    const tablaDiv = document.getElementById('tabla-div'); // Agregar referencia a la tabla
    empresasList.innerHTML = '';
    tablaDiv.innerHTML = '';
    
    const seleccionaEmpresaDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = 'Selecciona una empresa:';
    h2.classList.add('titulo-h2');
    seleccionaEmpresaDiv.appendChild(h2);

    fetch('http://localhost:5000/api/empresas', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        // Manejar los datos de respuesta y mostrar las empresas
        if (data.empresas) {
            data.empresas.forEach(empresa => {
                const listItem = document.createElement('div');
                listItem.textContent = `${empresa.NombreEmpresa}`;
                listItem.classList.add('empresa-item');

                // Agregar un evento de clic para mostrar el formulario
                listItem.addEventListener('click', () => {
                    // Llama a la función mostrarTabla con o sin filtros según el menú seleccionado
                    if (menuID === 'menu-11') {
                        mostrarTabla(empresa.EmpresaID, empresa.NombreEmpresa);
                    } else if (menuID === 'menu-15') {
                        mostrarTablaCierre(empresa.EmpresaID, empresa.NombreEmpresa);
                    } else if (menuID === 'menu-17') {
                        mostrarTablaCuentas(empresa.EmpresaID, empresa.NombreEmpresa);
                    }
                });

                empresasList.appendChild(listItem);
            });
        } else {
            empresasList.innerHTML = 'No se encontraron empresas.';
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        empresasList.innerHTML = 'Error al cargar las empresas.';
    });

    // Agregar el div con el h2 antes de mostrar las empresas
    empresasList.appendChild(seleccionaEmpresaDiv);
}

// Agrega un evento click al documento y verifica si se hizo clic en el menú-11 o menú-15
document.addEventListener('click', function(event) {
    if (event.target.id === 'menu-11') {
        realizarSolicitudCierreAnual('menu-11');
    } else if (event.target.id === 'menu-15') {
        realizarSolicitudCierreAnual('menu-15');
    } else if (event.target.id === 'menu-17') {
        realizarSolicitudCierreAnual('menu-17');
    }
});
