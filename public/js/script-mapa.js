// =====================================================================
// CONFIGURACIÓN DE ICONOS POR CATEGORÍA
// =====================================================================
// Define los iconos, colores y tamaños para cada tipo de lugar en el mapa
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

// =====================================================================
// INICIALIZACIÓN DEL MAPA
// =====================================================================
// Crea el mapa centrado en la ubicación por defecto
var map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 15);

// Añade la capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// =====================================================================
// VARIABLES GLOBALES
// =====================================================================
var routeControl;     // Control para gestionar rutas en el mapa
var userMarker;       // Marcador que representa al usuario
var userPosition = null; // Posición actual del usuario (lat, lng)
var placeMarkers = []; // Array de marcadores de lugares
var watchId = null;   // ID del watcher de geolocalización
var isTracking = false; // Estado del seguimiento de ubicación

// Opciones de geolocalización ajustadas para mejor precisión
var opcionesGPS = {
    enableHighAccuracy: true, // Usa GPS de alta precisión si está disponible
    maximumAge: 10000,        // Acepta posiciones con hasta 10 segundos de antigüedad
    timeout: 15000            // Tiempo máximo de espera para obtener la ubicación
};

// =====================================================================
// FUNCIONES PARA MARCADORES Y VISUALIZACIÓN
// =====================================================================

// Crea un icono personalizado según la categoría del lugar
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

