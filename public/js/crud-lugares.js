/**
 * Funcionalidades específicas para el CRUD de lugares
 */

// Función para cargar lugares
function cargarLugares() {
    const nombre = document.getElementById('filtroNombre-lugares').value;
    const categoria = document.getElementById('filtroCategoria-lugares').value;
    
    const params = new URLSearchParams();
    if (nombre) params.append('nombre', nombre);
    if (categoria) params.append('categoria_id', categoria);
    
    fetch(`/admin/places/getPlaces?${params.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('tabla-lugares');
            if (!tableBody) {
                console.error('El elemento tabla-lugares no existe en el DOM');
                return;
            }
            
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
            console.error('Error al cargar lugares:', error);
            Swal.fire('Error', 'Error al cargar los lugares: ' + error.message, 'error');
        });
}

// Función para editar lugar
function editarLugar(id) {
    fetch(`/admin/places/${id}/edit`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Verificar si los datos recibidos son válidos
            if (!data || !data.id) {
                throw new Error('Datos del lugar no válidos');
            }

            // Llenar el formulario con los datos del lugar
            document.getElementById('editarLugarId').value = data.id;
            document.getElementById('editarNombreLugar').value = data.nombre;
            document.getElementById('editarDescripcionLugar').value = data.descripcion;
            document.getElementById('editarDireccionLugar').value = data.direccion;
            document.getElementById('editarLatitudLugar').value = data.coordenadas_lat;
            document.getElementById('editarLongitudLugar').value = data.coordenadas_lon;

            // Cargar categorías antes de seleccionar la correcta
            return cargarCategorias().then(() => {
                document.getElementById('editarCategoriaLugar').value = data.categoria_id;

                // Mostrar el modal de edición de lugares
                const modal = new bootstrap.Modal(document.getElementById('editarLugarModal'));
                modal.show();

                // Inicializar el mapa para editar la ubicación
                inicializarMapaEditarLugar(data.coordenadas_lat, data.coordenadas_lon);
            });
        })
        .catch(error => {
            console.error('Error al editar lugar:', error);
            Swal.fire('Error', `No se pudieron cargar los datos del lugar: ${error.message}`, 'error');
        });
}

// Función para inicializar el mapa en el modal de edición
function inicializarMapaEditarLugar(latitud, longitud) {
    // Verificar si el contenedor del mapa existe
    const mapContainer = document.getElementById('editar-lugar-map');
    if (!mapContainer) {
        console.error('El contenedor del mapa no existe en el DOM');
        return;
    }

    // Si ya existe un mapa, eliminarlo
    if (mapContainer._map) {
        mapContainer._map.remove();
    }

    // Inicializar el mapa
    const map = L.map('editar-lugar-map').setView([latitud, longitud], 13);

    // Guardar una referencia al mapa en el contenedor
    mapContainer._map = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([latitud, longitud], { draggable: true }).addTo(map);

    // Actualizar las coordenadas cuando se mueve el marcador
    marker.on('dragend', function (e) {
        const { lat, lng } = marker.getLatLng();
        document.getElementById('editarLatitudLugar').value = lat;
        document.getElementById('editarLongitudLugar').value = lng;
    });

    // Configurar el geocoder para buscar ubicaciones
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).addTo(map);

    geocoder.on('markgeocode', function (e) {
        const { center } = e.geocode;
        marker.setLatLng(center);
        map.setView(center, 13);
        document.getElementById('editarLatitudLugar').value = center.lat;
        document.getElementById('editarLongitudLugar').value = center.lng;
    });
}

// Función para guardar cambios de un lugar
function guardarCambiosLugar() {
    const id = document.getElementById('editarLugarId').value;
    const nombre = document.getElementById('editarNombreLugar').value;
    const descripcion = document.getElementById('editarDescripcionLugar').value;
    const direccion = document.getElementById('editarDireccionLugar').value;
    const latitud = document.getElementById('editarLatitudLugar').value;
    const longitud = document.getElementById('editarLongitudLugar').value;
    const categoriaId = document.getElementById('editarCategoriaLugar').value;

    // Validar que los campos obligatorios no estén vacíos
    if (!nombre || !categoriaId) {
        Swal.fire('Error', 'Los campos Nombre y Categoría son obligatorios', 'error');
        return;
    }

    // Crear FormData para enviar con el token CSRF
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('direccion', direccion);
    formData.append('coordenadas_lat', latitud);
    formData.append('coordenadas_lon', longitud);
    formData.append('categoria_id', categoriaId);

    // Enviar los datos al servidor
    fetch(`/admin/places/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarLugarModal'));
        modal.hide();

        // Mostrar mensaje de éxito
        Swal.fire('¡Guardado!', 'El lugar ha sido actualizado con éxito', 'success');

        // Recargar la tabla de lugares
        cargarLugares();
    })
    .catch(error => {
        console.error('Error al guardar cambios:', error);
        Swal.fire('Error', 'No se pudieron guardar los cambios del lugar', 'error');
    });
}

