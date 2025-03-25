document.addEventListener('DOMContentLoaded', function() {
    // Cargar solo la tabla de gimcanas inicialmente ya que es la pestaña activa
    cargarGimcanas();
    
    // Agregar event listeners a las pestañas
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            // Remover active de todas las pestañas
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('show', 'active');
            });
            
            // Activar la pestaña seleccionada
            this.classList.add('active');
            const targetId = this.getAttribute('data-bs-target').replace('#', '');
            const targetPane = document.getElementById(targetId);
            targetPane.classList.add('show', 'active');
            
            // Cargar los datos según la pestaña seleccionada
            if (targetId === 'gimcanas') {
                cargarGimcanas();
            } else if (targetId === 'lugares') {
                cargarLugares();
            }
        });
    });
});

// Función para cargar gimcanas
function cargarGimcanas() {
    fetch('/admin/gimcanas/getGimcanas')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tabla-gimcanas');
            tableBody.innerHTML = data.map(gimcana => `
                <tr>
                    <td>${gimcana.nombre}</td>
                    <td>${gimcana.group?.codigogrupo ?? 'Sin código'}</td>
                    <td>${gimcana.creator?.name ?? 'Sin creador'}</td>
                    <td>${gimcana.completed ? 'Completada' : 'En progreso'}</td>
                    <td class="d-flex flex-row justify-content-center" style="gap: 5px;">
                        <button class="btn btn-info btn-sm" onclick="verCheckpoints(${gimcana.id})">Ver Checkpoints</button>
                        <button class="btn btn-warning btn-sm" onclick="editarGimcana(${gimcana.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarGimcana(${gimcana.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        });
}

// Función para ver los checkpoints de una gimcana
function verCheckpoints(gimcanaId) {
    fetch(`/admin/gimcanas/${gimcanaId}/checkpoints`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                Swal.fire('Info', 'Esta gimcana no tiene checkpoints asociados.', 'info');
                return;
            }

            const checkpointsList = data.map((checkpoint, index) => `
                <li class="list-group-item">
                    <strong>Checkpoint ${index + 1}:</strong> ${checkpoint.pista}
                    <br>
                    <small>Prueba: ${checkpoint.prueba}</small>
                    ${checkpoint.place ? `<br><small>Lugar: ${checkpoint.place.nombre}</small>` : ''}
                </li>
            `).join('');

            Swal.fire({
                title: 'Checkpoints de la Gimcana',
                html: `
                    <div style="text-align: left;">
                        <ol class="list-group">${checkpointsList}</ol>
                    </div>
                `,
                confirmButtonText: 'Cerrar',
                width: '600px'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron cargar los checkpoints', 'error');
        });
}

// Función para cargar lugares
function cargarLugares() {
    fetch('/admin/places/getPlaces?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los lugares');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('tabla-lugares');
            tableBody.innerHTML = data.map(place => `
                <tr>
                    <td>${place.nombre}</td>
                    <td>${place.direccion ?? 'Sin dirección'}</td>
                    <td>${place.coordenadas_lat ?? 'Sin coordenadas'}</td>
                    <td>${place.coordenadas_lon ?? 'Sin coordenadas'}</td>
                    <td>${place.categoria?.nombre ?? 'Sin categoría'}</td>
                    <td class="d-flex flex-row justify-content-center" style="gap:5px;">
                        <button class="btn btn-warning btn-sm" onclick="editarLugar(${place.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarLugar(${place.id})">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al cargar los lugares', 'error');
        });
}

// Función para editar una gimcana
function editarGimcana(id) {
    fetch(`/admin/gimcanas/editar/${id}`)
        .then(response => response.json())
        .then(data => {
            // Llenar el formulario con los datos de la gimcana
            document.getElementById('editarGimcanaId').value = data.id;
            document.getElementById('editarNombre').value = data.nombre;
            document.getElementById('editarGroupId').value = data.group_id;

            // Llenar los checkpoints (si es un select múltiple)
            const checkpointsSelect = document.getElementById('editarCheckpoints');
            if (checkpointsSelect) {
                checkpointsSelect.innerHTML = ''; // Limpiar opciones anteriores
                data.checkpoints.forEach(checkpoint => {
                    const option = document.createElement('option');
                    option.value = checkpoint.id;
                    option.textContent = checkpoint.pista;
                    checkpointsSelect.appendChild(option);
                });
            }

            // Mostrar el modal
            new bootstrap.Modal(document.getElementById('editarGimcanaModal')).show();
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudieron cargar los datos de la gimcana', 'error');
        });
}

