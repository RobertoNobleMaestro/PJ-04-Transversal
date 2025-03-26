/**
 * Funciones comunes compartidas entre los diferentes CRUD
 */

// Función para cargar categorías en los selects
function cargarCategorias() {
    return fetch('/admin/categories')
        .then(response => response.json())
        .then(data => {
            const crearCategoria = document.getElementById('crearCategoriaLugar');
            const editarCategoria = document.getElementById('editarCategoriaLugar');
            const filtroCategoria = document.getElementById('filtroCategoria-lugares');
            
            // Limpiar opciones anteriores
            if (crearCategoria) crearCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
            if (editarCategoria) editarCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
            if (filtroCategoria) filtroCategoria.innerHTML = '<option value="">Todas</option>';
            
            // Añadir nuevas opciones
            data.forEach(categoria => {
                if (crearCategoria) {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.name;
                    crearCategoria.appendChild(option);
                }
                
                if (editarCategoria) {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.name;
                    editarCategoria.appendChild(option);
                }
                
                if (filtroCategoria) {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.name;
                    filtroCategoria.appendChild(option);
                }
            });
            
            return data; // Devolvemos los datos para poder encadenar promesas
        });
}

// Función para cargar grupos en los selects
function cargarGrupos() {
    return fetch('/admin/groups')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar grupos: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const crearGrupo = document.getElementById('crearGroupId');
            const editarGrupo = document.getElementById('editarGroupId');
            
            // Limpiar opciones anteriores
            if (crearGrupo) crearGrupo.innerHTML = '<option value="">Seleccione un grupo</option>';
            if (editarGrupo) editarGrupo.innerHTML = '<option value="">Seleccione un grupo</option>';
            
            // Añadir nuevas opciones
            data.forEach(grupo => {
                if (crearGrupo) {
                    const option = document.createElement('option');
                    option.value = grupo.id;
                    option.textContent = grupo.codigogrupo || grupo.nombre;
                    crearGrupo.appendChild(option);
                }
                
                if (editarGrupo) {
                    const option = document.createElement('option');
                    option.value = grupo.id;
                    option.textContent = grupo.codigogrupo || grupo.nombre;
                    editarGrupo.appendChild(option);
                }
            });
            
            return data; // Devolvemos los datos para poder encadenar promesas
        })
        .catch(error => {
            console.error('Error al cargar grupos:', error);
            return [];
        });
}

// Función para cargar checkpoints disponibles para asignar a gimcanas
function cargarCheckpointsDisponibles() {
    return fetch('/admin/checkpoints')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar checkpoints: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const crearCheckpoints = document.getElementById('crearCheckpoints');
            const editarCheckpoints = document.getElementById('editarCheckpoints');
            
            // Limpiar opciones anteriores
            if (crearCheckpoints) crearCheckpoints.innerHTML = '';
            if (editarCheckpoints) editarCheckpoints.innerHTML = '';
            
            // Añadir nuevas opciones
            data.forEach(checkpoint => {
                if (crearCheckpoints) {
                    const option = document.createElement('option');
                    option.value = checkpoint.id;
                    option.textContent = `${checkpoint.pista} (${checkpoint.place?.nombre || 'Sin lugar'})`;
                    crearCheckpoints.appendChild(option);
                }
                
                if (editarCheckpoints) {
                    const option = document.createElement('option');
                    option.value = checkpoint.id;
                    option.textContent = `${checkpoint.pista} (${checkpoint.place?.nombre || 'Sin lugar'})`;
                    editarCheckpoints.appendChild(option);
                }
            });
            
            return data;
        })
        .catch(error => {
            console.error('Error al cargar checkpoints:', error);
            return [];
        });
}

// Función para cargar el contenido según la pestaña activa
function cargarContenidoSegunPestana() {
    const pestanaActiva = document.querySelector('.nav-link.active');
    if (!pestanaActiva) return;
    
    const target = pestanaActiva.getAttribute('data-bs-target');
    
    // Cargar el contenido correspondiente según la pestaña
    if (target === '#gimcanas') {
        if (typeof cargarGimcanas === 'function') {
            cargarGimcanas();
        }
    } else if (target === '#lugares') {
        if (typeof cargarLugares === 'function') {
            cargarLugares();
        }
    } else if (target === '#checkpoints') {
        if (typeof cargarCheckpointsRecientes === 'function') {
            cargarCheckpointsRecientes();
        }
    }
}

// Función para inicializar los eventos de las pestañas
function inicializarEventosPestanas() {
    // Añadir evento para cambio de pestañas
    const tabLinks = document.querySelectorAll('.nav-link[data-bs-toggle="tab"]');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            cargarContenidoSegunPestana();
        });
    });
    
    // Cargar el contenido de la pestaña activa inicialmente
    cargarContenidoSegunPestana();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar eventos de pestañas
    inicializarEventosPestanas();
    
    // Cargar categorías para formularios
    cargarCategorias();
    cargarGrupos();
    
    // Al cargar la página, verificar qué pestaña está activa y cargar su contenido
    setTimeout(() => {
        cargarContenidoSegunPestana();
    }, 100);
    
    // Añadir un controlador de eventos para todos los modales
    document.querySelectorAll('.modal').forEach(modalElement => {
        modalElement.addEventListener('shown.bs.modal', function() {
            // Si el modal contiene un mapa, invalidar su tamaño para renderizarlo correctamente
            const mapElement = this.querySelector('[id$="-map"]');
            if (mapElement && window.map) {
                setTimeout(() => {
                    window.map.invalidateSize();
                }, 200);
            }
        });
    });
});
