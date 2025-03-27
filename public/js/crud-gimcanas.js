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
    // Limpiar el modal antes de cargar nuevos datos
    const container = document.querySelector('#editarGimcanaModal .checkpoints-container');
    if (container) {
        container.innerHTML = '';
    }

    // Obtener los datos de la gimcana
    fetch(`/admin/gimcanas/editar/${id}`)
        .then(response => response.json())
        .then(data => {
            // Llenar los campos básicos
            document.getElementById('editarIdGimcana').value = data.id;
            document.getElementById('editarNombre').value = data.nombre;

            // Cargar checkpoints disponibles
            return cargarCheckpointsDisponibles().then(() => {
                // Añadir checkpoints existentes
                if (data.checkpoints && data.checkpoints.length > 0) {
                    data.checkpoints.forEach((checkpoint, index) => {
                        addCheckpointField(checkpoint.id, index + 1);
                    });
                } else {
                    addCheckpointField('', 1);
                }

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById('editarGimcanaModal'));
                modal.show();
            });
        })
        .then(() => {
            // Configurar el botón de añadir checkpoint
            const btnAddCheckpoint = document.getElementById('btnAddCheckpoint');
            if (btnAddCheckpoint) {
                // Eliminar cualquier listener previo para evitar duplicados
                btnAddCheckpoint.removeEventListener('click', handleAddCheckpoint);
                // Añadir el nuevo listener
                btnAddCheckpoint.addEventListener('click', handleAddCheckpoint);
            }
        })
        .catch(error => {
            console.error('Error al editar gimcana:', error);
            Swal.fire('Error', error.message || 'No se pudieron cargar los datos de la gimcana', 'error');
        });
}

// Función para manejar el evento de añadir checkpoint
function handleAddCheckpoint() {
    const count = document.querySelectorAll('.checkpoint-item').length;
    addCheckpointField('', count + 1);
}

