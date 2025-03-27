/**
 * Funcionalidades específicas para el CRUD de checkpoints
 */

// Variables globales
let checkpointMap = null;
let selectedPlace = null;

// Función para inicializar el mapa de checkpoints
function inicializarMapaCheckpoints() {
    // Si ya existe un mapa, destruirlo para evitar conflictos
    if (checkpointMap) {
        checkpointMap.remove();
    }
    
    // Crear el nuevo mapa
    checkpointMap = L.map('checkpoint-map').setView([41.3851, 2.1734], 13); // Barcelona por defecto
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(checkpointMap);
    
    // Añadir control de escala
    L.control.scale().addTo(checkpointMap);
    
    // COMENTADO: Búsqueda eliminada por solicitud del usuario
    // const geocoder = L.Control.geocoder({
    //     defaultMarkGeocode: false
    // }).on('markgeocode', function(e) {
    //     const bbox = e.geocode.bbox;
    //     const poly = L.polygon([
    //         bbox.getSouthEast(),
    //         bbox.getNorthEast(),
    //         bbox.getNorthWest(),
    //         bbox.getSouthWest()
    //     ]).addTo(checkpointMap);
    //     checkpointMap.fitBounds(poly.getBounds());
    // }).addTo(checkpointMap);
    
    // Cargar los lugares y mostrarlos en el mapa
    cargarLugaresParaCheckpoints(checkpointMap);
    
    // Asegurarse de que el mapa se renderice correctamente
    setTimeout(() => {
        checkpointMap.invalidateSize();
    }, 100);
    
    return checkpointMap;
}

