/**
 * Funcionalidades básicas del mapa - inicialización y configuración
 */

// Variables globales
let map = null;
let markers = []; // Array para almacenar todos los marcadores

// Función para inicializar el mapa en una ubicación dada
function inicializarMapa(lat, lng, containerId = 'map') {
    // Crear el mapa y establecer la vista
    map = L.map(containerId).setView([lat, lng], 13);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Añadir control de escala
    L.control.scale().addTo(map);
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Configurar eventos de mapa
    configurarEventosMapa(map);

    return map;
}

// Función para configurar eventos del mapa
function configurarEventosMapa(map) {
    // Añadir evento de clic en el mapa para permitir seleccionar ubicación
    map.on('click', function(e) {
        if (window.creatingPlace || window.editingPlace) {
            const latlng = e.latlng;
            
            // Actualizar los campos del formulario correspondiente
            if (window.creatingPlace) {
                const latField = document.getElementById('crearLatitudLugar');
                const lngField = document.getElementById('crearLongitudLugar');
                
                if (latField) latField.value = latlng.lat.toFixed(6);
                if (lngField) lngField.value = latlng.lng.toFixed(6);
                
                // Actualizar el marcador temporal
                if (window.tempMarker) {
                    map.removeLayer(window.tempMarker);
                }
                window.tempMarker = L.marker(latlng).addTo(map)
                    .bindPopup('Ubicación seleccionada')
                    .openPopup();
                
                // Mostrar notificación
                Swal.fire({
                    title: 'Ubicación seleccionada',
                    text: `Coordenadas: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
                    icon: 'success',
                    toast: true,
                    showConfirmButton: false,
                    timer: 3000
                });
            } else if (window.editingPlace) {
                const latField = document.getElementById('editarLatitudLugar');
                const lngField = document.getElementById('editarLongitudLugar');
                
                if (latField) latField.value = latlng.lat.toFixed(6);
                if (lngField) lngField.value = latlng.lng.toFixed(6);
                
                // Añadir marcador temporal
                if (window.tempEditMarker) {
                    map.removeLayer(window.tempEditMarker);
                }
                window.tempEditMarker = L.marker(latlng).addTo(map)
                    .bindPopup('Ubicación editada')
                    .openPopup();
            }
        }
    });
}

// Función para inicializar mapa en modal de crear lugar
function inicializarMapaCrearLugar() {
    // Activar el modo de creación
    window.creatingPlace = true;
    
    // Obtener el contenedor del mapa en el modal
    const mapContainer = document.getElementById('crear-lugar-map');
    
    if (!mapContainer) {
        console.error('Contenedor del mapa no encontrado: crear-lugar-map');
        return null;
    }
    
    // Inicializar el mapa con el ID correcto
    let mapInstance = inicializarMapa(41.3851, 2.1734, 'crear-lugar-map'); // Barcelona por defecto
    
    // Asegurarse de que el mapa esté visible y correctamente renderizado
    setTimeout(() => {
        if (mapInstance) {
            mapInstance.invalidateSize();
        }
    }, 300);
    
    // Limpiar marcador temporal si existe
    if (window.tempMarker) {
        mapInstance.removeLayer(window.tempMarker);
        window.tempMarker = null;
    }
    
    return mapInstance;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el elemento del mapa existe en la página actual
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Inicializar el mapa en Barcelona como ubicación por defecto
        map = inicializarMapa(41.3851, 2.1734);
        
        // Cargar los filtros
        if (typeof cargarControlesFiltros === 'function') {
            cargarControlesFiltros(map);
        }
        
        // Cargar los lugares
        if (typeof cargarLugaresEnMapa === 'function') {
            cargarLugaresEnMapa(map);
        }
    }
    
    // Verificar si estamos en una página con pestañas (como en el CRUD)
    const mapaTab = document.getElementById('mapa-tab');
    if (mapaTab) {
        // Si estamos en una página con pestañas, inicializar el mapa cuando se haga clic en la pestaña
        mapaTab.addEventListener('click', function() {
            setTimeout(() => {
                if (!map) {
                    map = inicializarMapa(41.3851, 2.1734);
                    
                    // Cargar los filtros
                    if (typeof cargarControlesFiltros === 'function') {
                        cargarControlesFiltros(map);
                    }
                    
                    // Cargar los lugares
                    if (typeof cargarLugaresEnMapa === 'function') {
                        cargarLugaresEnMapa(map);
                    }
                } else {
                    map.invalidateSize();
                }
            }, 100);
        });
    }
});
