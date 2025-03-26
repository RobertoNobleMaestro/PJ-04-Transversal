/**
 * Funcionalidades específicas para el CRUD de gimcanas
 */

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
        })
        .catch(error => {
            console.error('Error al cargar gimcanas:', error);
            Swal.fire('Error', 'Error al cargar las gimcanas', 'error');
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
            console.error('Error al cargar checkpoints:', error);
            Swal.fire('Error', 'No se pudieron cargar los checkpoints', 'error');
        });
}

// Función para editar una gimcana
function editarGimcana(id) {
    // Primero cargar grupos y checkpoints disponibles
    Promise.all([
        cargarGrupos(),
        cargarCheckpointsDisponibles()
    ])
    .then(() => {
        // Luego obtener los datos de la gimcana
        return fetch(`/admin/gimcanas/editar/${id}`);
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Llenar el formulario con los datos de la gimcana
        const idField = document.getElementById('editarIdGimcana');
        const nombreField = document.getElementById('editarNombre');
        const groupIdField = document.getElementById('editarGroupId');
        const checkpointsSelect = document.getElementById('editarCheckpoints');
        
        if (idField) idField.value = data.id;
        if (nombreField) nombreField.value = data.nombre;
        if (groupIdField) groupIdField.value = data.group_id || '';

        // Seleccionar los checkpoints asociados a la gimcana
        if (checkpointsSelect && data.checkpoints && data.checkpoints.length > 0) {
            const checkpointIds = data.checkpoints.map(cp => cp.id.toString());
            
            // Recorrer todas las opciones para seleccionar las que corresponden
            Array.from(checkpointsSelect.options).forEach(option => {
                option.selected = checkpointIds.includes(option.value);
            });
        }

        // Mostrar el modal
        const modal = document.getElementById('editarGimcanaModal');
        if (modal) {
            new bootstrap.Modal(modal).show();
        } else {
            console.error('Modal de edición de gimcana no encontrado');
        }
    })
    .catch(error => {
        console.error('Error al editar gimcana:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos de la gimcana: ' + error.message, 'error');
    });
}

// Función para eliminar una gimcana
function eliminarGimcana(id) {
    // Confirmar antes de eliminar
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Eliminando gimcana...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Crear FormData para enviar con el token CSRF
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            
            // Obtener el token CSRF
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (!csrfToken) {
                Swal.fire('Error', 'No se pudo encontrar el token CSRF', 'error');
                return;
            }
            
            // Realizar la petición para eliminar
            fetch(`/admin/gimcanas/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken.getAttribute('content'),
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al eliminar la gimcana');
                    }).catch(() => {
                        // Si no podemos obtener un JSON válido
                        if (response.status === 500) {
                            throw new Error('La gimcana no se puede eliminar porque tiene checkpoints asociados. Debes eliminar los checkpoints primero.');
                        } else if (response.status === 404) {
                            throw new Error('La gimcana no existe o ya ha sido eliminada.');
                        } else {
                            throw new Error('Error en la respuesta del servidor: ' + response.status);
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    title: 'Eliminado',
                    text: 'La gimcana ha sido eliminada con éxito',
                    icon: 'success',
                    timer: 1500
                });
                cargarGimcanas(); // Recargar la tabla de gimcanas
            })
            .catch(error => {
                console.error('Error al eliminar gimcana:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo eliminar la gimcana',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            });
        }
    });
}

// Función para actualizar una gimcana
function actualizarGimcana() {
    const id = document.getElementById('editarIdGimcana').value;
    const nombre = document.getElementById('editarNombre').value;
    const groupId = document.getElementById('editarGroupId').value;
    
    // Obtener checkpoints seleccionados (como es multiple select)
    const checkpointsSelect = document.getElementById('editarCheckpoints');
    const checkpoints = Array.from(checkpointsSelect.selectedOptions).map(option => option.value);
    
    // Validar campos obligatorios
    if (!nombre) {
        Swal.fire('Error', 'El nombre es obligatorio', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    Swal.fire({
        title: 'Actualizando...',
        text: 'Guardando cambios',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Crear FormData para enviar con el token CSRF
    const formData = new FormData();
    formData.append('nombre', nombre);
    if (groupId) formData.append('group_id', groupId);
    
    // Agregar checkpoints seleccionados
    checkpoints.forEach(checkpoint => {
        formData.append('checkpoints[]', checkpoint);
    });
    
    // Obtener el token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
        Swal.fire('Error', 'No se pudo encontrar el token CSRF', 'error');
        return;
    }
    
    // Enviar los datos al servidor
    fetch(`/admin/gimcanas/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': csrfToken.getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error al actualizar la gimcana');
            }).catch(() => {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            });
        }
        return response.json();
    })
    .then(data => {
        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Actualizado',
            text: 'La gimcana ha sido actualizada con éxito',
            icon: 'success',
            timer: 1500
        });
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarGimcanaModal'));
        if (modal) {
            modal.hide();
        }
        
        // Recargar la tabla de gimcanas
        cargarGimcanas();
    })
    .catch(error => {
        console.error('Error al actualizar gimcana:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo actualizar la gimcana',
            icon: 'error'
        });
    });
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Botón para actualizar gimcana en el modal de edición
    const actualizarGimcanaBtn = document.getElementById('actualizarGimcanaBtn');
    if (actualizarGimcanaBtn) {
        actualizarGimcanaBtn.addEventListener('click', actualizarGimcana);
    }
    
    // Cargar gimcanas inicialmente
    cargarGimcanas();
});