// Crea un marcador personalizado para un lugar con su popup informativo
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
            ${authCheck ? `
            <div class="mt-2 d-flex justify-content-between">
                <button class="btn btn-sm btn-primary route-btn" data-id="${place.id}" onclick="createRoute(${place.coordenadas_lat}, ${place.coordenadas_lon})">
                    <i class="fas fa-route me-1"></i>Ir aquí
                </button>
                <button class="btn btn-sm btn-danger favorite-btn" data-id="${place.id}">
                    <i class="fas fa-heart me-1"></i><span class="favorite-text">Favorito</span>
                </button>
            </div>
            ` : ''}
        </div>
    `);
    
    marker.on('click', function(e) {
        if (authCheck) {
            // Verificar si es favorito cuando se hace clic en el marcador
            checkIfFavorite(place.id, marker);
        }
    });
    
    return marker;
}

// Carga todos los lugares disponibles en el mapa
function loadPlacesOnMap() {
    if (!placesData || placesData.length === 0) return;
    placesData.forEach(place => {
        const marker = createCustomMarker(place);
        placeMarkers.push(marker);
    });
}

// Centra el mapa en unas coordenadas específicas con un nivel de zoom
function centerMap(lat, lng, zoom = 15) {
    map.setView([lat, lng], zoom);
}

// =====================================================================
// FUNCIONES DE GEOLOCALIZACIÓN
// =====================================================================

// Actualiza la posición del usuario en el mapa
function updateUserPosition(position) {
    userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    // Centra el mapa en la nueva posición
    centerMap(userPosition.lat, userPosition.lng);
    if (!userMarker) {
        createUserMarker();
    } else {
        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    }
    // Actualiza la ruta si existe
    if (routeControl) {
        updateRoute(routeControl.getWaypoints()[1]);
    }
}

// Maneja los errores de geolocalización mostrando mensajes apropiados
function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.warn("Permiso denegado por el usuario.");
            alert("Debes permitir el acceso a tu ubicación para usar esta función.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.warn("La información de ubicación no está disponible.");
            alert("No se pudo obtener tu ubicación. Usando ubicación por defecto.");
            break;
        case error.TIMEOUT:
            console.warn("Se ha excedido el tiempo de espera para obtener la ubicación.");
            alert("Tu ubicación tardó demasiado en cargarse. Usando ubicación por defecto.");
            break;
        default:
            console.warn(`Error desconocido: ${error.message}`);
            alert("Ocurrió un error desconocido. Usando ubicación por defecto.");
    }
    // Usar ubicación por defecto si falla la geolocalización
    useDefaultLocation();
}

// Establece la ubicación por defecto cuando no se puede obtener la real
function useDefaultLocation() {
    userPosition = {
        lat: defaultLocation.lat,
        lng: defaultLocation.lng
    };
    centerMap(userPosition.lat, userPosition.lng);
    if (!userMarker) {
        createUserMarker();
    } else {
        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    }
}

// Crea el marcador que representa al usuario en el mapa
function createUserMarker() {
    const userIcon = L.divIcon({
        className: 'user-car-marker',
        html: '<i class="fas fa-car" style="color: #000000; font-size: 22px;"></i>',
        iconSize: [32, 32],
        popupAnchor: [0, -16]
    });
    userMarker = L.marker([userPosition.lat, userPosition.lng], {
        icon: userIcon,
        zIndexOffset: 1000
    }).addTo(map)
    .bindPopup("<b>Tu ubicación actual</b>")
    .openPopup();
}

// =====================================================================
// FUNCIONES PARA RUTAS
// =====================================================================

// Actualiza o crea una ruta entre la posición del usuario y un destino
function updateRoute(endPoint) {
    if (!userPosition) {
        showToast("Activa tu ubicación para crear una ruta", "warning");
        return;
    }
    
    const end = endPoint || (routeControl ? routeControl.getWaypoints()[1] : null);
    if (!end) return;
    
    // Mostrar indicador de carga
    showToast("Calculando ruta...", "info");
    
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
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [
                    { color: '#3388ff', opacity: 0.8, weight: 6 },
                    { color: '#ffffff', opacity: 0.3, weight: 4 }
                ]
            }
        }).addTo(map);
        
        // Evento cuando la ruta se calcula
        routeControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Calcular distancia en km y tiempo en minutos
            const distance = (summary.totalDistance / 1000).toFixed(1);
            const time = Math.round(summary.totalTime / 60);
            
            // Buscar información del lugar de destino
            const destinationLat = end.lat;
            const destinationLng = end.lng;
            const placeId = findPlaceIdByCoordinates(destinationLat, destinationLng);
            let placeName = "destino";
            
            if (placeId) {
                // Si encontramos el lugar, usar su nombre
                const place = placesData.find(p => p.id === placeId);
                if (place) {
                    placeName = place.nombre;
                }
            }
            
            // Mostrar información de la ruta
            showRouteInfo(placeName, distance, time);
            
            // Guardar datos de la ruta para posible uso posterior
            routeControl._selectedRoute = {
                coordinates: routes[0].coordinates,
                summary: summary
            };
            
            // Ocultar el toast de "Calculando ruta..."
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
                const toasts = toastContainer.querySelectorAll('.toast');
                toasts.forEach(toast => {
                    if (toast.textContent.includes('Calculando ruta')) {
                        toast.classList.remove('show');
                        setTimeout(() => toast.remove(), 300);
                    }
                });
            }
        });
        
        // Evento cuando hay un error al calcular la ruta
        routeControl.on('routingerror', function(e) {
            console.error('Error al calcular la ruta:', e.error);
            showToast('No se pudo calcular la ruta. Intenta con otro destino.', 'error');
        });
    }
}

// =====================================================================
// FUNCIONES PARA SEGUIMIENTO DE UBICACIÓN
// =====================================================================

// Inicia el seguimiento de la ubicación del usuario
function startTracking() {
    if (navigator.geolocation) {
        isTracking = true;
        // Obtener la ubicación inicial
        navigator.geolocation.getCurrentPosition(
            updateUserPosition,
            handleGeolocationError,
            opcionesGPS
        );
        // Iniciar el seguimiento continuo
        watchId = navigator.geolocation.watchPosition(
            updateUserPosition,
            handleGeolocationError,
            opcionesGPS
        );
        // Actualizar UI
        updateTrackingUI(true);
    } else {
        alert("Geolocalización no soportada por tu navegador");
    }
}

// Detiene el seguimiento de la ubicación del usuario
function stopTracking() {
    isTracking = false;
    if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    // Actualizar UI
    updateTrackingUI(false);
}

// Actualiza la interfaz de usuario para reflejar el estado del seguimiento
function updateTrackingUI(isActive) {
    // Para móvil
    const mobileIcon = document.getElementById('locationIcon');
    const mobileBtn = document.getElementById('toggleLocation');
    if (mobileIcon && mobileBtn) {
        if (isActive) {
            mobileIcon.classList.add('location-active');
            mobileBtn.title = "Detener seguimiento";
        } else {
            mobileIcon.classList.remove('location-active');
            mobileBtn.title = "Iniciar seguimiento";
        }
    }
    // Para desktop
    const desktopBtn = document.getElementById('locateMe');
    if (desktopBtn) {
        if (isActive) {
            desktopBtn.classList.add('active');
            desktopBtn.innerHTML = '<i class="fas fa-stop"></i>';
        } else {
            desktopBtn.classList.remove('active');
            desktopBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        }
    }
}

// =====================================================================
// EVENTOS
// =====================================================================

// Eventos para los botones de ubicación
document.getElementById('toggleLocation')?.addEventListener('click', function() {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
});

document.getElementById('locateMe')?.addEventListener('click', function() {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
});

// Evento para mostrar/ocultar la barra de búsqueda en móvil
document.getElementById('toggleSearch')?.addEventListener('click', function() {
    const searchContainer = document.getElementById('mobileSearchContainer');
    searchContainer.classList.toggle('visible');
});

// Favoritos
let favoritesPanel = document.getElementById('favorites-panel');
if (favoritesPanel) {
    // Ocultar el panel de favoritos inicialmente
    favoritesPanel.style.display = 'none';
    
    // Evento para mostrar/ocultar el panel de favoritos
    document.getElementById('toggleFavorites')?.addEventListener('click', function() {
        if (favoritesPanel.style.display === 'none') {
            favoritesPanel.style.display = 'block';
            loadFavorites();
        } else {
            favoritesPanel.style.display = 'none';
        }
    });
    
    // Evento para cerrar el panel de favoritos
    document.getElementById('closeFavorites')?.addEventListener('click', function() {
        favoritesPanel.style.display = 'none';
    });
}

// =====================================================================
// FUNCIONES PARA FAVORITOS
// =====================================================================

// Carga los favoritos del usuario
function loadFavorites() {
    if (!authCheck) {
        document.getElementById('favorites-list').innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>Debes iniciar sesión para ver tus favoritos.
            </div>
        `;
        return;
    }
    
    // Mostrar indicador de carga
    document.getElementById('favorites-list').innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando tus favoritos...</p>
        </div>
    `;
    
    fetch('/favorites/list', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar favoritos');
            }
            return response.json();
        })
        .then(data => {
            const favoritesList = document.getElementById('favorites-list');
            
            if (data.favorites.length === 0) {
                favoritesList.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados.
                    </div>
                `;
                return;
            }
            
            let html = '';
            data.favorites.forEach(favorite => {
                const place = favorite.place;
                const categoryIcon = getCategoryIcon(place.category ? place.category.name : null);
                const hasRoute = favorite.route_data ? true : false;
                
                html += `
                    <div class="favorite-item" data-id="${place.id}">
                        <div class="favorite-icon">
                            <i class="fas ${categoryIcon.icon}" style="color: ${categoryIcon.color};"></i>
                        </div>
                        <div class="favorite-info">
                            <div class="favorite-name">${place.nombre}</div>
                            <div class="favorite-address small text-muted">${place.direccion}</div>
                        </div>
                        <div class="favorite-actions">
                            <button class="btn btn-sm btn-outline-primary show-location-btn" 
                                data-lat="${place.coordenadas_lat}" 
                                data-lng="${place.coordenadas_lon}"
                                title="Ver ubicación">
                                <i class="fas fa-map-marker-alt"></i>
                            </button>
                            ${hasRoute ? `
                            <button class="btn btn-sm btn-primary show-route-btn" 
                                data-id="${favorite.id}"
                                data-place-id="${place.id}"
                                data-lat="${place.coordenadas_lat}" 
                                data-lng="${place.coordenadas_lon}"
                                data-name="${place.nombre}"
                                title="Ver ruta guardada">
                                <i class="fas fa-route"></i>
                            </button>
                            ` : `
                            <button class="btn btn-sm btn-outline-primary create-route-btn" 
                                data-lat="${place.coordenadas_lat}" 
                                data-lng="${place.coordenadas_lon}"
                                data-name="${place.nombre}"
                                title="Crear ruta">
                                <i class="fas fa-route"></i>
                            </button>
                            `}
                            <button class="btn btn-sm btn-danger remove-favorite-btn" 
                                data-id="${place.id}"
                                title="Eliminar de favoritos">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            favoritesList.innerHTML = html;
            
            // Añadir eventos a los botones
            setupFavoriteButtonEvents();
        })
        .catch(error => {
            console.error('Error cargando favoritos:', error);
            document.getElementById('favorites-list').innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>Error al cargar tus favoritos.
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="loadFavorites()">
                        <i class="fas fa-sync-alt me-1"></i>Reintentar
                    </button>
                </div>
            `;
        });
}

