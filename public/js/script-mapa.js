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

// Inicializar el mapa centrado en la ubicación por defecto
var map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 15);

// Capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables globales
var routeControl;
var userMarker;
var userPosition = null;
var placeMarkers = [];
var watchId = null;
var isTracking = false;

// Opciones de geolocalización ajustadas
var opcionesGPS = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 15000 // Aumentamos el tiempo de espera a 15 segundos
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
            ${authCheck ? `
            <div class="mt-2 d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-primary route-btn" data-id="${place.id}">
                    <i class="fas fa-route me-1"></i>Ir aquí
                </button>
                <button class="btn btn-sm btn-outline-danger favorite-btn" data-id="${place.id}">
                    <i class="fas fa-heart me-1"></i><span class="favorite-text">Favorito</span>
                </button>
            </div>
            ` : ''}
        </div>
    `);
    
    // Evento para crear ruta al hacer clic en un marcador
    marker.on('click', function(e) {
        if (authCheck) {
            // Verificar si es favorito
            checkIfFavorite(place.id, marker);
        }
        
        if (userPosition) {
            updateRoute(e.latlng);
        } else {
            alert("Primero activa tu ubicación con el botón de localización");
        }
    });
    
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
    // Centrar el mapa en la nueva posición
    centerMap(userPosition.lat, userPosition.lng);
    if (!userMarker) {
        createUserMarker();
    } else {
        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    }
    // Actualizar la ruta si existe
    if (routeControl) {
        updateRoute(routeControl.getWaypoints()[1]);
    }
}

// Función para manejar errores de geolocalización
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

// Función para usar una ubicación por defecto
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

// Función para crear el marcador del usuario
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

// Función para iniciar el seguimiento de la ubicación
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

// Función para detener el seguimiento de la ubicación
function stopTracking() {
    isTracking = false;
    if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    // Actualizar UI
    updateTrackingUI(false);
}

// Función para actualizar la interfaz de usuario del seguimiento
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

// Función para cargar los favoritos
function loadFavorites() {
    if (!authCheck) {
        document.getElementById('favorites-list').innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>Debes iniciar sesión para ver tus favoritos.
            </div>
        `;
        return;
    }
    
    fetch('/favorites/list')
        .then(response => response.json())
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
                            <button class="btn btn-sm btn-outline-primary show-route-btn" 
                                data-lat="${place.coordenadas_lat}" 
                                data-lng="${place.coordenadas_lon}"
                                data-name="${place.nombre}">
                                <i class="fas fa-route"></i>
                            </button>
                            <button class="btn btn-sm btn-danger remove-favorite-btn" data-id="${place.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            favoritesList.innerHTML = html;
            
            // Añadir eventos a los botones
            document.querySelectorAll('.show-route-btn').forEach(button => {
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
                        if (routeControl) {
                            map.removeControl(routeControl);
                        }
                        
                        routeControl = L.Routing.control({
                            waypoints: [
                                L.latLng(userPosition.lat, userPosition.lng),
                                L.latLng(lat, lng)
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
                        
                        // Mostrar información sobre la ruta
                        routeControl.on('routesfound', function(e) {
                            const routes = e.routes;
                            if (routes && routes.length > 0) {
                                const route = routes[0];
                                const distance = (route.summary.totalDistance / 1000).toFixed(1);
                                const time = Math.round(route.summary.totalTime / 60);
                                
                                // Mostrar un mensaje con la información de la ruta
                                const routeInfo = `
                                    <div class="route-info">
                                        <h5>Ruta a ${name}</h5>
                                        <p><i class="fas fa-road me-2"></i>Distancia: ${distance} km</p>
                                        <p><i class="fas fa-clock me-2"></i>Tiempo estimado: ${time} min</p>
                                    </div>
                                `;
                                
                                // Crear un popup con la información de la ruta
                                L.popup()
                                    .setLatLng([lat, lng])
                                    .setContent(routeInfo)
                                    .openOn(map);
                            }
                        });
                    } else {
                        alert('No se ha podido obtener tu ubicación actual. Activa la ubicación para ver la ruta.');
                    }
                });
            });
            
            document.querySelectorAll('.remove-favorite-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const placeId = this.dataset.id;
                    
                    if (confirm('¿Estás seguro de que quieres eliminar este lugar de tus favoritos?')) {
                        toggleFavorite(placeId, null, null, () => {
                            // Eliminar el elemento de la lista
                            const favoriteItem = this.closest('.favorite-item');
                            favoriteItem.remove();
                            
                            // Si no quedan favoritos, mostrar mensaje
                            if (document.querySelectorAll('.favorite-item').length === 0) {
                                document.getElementById('favorites-list').innerHTML = `
                                    <div class="alert alert-info">
                                        <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados.
                                    </div>
                                `;
                            }
                        });
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error cargando favoritos:', error);
            document.getElementById('favorites-list').innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>Error al cargar tus favoritos.
                </div>
            `;
        });
}

// Función para obtener el icono de categoría
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

// Función para verificar si un lugar es favorito
function checkIfFavorite(placeId, marker) {
    if (!authCheck) return;
    
    fetch(`/favorites/check/${placeId}`)
        .then(response => response.json())
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
        .catch(error => console.error('Error verificando favorito:', error));
}

// Función para alternar favorito
function toggleFavorite(placeId, button, textElement, callback) {
    if (!authCheck) return;
    
    fetch(`/favorites/toggle/${placeId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (button && textElement) {
                if (data.isFavorite) {
                    button.classList.remove('btn-outline-danger');
                    button.classList.add('btn-danger');
                    textElement.textContent = 'Quitar';
                } else {
                    button.classList.remove('btn-danger');
                    button.classList.add('btn-outline-danger');
                    textElement.textContent = 'Favorito';
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
    .catch(error => console.error('Error al alternar favorito:', error));
}

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
                .bindPopup(`<b>${query}</b>`)
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