// Función para eliminar una gimcana
function eliminarGimcana(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta gimcana?')) {
        fetch(`/admin/gimcanas/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Gimcana eliminada con éxito');
                cargarGimcanas(); // Recargar la tabla de gimcanas
            } else {
                alert('Error al eliminar la gimcana');
            }
        });
    }
}

// Función para editar lugar
function editarLugar(id) {
    fetch(`/admin/places/${id}/edit`)
        .then(response => response.json())
        .then(data => {
            // Llenar el formulario con los datos del lugar
            document.getElementById('editarLugarId').value = data.id;
            document.getElementById('editarNombreLugar').value = data.nombre;
            document.getElementById('editarDescripcionLugar').value = data.descripcion;
            document.getElementById('editarDireccionLugar').value = data.direccion;
            document.getElementById('editarLatitudLugar').value = data.coordenadas_lat;
            document.getElementById('editarLongitudLugar').value = data.coordenadas_lon;

            // Cargar categorías antes de seleccionar la correcta
            cargarCategorias().then(() => {
                document.getElementById('editarCategoriaLugar').value = data.categoria_id;
            });

            // Mostrar el modal de edición de lugares
            new bootstrap.Modal(document.getElementById('editarLugarModal')).show();
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudieron cargar los datos del lugar', 'error');
        });
}

// Función para guardar los cambios
function guardarCambiosLugar() {
    const form = document.getElementById('formEditarLugar');
    const formData = new FormData(form);
    
    // Verificar que todos los campos requeridos estén presentes
    const requiredFields = {
        'nombre': formData.get('nombre'),
        'descripcion': formData.get('descripcion'),
        'direccion': formData.get('direccion'),
        'coordenadas_lat': formData.get('coordenadas_lat'),
        'coordenadas_lon': formData.get('coordenadas_lon'),
        'categoria_id': formData.get('categoria_id')
    };

    // Validar campos
    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
            Swal.fire('Error', `El campo ${field} es requerido`, 'error');
            return;
        }
    }

    // Agregar el método PUT para Laravel
    formData.append('_method', 'PUT');

    fetch(`/admin/places/${formData.get('id')}`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}',
            'Accept': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', data.success, 'success');                        
            new bootstrap.Modal(document.getElementById('editarLugarModal')).hide();                        
            cargarLugares();
        } else {
            // Mostrar errores de validación del servidor
            if (data.errors) {
                let errorMessages = '';
                for (const [key, value] of Object.entries(data.errors)) {
                    errorMessages += `${value.join(', ')}\n`;
                }
                Swal.fire('Error', errorMessages, 'error');
            } else {
                Swal.fire('Error', data.message || 'Error al actualizar el lugar', 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al actualizar el lugar', 'error');
    });
}

// Función para eliminar lugar
function eliminarLugar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/places/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado!', data.success, 'success').then(() => {
                        cargarLugares();
                    });
                } else {
                    Swal.fire('Error', data.error, 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error al eliminar el lugar', 'error');
            });
        }
    });
}

// Función para abrir modal de creación
function abrirModalCrear() {
    // Limpiar el formulario
    document.getElementById('formCrearLugar').reset();
    new bootstrap.Modal(document.getElementById('crearLugarModal')).show();
}

// Función para crear un nuevo lugar
function crearLugar() {
    const formData = new FormData(document.getElementById('formCrearLugar'));
    console.log([...formData.entries()]); // Verificar los datos enviados

    fetch('/admin/places', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}',
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', data.success, 'success').then(() => {
                cargarLugares();
                new bootstrap.Modal(document.getElementById('crearLugarModal')).hide();
            });
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Error al crear el lugar', 'error');
    });
}

// Función para cargar categorías en los selects
function cargarCategorias() {
    return fetch('/admin/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar categorías');
            }
            return response.json();
        })
        .then(data => {
            const selectCrear = document.getElementById('crearCategoria');
            const selectEditar = document.getElementById('editarCategoriaLugar');
            
            // Limpiar selects
            selectCrear.innerHTML = '<option value="">Seleccione una categoría</option>';
            selectEditar.innerHTML = '<option value="">Seleccione una categoría</option>';
            
            // Agregar opciones
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.name;
                
                // Clonar la opción para ambos selects
                selectCrear.appendChild(option.cloneNode(true));
                selectEditar.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => {
            console.error('Error al cargar categorías:', error);
            Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
        });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCategorias();
});
document.getElementById("CrearPlaceBtn").onclick = abrirModalCrear;
// document.getElementById("btn").onclick = saludar;
// document.getElementById("btn").onclick = saludar;
// document.getElementById("btn").onclick = saludar;