// Configura los eventos para los botones de favoritos
function setupFavoriteButtonEvents() {
    // Evento para ver ubicación
    document.querySelectorAll('.show-location-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            
            // Cerrar el panel de favoritos
            document.getElementById('favorites-panel').classList.remove('active');
            
            // Centrar el mapa en el lugar
            centerMap(lat, lng);
        });
    });
    
    // Evento para crear ruta
    document.querySelectorAll('.create-route-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            const name = this.dataset.name;
            
            // Cerrar el panel de favoritos
            document.getElementById('favorites-panel').classList.remove('active');
            
            // Centrar el mapa en el lugar
            centerMap(lat, lng);
            
            // Crear la ruta
            if (userPosition) {
                updateRoute(L.latLng(lat, lng));
            } else {
                showToast('No se ha podido obtener tu ubicación actual. Activa la ubicación para ver la ruta.', 'warning');
            }
        });
    });
    
    // Evento para ver ruta guardada
    document.querySelectorAll('.show-route-btn').forEach(button => {
        button.addEventListener('click', function() {
            const favoriteId = this.dataset.id;
            const placeId = this.dataset.placeId;
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            const name = this.dataset.name;
            
            // Cerrar el panel de favoritos
            document.getElementById('favorites-panel').classList.remove('active');
            
            // Centrar el mapa en el lugar
            centerMap(lat, lng);
            
            // Buscar los datos de la ruta guardada
            fetch(`/favorites/get-route/${favoriteId}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener la ruta');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.route_data) {
                    try {
                        const routeData = JSON.parse(data.route_data);
                        
                        // Eliminar la ruta actual si existe
                        if (routeControl) {
                            map.removeControl(routeControl);
                        }
                        
                        // Crear la nueva ruta con los datos guardados
                        const waypoints = [
                            L.latLng(userPosition.lat, userPosition.lng),
                            L.latLng(lat, lng)
                        ];
                        
                        routeControl = L.Routing.control({
                            waypoints: waypoints,
                            routeWhileDragging: false,
                            show: false,
                            addWaypoints: false,
                            draggableWaypoints: false,
                            fitSelectedRoutes: true,
                            lineOptions: {
                                styles: [
                                    { color: '#3388ff', opacity: 0.8, weight: 6 },
                                    { color: '#ffffff', opacity: 0.3, weight: 4 }
                                ]
                            }
                        }).addTo(map);
                        
                        // Mostrar información sobre la ruta
                        const distance = (routeData.summary.totalDistance / 1000).toFixed(1);
                        const time = Math.round(routeData.summary.totalTime / 60);
                        
                        showRouteInfo(name, distance, time);
                        
                    } catch (error) {
                        console.error('Error al cargar la ruta guardada:', error);
                        showToast('Error al cargar la ruta guardada', 'error');
                        
                        // Si hay error, crear una nueva ruta
                        if (userPosition) {
                            updateRoute(L.latLng(lat, lng));
                        }
                    }
                } else {
                    // Si no hay datos de ruta, crear una nueva
                    if (userPosition) {
                        updateRoute(L.latLng(lat, lng));
                    } else {
                        showToast('No se ha podido obtener tu ubicación actual. Activa la ubicación para ver la ruta.', 'warning');
                    }
                }
            })
            .catch(error => {
                console.error('Error al obtener la ruta:', error);
                showToast('Error al obtener la ruta guardada', 'error');
                
                // Si hay error, intentar crear una nueva ruta
                if (userPosition) {
                    updateRoute(L.latLng(lat, lng));
                }
            });
        });
    });
    
    // Evento para eliminar favorito
    document.querySelectorAll('.remove-favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const placeId = this.dataset.id;
            
            if (confirm('¿Estás seguro de que quieres eliminar este lugar de tus favoritos?')) {
                toggleFavorite(placeId, null, null, () => {
                    // Eliminar el elemento de la lista con animación
                    const favoriteItem = this.closest('.favorite-item');
                    favoriteItem.style.transition = 'all 0.3s ease';
                    favoriteItem.style.opacity = '0';
                    favoriteItem.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        favoriteItem.remove();
                        
                        // Si no quedan favoritos, mostrar mensaje
                        if (document.querySelectorAll('.favorite-item').length === 0) {
                            document.getElementById('favorites-list').innerHTML = `
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados.
                                </div>
                            `;
                        }
                    }, 300);
                });
            }
        });
    });
}

// Muestra información sobre la ruta
function showRouteInfo(name, distance, time) {
    // Crear el contenedor para la información de la ruta si no existe
    let routeInfoContainer = document.getElementById('route-info-container');
    if (!routeInfoContainer) {
        routeInfoContainer = document.createElement('div');
        routeInfoContainer.id = 'route-info-container';
        routeInfoContainer.className = 'route-info-container';
        document.body.appendChild(routeInfoContainer);
    }
    
    // Actualizar el contenido del contenedor
    routeInfoContainer.innerHTML = `
        <div class="route-info-card">
            <div class="route-info-header">
                <h5>Ruta a ${name}</h5>
                <button class="btn-close" id="close-route-info"></button>
            </div>
            <div class="route-info-body">
                <p><i class="fas fa-road me-2"></i>Distancia: ${distance} km</p>
                <p><i class="fas fa-clock me-2"></i>Tiempo estimado: ${time} min</p>
            </div>
            <div class="route-info-footer">
                <button class="btn btn-sm btn-outline-primary" id="save-route-btn">
                    <i class="fas fa-heart me-1"></i>Guardar ruta
                </button>
            </div>
        </div>
    `;
    
    // Mostrar el contenedor
    routeInfoContainer.style.display = 'block';
    
    // Evento para cerrar la información de la ruta
    document.getElementById('close-route-info')?.addEventListener('click', function() {
        routeInfoContainer.style.display = 'none';
    });
    
    // Evento para guardar la ruta como favorito
    document.getElementById('save-route-btn')?.addEventListener('click', function() {
        // Obtener los datos de la ruta actual
        if (routeControl && routeControl._selectedRoute) {
            const route = {
                waypoints: routeControl.getWaypoints(),
                coordinates: routeControl._selectedRoute.coordinates,
                summary: {
                    totalDistance: routeControl._selectedRoute.summary.totalDistance,
                    totalTime: routeControl._selectedRoute.summary.totalTime
                }
            };
            
            // Obtener el ID del lugar de destino
            const destinationWaypoint = routeControl.getWaypoints()[1];
            const placeId = findPlaceIdByCoordinates(destinationWaypoint.latLng.lat, destinationWaypoint.latLng.lng);
            
            if (placeId) {
                saveRouteAsFavorite(placeId, route);
            } else {
                showToast('No se pudo identificar el lugar de destino', 'error');
            }
        } else {
            showToast('No hay una ruta activa para guardar', 'warning');
        }
    });
}

// Encuentra el ID de un lugar por sus coordenadas
function findPlaceIdByCoordinates(lat, lng, tolerance = 0.0001) {
    if (!placesData || placesData.length === 0) return null;
    
    // Buscar un lugar que coincida con las coordenadas (con cierta tolerancia)
    const place = placesData.find(p => 
        Math.abs(p.coordenadas_lat - lat) < tolerance && 
        Math.abs(p.coordenadas_lon - lng) < tolerance
    );
    
    return place ? place.id : null;
}

// =====================================================================
// FUNCIONES PARA FAVORITOS
// =====================================================================

// Obtiene el icono de categoría para un lugar
function getCategoryIcon(category) {
    const icons = {
        'Monumento': { icon: 'fa-landmark', color: '#FF5733' },
        'Museo': { icon: 'fa-museum', color: '#33A8FF' },
        'Parque': { icon: 'fa-tree', color: '#4CAF50' },
        'Playa': { icon: 'fa-umbrella-beach', color: '#FFC107' },
        'Restaurante': { icon: 'fa-utensils', color: '#E91E63' },
        'Hotel': { icon: 'fa-hotel', color: '#9C27B0' },
        'Tienda': { icon: 'fa-store', color: '#795548' },
        'Cafetería': { icon: 'fa-coffee', color: '#607D8B' },
        'Bar': { icon: 'fa-glass-martini-alt', color: '#3F51B5' }
    };
    
    return icons[category] || { icon: 'fa-map-marker-alt', color: '#007bff' };
}

// Verifica si un lugar es favorito
function checkIfFavorite(placeId, marker) {
    if (!authCheck) return;
    
    fetch(`/favorites/check/${placeId}`, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al verificar favorito');
            }
            return response.json();
        })
        .then(data => {
            const popup = marker.getPopup();
            if (popup) {
                const popupContent = popup.getContent();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = popupContent;
                
                const favoriteBtn = tempDiv.querySelector('.favorite-btn');
                const favoriteText = tempDiv.querySelector('.favorite-text');
                
                if (favoriteBtn && favoriteText) {
                    if (data.isFavorite) {
                        favoriteBtn.classList.remove('btn-outline-danger');
                        favoriteBtn.classList.add('btn-danger');
                        favoriteText.textContent = 'Quitar';
                    } else {
                        favoriteBtn.classList.remove('btn-danger');
                        favoriteBtn.classList.add('btn-outline-danger');
                        favoriteText.textContent = 'Favorito';
                    }
                    
                    // Agregar evento al botón de favorito si no lo tiene
                    if (!favoriteBtn.hasAttribute('data-has-event')) {
                        favoriteBtn.setAttribute('data-has-event', 'true');
                        favoriteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            toggleFavorite(placeId, favoriteBtn, favoriteText);
                        });
                    }
                }
                
                popup.setContent(tempDiv.innerHTML);
            }
        })
        .catch(error => {
            console.error('Error verificando favorito:', error);
            showToast('Error al verificar estado de favorito', 'error');
        });
}

// Alterna el estado de favorito de un lugar
function toggleFavorite(placeId, button, textElement, callback) {
    if (!authCheck) {
        showToast('Debes iniciar sesión para guardar favoritos', 'info');
        return;
    }
    
    fetch(`/favorites/toggle/${placeId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al procesar la solicitud');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            if (button && textElement) {
                if (data.isFavorite) {
                    button.classList.remove('btn-outline-danger');
                    button.classList.add('btn-danger');
                    textElement.textContent = 'Quitar';
                    showToast('Lugar añadido a favoritos', 'success');
                } else {
                    button.classList.remove('btn-danger');
                    button.classList.add('btn-outline-danger');
                    textElement.textContent = 'Favorito';
                    showToast('Lugar eliminado de favoritos', 'success');
                }
            }
            
            // Recargar la lista de favoritos si está visible
            if (document.getElementById('favorites-panel').classList.contains('active')) {
                loadFavorites();
            }
            
            // Ejecutar callback si existe
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    })
    .catch(error => {
        console.error('Error al alternar favorito:', error);
        showToast('Error al procesar la solicitud', 'error');
    });
}

// Guarda una ruta como favorito
function saveRouteAsFavorite(placeId, route) {
    if (!authCheck) {
        showToast("Debes iniciar sesión para guardar rutas como favoritos", "info");
        return;
    }
    
    // Mostrar indicador de carga
    showToast("Guardando ruta...", "info");
    
    // Preparar los datos de la ruta para guardar
    const routeData = {
        waypoints: route.waypoints,
        coordinates: route.coordinates,
        summary: {
            totalDistance: route.summary.totalDistance,
            totalTime: route.summary.totalTime
        }
    };
    
    // Enviar la petición al servidor
    fetch('/favorites/save-route', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            place_id: placeId,
            route_data: JSON.stringify(routeData)
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast('Ruta guardada en favoritos correctamente', 'success');
            
            // Actualizar el botón de guardar ruta si existe
            const saveRouteBtn = document.getElementById('save-route-btn');
            if (saveRouteBtn) {
                saveRouteBtn.classList.remove('btn-outline-primary');
                saveRouteBtn.classList.add('btn-success');
                saveRouteBtn.innerHTML = '<i class="fas fa-check me-1"></i>Ruta guardada';
                
                // Deshabilitar el botón temporalmente para evitar clics múltiples
                saveRouteBtn.disabled = true;
                setTimeout(() => {
                    saveRouteBtn.disabled = false;
                }, 2000);
            }
            
            // Recargar la lista de favoritos si está visible
            if (document.getElementById('favorites-panel').classList.contains('active')) {
                loadFavorites();
            }
        } else {
            showToast(data.message || 'Error al guardar la ruta', 'error');
        }
    })
    .catch(error => {
        console.error('Error al guardar la ruta:', error);
        showToast('Error al guardar la ruta', 'error');
    });
}