function addCheckpointField(selectedValue = '', index = 1) {
    // Buscar el contenedor en ambos modales
    let container = document.querySelector('#editarGimcanaModal .checkpoints-container') || 
                    document.querySelector('#crearGimcanaModal .checkpoints-container');
    
    if (!container) {
        console.error('Contenedor de checkpoints no encontrado');
        return;
    }

    const template = `
        <div class="mb-3 checkpoint-item">
            <label class="form-label">Checkpoint ${index}</label>
            <div class="d-flex gap-2">
                <select class="form-select checkpoint-select" name="checkpoints[]" required>
                    <option value="">Seleccione un checkpoint</option>
                </select>
                <button type="button" class="btn btn-danger btn-remove-checkpoint">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', template);

    const select = container.lastElementChild.querySelector('select');
    if (!select) {
        console.error('Select no encontrado en el nuevo campo de checkpoint');
        return;
    }

    // Llenar el select con los checkpoints disponibles
    if (window.checkpointsData && window.checkpointsData.length > 0) {
        // Limpiar opciones existentes
        select.innerHTML = '<option value="">Seleccione un checkpoint</option>';
        
        // Añadir nuevas opciones
        window.checkpointsData.forEach(checkpoint => {
            const option = document.createElement('option');
            option.value = checkpoint.id;
            option.textContent = `${checkpoint.pista} (${checkpoint.place?.nombre || 'Sin lugar'})`;
            select.appendChild(option);
        });

        if (selectedValue) {
            select.value = selectedValue;
        }
    } else {
        console.error('No hay checkpoints disponibles para mostrar');
    }

    // Configurar el botón de eliminar
    const removeButton = container.lastElementChild.querySelector('.btn-remove-checkpoint');
    if (removeButton) {
        removeButton.onclick = () => {
            container.removeChild(container.lastElementChild);
            updateCheckpointLabels();
        };
    }

    updateCheckpointLabels();
}

function updateCheckpointLabels() {
    document.querySelectorAll('.checkpoint-item').forEach((item, index) => {
        item.querySelector('label').textContent = `Checkpoint ${index + 1}`;
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
    
    // Obtener todos los checkpoints seleccionados
    const checkpoints = Array.from(document.querySelectorAll('.checkpoint-select'))
        .map(select => select.value)
        .filter(value => value); // Filtrar valores vacíos

    // Validar campos obligatorios
    if (!nombre || checkpoints.length === 0) {
        Swal.fire('Error', 'El nombre y al menos un checkpoint son obligatorios', 'error');
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
    
    // Crear objeto con los datos a enviar
    const data = {
        nombre: nombre,
        checkpoints: checkpoints
    };
    
    // Obtener el token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
        Swal.fire('Error', 'No se pudo encontrar el token CSRF', 'error');
        return;
    }
    
    // Enviar los datos al servidor
    fetch(`/admin/gimcanas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken.getAttribute('content'),
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
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

// Función para cargar checkpoints disponibles
function cargarCheckpointsDisponibles() {
    return fetch('/admin/checkpoints')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar checkpoints: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Guardar los datos de checkpoints en una variable global
            window.checkpointsData = data;
            console.log('Checkpoints cargados correctamente:', data);

            // Llenar todos los selects existentes
            document.querySelectorAll('.checkpoint-select').forEach(select => {
                // Limpiar opciones excepto la primera
                select.innerHTML = '<option value="">Seleccione un checkpoint</option>';
                
                // Añadir nuevas opciones
                data.forEach(checkpoint => {
                    const option = document.createElement('option');
                    option.value = checkpoint.id;
                    option.textContent = `${checkpoint.pista} (${checkpoint.place?.nombre || 'Sin lugar'})`;
                    select.appendChild(option);
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar checkpoints:', error);
            Swal.fire('Error', 'No se pudieron cargar los checkpoints disponibles', 'error');
        });
}

// Función para abrir el modal de creación de gimcana
function abrirModalCrearGimcana() {
    // Limpiar el formulario
    document.getElementById('formCrearGimcana').reset();
    
    // Verificar y limpiar el contenedor de checkpoints
    const container = document.querySelector('#crearGimcanaModal .checkpoints-container');
    if (!container) {
        console.error('Contenedor de checkpoints no encontrado en el modal de creación');
        return;
    }
    container.innerHTML = '';

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('crearGimcanaModal'));
    modal.show();

    // Cargar checkpoints disponibles
    cargarCheckpointsDisponibles().then(() => {
        // Añadir el dropdown de checkpoints
        const template = `
            <div class="mb-3">
                <label class="form-label">Checkpoint</label>
                <select class="form-select checkpoint-select" name="checkpoint" required>
                    <option value="">Seleccione un checkpoint</option>
                </select>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', template);

        // Llenar el dropdown con los checkpoints disponibles
        const select = container.querySelector('.checkpoint-select');
        if (select && window.checkpointsData && window.checkpointsData.length > 0) {
            window.checkpointsData.forEach(checkpoint => {
                const option = document.createElement('option');
                option.value = checkpoint.id;
                option.textContent = `${checkpoint.pista} (${checkpoint.place?.nombre || 'Sin lugar'})`;
                select.appendChild(option);
            });
        }
    }).catch(error => {
        console.error('Error al cargar checkpoints:', error);
        Swal.fire('Error', 'No se pudieron cargar los checkpoints disponibles', 'error');
    });
}

// Función para crear una gimcana
function crearGimcana() {
    const nombre = document.getElementById('crearNombre').value;
    
    // Obtener el checkpoint seleccionado
    const checkpoint = document.querySelector('#crearGimcanaModal .checkpoint-select').value;

    // Validar campos obligatorios
    if (!nombre || !checkpoint) {
        Swal.fire('Error', 'El nombre y un checkpoint son obligatorios', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    Swal.fire({
        title: 'Creando...',
        text: 'Guardando cambios',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Crear objeto con los datos a enviar
    const data = {
        nombre: nombre,
        checkpoints: [checkpoint] // Enviar como array con un solo elemento
    };
    
    // Obtener el token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (!csrfToken) {
        Swal.fire('Error', 'No se pudo encontrar el token CSRF', 'error');
        return;
    }
    
    // Enviar los datos al servidor
    fetch('/admin/gimcanas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken.getAttribute('content'),
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error al crear la gimcana');
            }).catch(() => {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            });
        }
        return response.json();
    })
    .then(data => {
        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Creado',
            text: 'La gimcana ha sido creada con éxito',
            icon: 'success',
            timer: 1500
        });
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('crearGimcanaModal'));
        if (modal) {
            modal.hide();
        }
        
        // Recargar la tabla de gimcanas
        cargarGimcanas();
    })
    .catch(error => {
        console.error('Error al crear gimcana:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo crear la gimcana',
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
    
    // Botón para crear gimcana
    const btnCrearGimcana = document.getElementById('btnCrearGimcana');
    if (btnCrearGimcana) {
        btnCrearGimcana.addEventListener('click', crearGimcana);
    }
    
    // Cargar gimcanas inicialmente
    cargarGimcanas();
});