// Función para eliminar lugar
function eliminarLugar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Crear FormData para enviar con el token CSRF
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            
            fetch(`/admin/places/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire('Eliminado', 'El lugar ha sido eliminado con éxito', 'success');
                cargarLugares(); // Recargar la tabla de lugares
            })
            .catch(error => {
                console.error('Error al eliminar lugar:', error);
                Swal.fire('Error', 'No se pudo eliminar el lugar', 'error');
            });
        }
    });
}

// Función para abrir el modal de crear lugar
function abrirModalCrearLugar() {
    // Limpiar el formulario
    const form = document.getElementById('formCrearLugar');
    if (form) {
        form.reset();
    }
    
    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('crearLugarModal')).show();
    
    // Inicializar mapa para seleccionar ubicación si existe
    if (typeof inicializarMapaCrearLugar === 'function') {
        inicializarMapaCrearLugar();
    }
}

// Función para crear un nuevo lugar
function crearLugar() {
    // Buscar el formulario correctamente
    const formulario = document.getElementById('formCrearLugar');
    if (!formulario) {
        console.error('No se encontró el formulario con ID: formCrearLugar');
        Swal.fire('Error', 'No se pudo encontrar el formulario', 'error');
        return;
    }
    
    // Validar campos obligatorios
    const nombre = document.getElementById('crearNombreLugar').value;
    const descripcion = document.getElementById('crearDescripcionLugar').value;
    const direccion = document.getElementById('crearDireccionLugar').value;
    const latitud = document.getElementById('crearLatitudLugar').value;
    const longitud = document.getElementById('crearLongitudLugar').value;
    const categoriaId = document.getElementById('crearCategoriaLugar').value;
    
    if (!nombre || !descripcion || !direccion || !latitud || !longitud || !categoriaId) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    Swal.fire({
        title: 'Guardando...',
        text: 'Creando nuevo lugar',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Crear FormData con el formulario correcto
    const formData = new FormData(formulario);
    
    // Enviar datos al servidor
    fetch('/admin/places', {
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
        // Mostrar mensaje de éxito
        Swal.fire({
            title: '¡Creado!',
            text: 'El lugar ha sido creado con éxito',
            icon: 'success'
        });
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('crearLugarModal'));
        if (modal) {
            modal.hide();
        }
        
        // Recargar la tabla de lugares
        cargarLugares();
        
        // Limpiar el formulario
        formulario.reset();
    })
    .catch(error => {
        console.error('Error al crear lugar:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el lugar: ' + error.message,
            icon: 'error'
        });
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
    // Campos de creación
    const crearCampos = [
        'crearNombreLugar',
        'crearDescripcionLugar',
        'crearDireccionLugar',
        'crearLatitudLugar',
        'crearLongitudLugar',
        'crearCategoriaLugar'
    ];

    crearCampos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', () => validarCampo(campo));
        }
    });

    // Campos de edición
    const editarCampos = [
        'editarNombreLugar',
        'editarDescripcionLugar',
        'editarDireccionLugar',
        'editarLatitudLugar',
        'editarLongitudLugar',
        'editarCategoriaLugar'
    ];

    editarCampos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', () => validarCampo(campo));
        }
    });
}

function limpiarFiltrosLugares() {
    document.getElementById('filtroNombre-lugares').value = '';
    document.getElementById('filtroCategoria-lugares').value = '';
    cargarLugares();
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el botón de crear lugar
    const btnCrearLugar = document.getElementById('CrearPlaceBtn');
    if (btnCrearLugar) {
        btnCrearLugar.addEventListener('click', abrirModalCrearLugar);
    }
    
    // Inicializar el botón de guardar lugar
    const btnGuardarLugar = document.getElementById('btnGuardarLugar');
    if (btnGuardarLugar) {
        btnGuardarLugar.addEventListener('click', crearLugar);
    }

    // Inicializar eventos de filtros
    document.getElementById('filtroNombre-lugares').addEventListener('input', cargarLugares);
    document.getElementById('filtroCategoria-lugares').addEventListener('change', cargarLugares);

    // Inicializar validaciones
    inicializarValidaciones();
});