// =====================================================================
// FUNCIONES PARA NOTIFICACIONES
// =====================================================================

// Muestra una notificación toast
function showToast(message, type = 'info') {
    // Crear el contenedor de toasts si no existe
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Crear un ID único para el toast
    const toastId = 'toast-' + Date.now();
    
    // Determinar la clase de color según el tipo
    let bgClass = 'bg-info';
    if (type === 'success') bgClass = 'bg-success';
    if (type === 'error') bgClass = 'bg-danger';
    if (type === 'warning') bgClass = 'bg-warning';
    
    // Crear el elemento toast
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgClass} text-white">
                <strong class="me-auto">TurGimcana</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Añadir el toast al contenedor
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Inicializar y mostrar el toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    toast.show();
    
    // Eliminar el toast del DOM después de ocultarse
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// =====================================================================
// INICIALIZACIÓN
// =====================================================================

// Inicializar el mapa
loadPlacesOnMap();

// Iniciar el seguimiento de ubicación automáticamente si está en móvil
if (window.innerWidth <= 768) {
    startTracking();
}

// Evento para mostrar/ocultar el panel de favoritos
document.getElementById('showFavorites')?.addEventListener('click', function() {
    const favoritesPanel = document.getElementById('favorites-panel');
    favoritesPanel.classList.add('active');
    loadFavorites();
});

