// Configuración de iconos por categoría
const categoryIcons = {
    'Monumento': { icon: 'fa-landmark', color: '#FF5733', size: 24 },
    'Museo': { icon: 'fa-museum', color: '#33A8FF', size: 24 },
    'Parque': { icon: 'fa-tree', color: '#4CAF50', size: 24 },
    'Playa': { icon: 'fa-umbrella-beach', color: '#FFC107', size: 24 },
    'Restaurante': { icon: 'fa-utensils', color: '#E91E63', size: 24 },
    'Hotel': { icon: 'fa-hotel', color: '#9C27B0', size: 22 },
    'Tienda': { icon: 'fa-store', color: '#795548', size: 22 },
    'Cafetería': { icon: 'fa-coffee', color: '#607D8B', size: 20 },
    'Bar': { icon: 'fa-glass-martini-alt', color: '#3F51B5', size: 20 },
    'default': { icon: 'fa-map-marker-alt', color: '#007bff', size: 24 }
};

// Inicializar el mapa
var map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 13);

// Capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables globales
var routeControl;
var userMarker;
var userPosition = null;
var placeMarkers = [];
var opcionesGPS = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
};

// Función para crear iconos personalizados
function createCustomIcon(place) {
    const categoryName = place.category?.name || 'default';
    const iconConfig = categoryIcons[categoryName] || categoryIcons['default'];
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<i class="fas ${iconConfig.icon}" style="color: ${iconConfig.color}; font-size: ${iconConfig.size}px;"></i>`,
        iconSize: [30, 30],
        popupAnchor: [0, -15],
        className: `marker-${categoryName.toLowerCase().replace(/\s+/g, '-')}`
    });
}

// Función para crear marcadores personalizados
function createCustomMarker(place) {
    const categoryName = place.category?.name || 'default';
    const iconConfig = categoryIcons[categoryName] || categoryIcons['default'];

    const marker = L.marker([place.coordenadas_lat, place.coordenadas_lon], {
        icon: createCustomIcon(place)
    }).addTo(map)
    .bindPopup(`
        <div class="marker-popup">
            <h5>${place.nombre}</h5>
            <span class="badge mb-2" style="background-color: ${iconConfig.color};">
                ${categoryName}
            </span>
            <p>${place.descripcion}</p>
            <p><i class="fas fa-map-marker-alt me-1"></i>${place.direccion}</p>
            ${place.imagen ? `<img src="/storage/${place.imagen}" alt="${place.nombre}" class="img-fluid">` : ''}
        </div>
    `);

    return marker;
}

// Función para cargar todos los lugares en el mapa
function loadPlacesOnMap() {
    if (!placesData || placesData.length === 0) return;

    placesData.forEach(place => {
        const marker = createCustomMarker(place);
        placeMarkers.push(marker);
    });
}

// Función para centrar el mapa en un lugar específico
function centerMap(lat, lng, zoom = 15) {
    map.setView([lat, lng], zoom);
}

// Función para actualizar la ubicación del usuario
function updateUserPosition(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    centerMap(userPosition.lat, userPosition.lng, 15);

    if (!userMarker) {
        // Crear icono personalizado para el usuario (coche negro)
        const userIcon = L.divIcon({
            className: 'user-car-marker',
            html: '<i class="fas fa-car" style="color: #000000; font-size: 22px;"></i>',
            iconSize: [32, 32],
            popupAnchor: [0, -16]
        });

        userMarker = L.marker([userPosition.lat, userPosition.lng], {
            draggable: true,
            icon: userIcon,
            zIndexOffset: 1000 // Para asegurar que aparece sobre otros marcadores
        }).addTo(map)
        .bindPopup("<b>Tu ubicación</b>")
        .openPopup()
        .on('dragend', function(e) {
            userPosition = e.target.getLatLng();
            updateRoute();
        });
    } else {
        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    }
    
    // Asegurar que el marcador del usuario está encima de los demás
    if (userMarker) {
        userMarker.setZIndexOffset(1000);
    }
}

// Función para manejar errores de geolocalización
function handleGeolocationError(error) {
    console.warn(`Error de geolocalización: ${error.message}`);
    alert("No se pudo obtener tu ubicación. Usando ubicación por defecto.");
}

// Función para actualizar la ruta
function updateRoute(endPoint) {
    if (!userPosition) return;

    const end = endPoint || (routeControl ? routeControl.getWaypoints()[1] : null);
    if (!end) return;

    if (routeControl) {
        routeControl.setWaypoints([
            L.latLng(userPosition.lat, userPosition.lng),
            end
        ]);
    } else {
        routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userPosition.lat, userPosition.lng),
                end
            ],
            routeWhileDragging: true,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: function() { return null; }
        }).addTo(map);
    }
}

// Evento para el botón de ubicación
document.getElementById('locateMe').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            updateUserPosition,
            handleGeolocationError,
            opcionesGPS
        );
    } else {
        alert("Geolocalización no soportada por tu navegador");
    }
});

// Búsqueda con Nominatim
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                centerMap(lat, lng);

                // Crear marcador temporal de búsqueda
                L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: '<i class="fas fa-search" style="color: #6c757d; font-size: 20px;"></i>',
                        iconSize: [30, 30]
                    })
                }).addTo(map)
                .bindPopup(`<b>${query}</b>`)
                .openPopup();
            } else {
                alert("No se encontraron resultados para la búsqueda");
            }
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
            alert("Error al realizar la búsqueda");
        });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar lugares en el mapa
    loadPlacesOnMap();

    // Intentar obtener la ubicación del usuario al cargar
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            updateUserPosition,
            handleGeolocationError,
            opcionesGPS
        );
    }

    // Ajustar el tamaño del mapa al cargar y redimensionar
    setTimeout(() => map.invalidateSize(), 100);
    window.addEventListener('resize', () => map.invalidateSize());
});

// Evento para hacer clic en el mapa y crear rutas
map.on('click', function(e) {
    if (userPosition) {
        updateRoute(e.latlng);
    }
});