// Función para cargar lugares en el mapa de checkpoints
function cargarLugaresParaCheckpoints(map) {
    fetch('/admin/places/getPlaces')
        .then(response => response.json())
        .then(data => {
            data.forEach(place => {
                if (place.coordenadas_lat && place.coordenadas_lon) {
                    const marker = L.marker([place.coordenadas_lat, place.coordenadas_lon])
                        .addTo(map)
                        .bindPopup(`
                            <div>
                                <h5>${place.nombre}</h5>
                                <p>${place.descripcion ?? ''}</p>
                                <p>${place.direccion ?? ''}</p>
                                <button class="btn btn-sm btn-primary seleccionar-lugar" 
                                    data-place-id="${place.id}" 
                                    data-place-nombre="${place.nombre}">
                                    Seleccionar para checkpoint
                                </button>
                            </div>
                        `);
                        
                    // Añadir evento al popup para manejar el clic en el botón seleccionar
                    marker.on('popupopen', function() {
                        document.querySelectorAll('.seleccionar-lugar').forEach(btn => {
                            btn.addEventListener('click', function() {
                                const placeId = this.getAttribute('data-place-id');
                                const nombreLugar = this.getAttribute('data-place-nombre');
                                seleccionarLugarParaCheckpoint(placeId, nombreLugar);
                                marker.closePopup();
                            });
                        });
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar lugares para checkpoints:', error);
            Swal.fire('Error', 'No se pudieron cargar los lugares para el mapa', 'error');
        });
}

// Función para seleccionar un lugar para el checkpoint
function seleccionarLugarParaCheckpoint(placeId, nombreLugar) {
    // Guardar el lugar seleccionado
    selectedPlace = {
        id: placeId,
        nombre: nombreLugar
    };
    
    // Actualizar el formulario
    document.getElementById('checkpoint_lugar').value = nombreLugar;
    document.getElementById('checkpoint_place_id').value = placeId;
    
    // Mostrar mensaje de confirmación
    Swal.fire({
        title: 'Lugar seleccionado',
        text: `Has seleccionado "${nombreLugar}" para el nuevo checkpoint`,
        icon: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000
    });
}

// Función para cargar las gimcanas en el selector de checkpoints
function cargarGimcanasParaSelect() {
    fetch('/admin/gimcanas/getGimcanas')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('checkpoint_gimcana');
            if (select) {
                // Limpiar opciones anteriores, manteniendo la primera
                const firstOption = select.querySelector('option');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }
                
                // Añadir nuevas opciones
                data.forEach(gimcana => {
                    const option = document.createElement('option');
                    option.value = gimcana.id;
                    option.textContent = gimcana.nombre;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar gimcanas para select:', error);
        });
}

// Función para crear un nuevo checkpoint
function crearCheckpoint(e) {
    if (e) e.preventDefault();
    
    // Verificar que se ha seleccionado un lugar
    if (!selectedPlace) {
        Swal.fire('Error', 'Debes seleccionar un lugar en el mapa', 'error');
        return;
    }
    
    // Validar campos obligatorios
    const pista = document.getElementById('checkpoint_pista');
    const prueba = document.getElementById('checkpoint_prueba');
    const respuesta = document.getElementById('checkpoint_respuesta');
    
    if (!pista.value.trim()) {
        pista.classList.add('is-invalid');
        Swal.fire('Error', 'El campo Pista es obligatorio', 'error');
        return;
    }
    
    if (!prueba.value.trim()) {
        prueba.classList.add('is-invalid');
        Swal.fire('Error', 'El campo Prueba es obligatorio', 'error');
        return;
    }
    
    if (!respuesta.value.trim()) {
        respuesta.classList.add('is-invalid');
        Swal.fire('Error', 'El campo Respuesta es obligatorio', 'error');
        return;
    }
    
    // Obtener el formulario y comprobar que existe
    const formulario = document.getElementById('formCrearCheckpoint');
    if (!formulario) {
        console.error('No se encontró el formulario con ID: formCrearCheckpoint');
        Swal.fire('Error', 'No se pudo encontrar el formulario', 'error');
        return;
    }
    
    // Crear FormData con el formulario
    const formData = new FormData(formulario);
    
    // Asegurar que el place_id esté incluido
    if (!formData.has('place_id') || !formData.get('place_id')) {
        formData.set('place_id', selectedPlace.id);
    }
    
    // Agregar el token CSRF
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
        formData.append('_token', token.getAttribute('content'));
    } else {
        console.error('No se encontró el token CSRF');
        Swal.fire('Error', 'Error de seguridad: No se encontró el token CSRF', 'error');
        return;
    }
    
    // Enviar la solicitud
    fetch('/admin/checkpoints', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        Swal.fire('Éxito', 'Checkpoint creado correctamente', 'success');
        
        // Cerrar el modal
        if (bootstrap && document.getElementById('crearCheckpointModal')) {
            bootstrap.Modal.getInstance(document.getElementById('crearCheckpointModal')).hide();
        }
        
        // Limpiar el formulario
        const form = document.getElementById('formCrearCheckpoint');
        if (form) form.reset();
        
        // Recargar la lista de checkpoints recientes
        setTimeout(() => {
            cargarCheckpointsRecientes();
        }, 500);
    })
    .catch(error => {
        console.error('Error al crear checkpoint:', error);
        Swal.fire('Error', 'No se pudo crear el checkpoint: ' + error.message, 'error');
    });
}

// Función para cargar los checkpoints recientes
function cargarCheckpointsRecientes() {
    fetch('/admin/gimcanas/checkpoints/recientes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const container = document.querySelector('.checkpoint-list');
            if (container) {
                if (data.length === 0) {
                    container.innerHTML = '<p class="text-muted">No hay checkpoints recientes</p>';
                    return;
                }
                
                container.innerHTML = data.map(checkpoint => `
                    <div class="checkpoint-item mb-2 p-2 border rounded">
                        <strong>${checkpoint.place?.nombre ?? 'Lugar desconocido'}</strong>
                        <p class="mb-1"><small>Pista: ${checkpoint.pista}</small></p>
                        <p class="mb-1"><small>Prueba: ${checkpoint.prueba}</small></p>
                        <p class="mb-0"><small>Respuesta: ${checkpoint.respuesta}</small></p>
                        ${checkpoint.gimcana ? `<p class="mb-0 badge bg-info">Gimcana: ${checkpoint.gimcana.nombre}</p>` : ''}
                    </div>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error al cargar checkpoints recientes:', error);
            const container = document.querySelector('.checkpoint-list');
            if (container) {
                container.innerHTML = '<p class="text-danger">Error al cargar checkpoints recientes</p>';
            }
        });
}

// Función para validar un campo
function validarCampo(campo) {
    if (!campo.value.trim()) {
        campo.classList.add('is-invalid');
        return false;
    } else {
        campo.classList.remove('is-invalid');
        return true;
    }
}

// Función para inicializar validaciones onblur
function inicializarValidaciones() {
    // Campos de creación de checkpoints
    const crearCampos = [
        'checkpoint_pista',  // Campo de pista
        'checkpoint_prueba', // Campo de prueba
        'checkpoint_respuesta' // Nuevo campo de respuesta
    ];

    crearCampos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', () => validarCampo(campo));
        }
    });
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Activar mapa de checkpoints cuando se selecciona esa pestaña
    const checkpointsTab = document.getElementById('checkpoints-tab');
    if (checkpointsTab) {
        checkpointsTab.addEventListener('click', function() {
            setTimeout(() => {
                inicializarMapaCheckpoints();
                cargarGimcanasParaSelect();
                cargarCheckpointsRecientes();
            }, 100);
        });
    }
    
    // Botón para crear checkpoint
    const btnCrearCheckpoint = document.getElementById('btnCrearCheckpoint');
    if (btnCrearCheckpoint) {
        btnCrearCheckpoint.addEventListener('click', crearCheckpoint);
    }

    // Inicializar validaciones
    inicializarValidaciones();
});