// Evento para cerrar el panel de favoritos
document.getElementById('closeFavorites')?.addEventListener('click', function() {
    document.getElementById('favorites-panel').classList.remove('active');
});

// Evento para ver todos los favoritos
document.getElementById('viewAllFavorites')?.addEventListener('click', function() {
    window.location.href = '/favorites';
});

// Cerrar el panel de favoritos al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const favoritesPanel = document.getElementById('favorites-panel');
    const showFavoritesBtn = document.getElementById('showFavorites');
    
    if (favoritesPanel && showFavoritesBtn) {
        if (!favoritesPanel.contains(event.target) && 
            event.target !== showFavoritesBtn && 
            !showFavoritesBtn.contains(event.target)) {
            favoritesPanel.classList.remove('active');
        }
    }
});

// Búsqueda con Nominatim
document.getElementById('searchButton')?.addEventListener('click', function() {
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
                .bindPopup(`
                    <div class="marker-popup">
                        <h5>${query}</h5>
                    </div>
                `)
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

// Búsqueda móvil
document.getElementById('searchButtonMobile')?.addEventListener('click', function() {
    const query = document.getElementById('searchInputMobile').value.trim();
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
                .bindPopup(`
                    <div class="marker-popup">
                        <h5>${query}</h5>
                    </div>
                `)
                .openPopup();
                // Ocultar la barra de búsqueda después de la búsqueda
                document.getElementById('mobileSearchContainer').classList.remove('visible');
            } else {
                alert("No se encontraron resultados para la búsqueda");
            }
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
            alert("Error al realizar la búsqueda");
        });
});

// Toggle para la barra de búsqueda móvil
document.getElementById('toggleSearch')?.addEventListener('click', function() {
    document.getElementById('mobileSearchContainer').classList.toggle('visible');
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar lugares en el mapa
    loadPlacesOnMap();
    // Ajustar el tamaño del mapa al cargar y redimensionar
    setTimeout(() => map.invalidateSize(), 100);
    window.addEventListener('resize', () => map.invalidateSize());
});

// Evento para hacer clic en el mapa y crear rutas
map.on('click', function(e) {
    if (userPosition) {
        updateRoute(e.latlng);
    } else {
        alert("Primero activa tu ubicación con el botón de localización");
    }
});

// Función para crear ruta
function createRoute(lat, lon) {
    if (userPosition) {
        updateRoute(L.latLng(lat, lon));
    } else {
        alert("Primero activa tu ubicación con el botón de localización");
    }
}

function saveRouteAsFavorite(routeData) {
    $.ajax({
        url: '/favorites/save-route',
        method: 'POST',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content'),
            route_data: JSON.stringify(routeData)
        },
        success: function(response) {
            showToast('Ruta guardada como favorita', 'success');
        },
        error: function(xhr) {
            showToast('Error al guardar la ruta', 'error');
        }
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}