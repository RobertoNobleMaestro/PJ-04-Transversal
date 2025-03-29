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

// Icono para checkpoints pendientes
const checkpointPendingIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// =====================================================================
// INICIALIZACIÓN DEL MAPA
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Crea el mapa centrado en la ubicación por defecto
    var map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 15);

    // Añade la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
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
    var userLocationCircle; // Círculo que muestra el radio de detección
    var detectionRadius = 400; // Radio de detección en metros (igual que en mapa.js)
    var checkpointsData = []; // Datos de checkpoints (para compatibilidad con mapa.js)
    var updateInterval; // Intervalo para actualizar la posición cada 10 segundos

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
    // FUNCIONES PARA RUTAS
    // =====================================================================

    // Función para actualizar o crear una ruta
    function updateRoute(endPoint) {
        if (!userPosition) {
            showToast("No se puede crear una ruta sin conocer tu ubicación", "error");
            return;
        }
        
        const startPoint = L.latLng(userPosition.lat, userPosition.lng);
        
        if (routeControl) {
            map.removeControl(routeControl);
        }
        
        routeControl = L.Routing.control({
            waypoints: [
                startPoint,
                endPoint
            ],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving'
            }),
            lineOptions: {
                styles: [{
                    color: '#3388ff',
                    opacity: 0.7,
                    weight: 6
                }]
            },
            createMarker: function() { return null; }, // No crear marcadores adicionales
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);
        
        routeControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Mostrar información de la ruta
            showRouteInfo(
                endPoint.name || 'Destino',
                (summary.totalDistance / 1000).toFixed(1),
                Math.round(summary.totalTime / 60)
            );
            
            // Guardar la ruta actual para posible uso posterior
            currentRoute = {
                start: startPoint,
                end: endPoint,
                distance: summary.totalDistance,
                time: summary.totalTime,
                name: endPoint.name || 'Destino'
            };
            
            // Mostrar el botón para guardar la ruta como favorito
            document.getElementById('saveRouteBtn').style.display = 'block';
        });
    }

    // Muestra la información de la ruta en el panel correspondiente
    function showRouteInfo(name, distance, time) {
        const routeInfoPanel = document.getElementById('route-info');
        routeInfoPanel.innerHTML = `
            <div class="route-header">
                <h3>${name}</h3>
                <button id="closeRouteInfo" class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="route-details">
                <div class="route-detail">
                    <i class="fas fa-road"></i>
                    <span>${distance} km</span>
                </div>
                <div class="route-detail">
                    <i class="fas fa-clock"></i>
                    <span>${time} min</span>
                </div>
            </div>
            <div class="route-actions">
                <button id="saveRouteBtn" class="btn btn-primary">
                    <i class="fas fa-star"></i> Guardar ruta
                </button>
            </div>
        `;
        
        routeInfoPanel.classList.add('visible');
        
        // Evento para cerrar el panel de información de ruta
        document.getElementById('closeRouteInfo').addEventListener('click', function() {
            routeInfoPanel.classList.remove('visible');
            if (routeControl) {
                map.removeControl(routeControl);
                routeControl = null;
            }
        });
        
        // Evento para guardar la ruta como favorito
        document.getElementById('saveRouteBtn').addEventListener('click', function() {
            if (currentRoute) {
                saveRouteAsFavorite(currentRoute);
            }
        });
    }

    // Función para calcular la distancia entre dos puntos (fórmula de Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Radio de la tierra en metros
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distancia en metros
    }

    // =====================================================================
    // FUNCIONES PARA CHECKPOINTS (Compatibilidad con mapa.js)
    // =====================================================================

    // Función para comprobar si estamos cerca del siguiente checkpoint
    function checkProximityToNextCheckpoint() {
        if (!userMarker || checkpointsData.length === 0) return;
        
        const nextCheckpoint = checkpointsData.find(checkpoint => !checkpoint.completed);
        if (!nextCheckpoint) return;
        
        const userLat = userMarker.getLatLng().lat;
        const userLng = userMarker.getLatLng().lng;
        
        const distance = calculateDistance(userLat, userLng, nextCheckpoint.lat, nextCheckpoint.lng);
        console.log(`Distancia al siguiente checkpoint: ${distance.toFixed(2)} metros`);
        
        // Actualizar el círculo de detección para que siempre tenga el radio definido
        if (userLocationCircle) {
            userLocationCircle.setRadius(detectionRadius);
        }
        
        // Si está dentro del radio de detección
        if (distance <= detectionRadius) {
            // Añadir el checkpoint al mapa SOLO cuando esté dentro del radio
            // Verificar si ya existe este marcador
            let markerExists = false;
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker && layer !== userMarker) {
                    // Si hay otro marcador que no es el usuario, asumimos que es el checkpoint
                    markerExists = true;
                }
            });
            
            // Si no existe el marcador, crearlo
            if (!markerExists) {
                console.log('Mostrando checkpoint en el mapa - estás en el radio de detección');
                const marker = L.marker([nextCheckpoint.lat, nextCheckpoint.lng], { icon: checkpointPendingIcon })
                    .addTo(map);

                marker.bindPopup(`
                    <div class="checkpoint-popup">
                        <h3>${nextCheckpoint.name}</h3>
                        <p>Estado: <span style="color: red;">Pendiente</span></p>
                        <button class="btn-primary" onclick="showCheckpointDetail(${nextCheckpoint.id})">Ver detalle</button>
                    </div>
                `);
            }
            
            // Mostrar el modal con la prueba
            showCheckpointProximityAlert(nextCheckpoint);
        } else {
            // Si está fuera del radio, quitar el marcador del checkpoint si existe
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker && layer !== userMarker) {
                    map.removeLayer(layer);
                }
            });
        }
    }

    // Función para mostrar una alerta cuando estamos cerca de un checkpoint
    function showCheckpointProximityAlert(checkpoint) {
        // Verificar si ya se mostró la alerta para este checkpoint
        if (checkpoint.alertShown) return;
        
        // Marcar como mostrada para no repetir
        checkpoint.alertShown = true;
        
        // Crear el modal de alerta
        const alertModal = document.createElement('div');
        alertModal.className = 'modal fade';
        alertModal.id = 'checkpointAlertModal';
        alertModal.setAttribute('tabindex', '-1');
        alertModal.setAttribute('aria-labelledby', 'checkpointAlertModalLabel');
        alertModal.setAttribute('aria-hidden', 'true');
        
        alertModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="checkpointAlertModalLabel">
                            <i class="fas fa-map-marker-alt me-2"></i>¡Checkpoint encontrado!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>¡Has llegado al checkpoint <strong>${checkpoint.name}</strong>!
                        </div>
                        <p><strong>Descripción:</strong> ${checkpoint.descripcion || 'No disponible'}</p>
                        <p><strong>Prueba a realizar:</strong> ${checkpoint.prueba || 'No disponible'}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="validarCheckpoint(${checkpoint.id})">
                            <i class="fas fa-check me-1"></i>Completar prueba
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(alertModal);
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('checkpointAlertModal'));
        modal.show();
        
        // Reproducir sonido de alerta
        const alertSound = new Audio('/sounds/checkpoint-alert.mp3');
        alertSound.play().catch(e => console.log('Error al reproducir sonido:', e));
        
        // Eliminar el modal cuando se cierre
        document.getElementById('checkpointAlertModal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(alertModal);
        });
    }

    // Función para validar un checkpoint (simulada)
    function validarCheckpoint(checkpointId) {
        // Simulación de validación (en una app real, esto haría una petición al servidor)
        const checkpoint = checkpointsData.find(cp => cp.id === checkpointId);
        if (checkpoint) {
            checkpoint.completed = true;
            
            // Mostrar toast de éxito
            showToast(`¡Checkpoint "${checkpoint.name}" completado con éxito!`, "success");
            
            // Cerrar el modal si está abierto
            const modal = bootstrap.Modal.getInstance(document.getElementById('checkpointAlertModal'));
            if (modal) modal.hide();
            
            // Actualizar el mapa para mostrar el siguiente checkpoint
            updateMapWithNextGroupCheckpoint();
        }
    }

    // Función para mostrar un mensaje cuando no hay checkpoints
    function showNoCheckpointsMessage(message) {
        document.getElementById('hintPanel').innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> <strong>Atención:</strong> ${message}
            </div>
        `;
        document.getElementById('hintPanel').style.display = 'block';
    }

    // Función para actualizar el mapa con el siguiente checkpoint pendiente para el grupo
    function updateMapWithNextGroupCheckpoint() {
        // Limpiar marcadores existentes
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && layer !== userMarker) {
                map.removeLayer(layer);
            }
        });
        
        // Encontrar el primer checkpoint no completado por el grupo
        const nextCheckpoint = checkpointsData.find(checkpoint => !checkpoint.completed);
        
        if (!nextCheckpoint) {
            showNoCheckpointsMessage('¡Tu grupo ha completado todos los checkpoints de la gimcana!'); 
            return;
        }
        
        console.log('Siguiente checkpoint para el grupo:', nextCheckpoint);
        
        // Mostrar SOLO la pista del siguiente checkpoint (no la prueba)
        document.getElementById('hintPanel').innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> <strong>Pista para llegar al checkpoint:</strong> ${nextCheckpoint.pista}
                <button class="btn-sm btn-primary float-end ms-2" id="verDetalleBtn">Ver detalles</button>
            </div>
        `;
        document.getElementById('hintPanel').style.display = 'block';
        
        // Añadir el event listener al botón
        document.getElementById('verDetalleBtn').addEventListener('click', function() {
            showCheckpointDetail(nextCheckpoint.id);
        });
    }

    // Función para mostrar detalles de un checkpoint
    function showCheckpointDetail(checkpointId) {
        const checkpoint = checkpointsData.find(cp => cp.id === checkpointId);
        if (!checkpoint) return;
        
        // Crear el modal de detalles
        const detailModal = document.createElement('div');
        detailModal.className = 'modal fade';
        detailModal.id = 'checkpointDetailModal';
        detailModal.setAttribute('tabindex', '-1');
        detailModal.setAttribute('aria-labelledby', 'checkpointDetailModalLabel');
        detailModal.setAttribute('aria-hidden', 'true');
        
        detailModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title" id="checkpointDetailModalLabel">
                            <i class="fas fa-info-circle me-2"></i>Detalles del Checkpoint
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h4>${checkpoint.name}</h4>
                        <p><strong>Pista:</strong> ${checkpoint.pista}</p>
                        <p><strong>Descripción:</strong> ${checkpoint.descripcion || 'No disponible'}</p>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>Debes llegar físicamente al checkpoint para ver la prueba.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailModal);
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('checkpointDetailModal'));
        modal.show();
        
        // Eliminar el modal cuando se cierre
        document.getElementById('checkpointDetailModal').addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(detailModal);
        });
    }

    // =====================================================================
    // FUNCIONES PARA FAVORITOS
    // =====================================================================

    // Carga los favoritos del usuario
    function loadFavorites() {
        if (!authCheck) return;
        
        fetch('/favorites')
            .then(response => response.json())
            .then(data => {
                if (data.favorites && data.favorites.length > 0) {
                    const favoritesList = document.getElementById('favoritesList');
                    favoritesList.innerHTML = '';
                    
                    data.favorites.forEach(favorite => {
                        const categoryIcon = getCategoryIcon(favorite.place?.category?.name || 'default');
                        
                        // Crear elemento de lista para cada favorito
                        const favoriteItem = document.createElement('div');
                        favoriteItem.className = 'favorite-item';
                        
                        // Determinar si es un lugar o una ruta
                        if (favorite.type === 'route') {
                            // Es una ruta favorita
                            favoriteItem.innerHTML = `
                                <div class="favorite-icon">
                                    <i class="fas fa-route"></i>
                                </div>
                                <div class="favorite-info">
                                    <div class="favorite-name">Ruta a ${favorite.place ? favorite.place.nombre : 'Destino'}</div>
                                    <div class="favorite-meta">
                                        <span><i class="fas fa-road me-1"></i>${(favorite.route_data.distance / 1000).toFixed(1)} km</span>
                                        <span><i class="fas fa-clock me-1"></i>${Math.round(favorite.route_data.time / 60)} min</span>
                                    </div>
                                </div>
                                <div class="favorite-actions">
                                    <button class="btn btn-sm btn-outline-primary view-route-btn" 
                                            data-start="${favorite.route_data.start}" 
                                            data-end="${favorite.route_data.end}"
                                            title="Ver ruta">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger remove-favorite-btn" 
                                            data-id="${favorite.id}"
                                            title="Eliminar de favoritos">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `;
                        } else {
                            // Es un lugar favorito
                            favoriteItem.innerHTML = `
                                <div class="favorite-icon">
                                    <i class="${categoryIcon.icon}" style="color: ${categoryIcon.color};"></i>
                                </div>
                                <div class="favorite-info">
                                    <div class="favorite-name">${favorite.place ? favorite.place.nombre : 'Lugar sin nombre'}</div>
                                    <div class="favorite-meta">
                                        <span>${favorite.place ? favorite.place.category?.name || 'Sin categoría' : 'Sin categoría'}</span>
                                    </div>
                                </div>
                                <div class="favorite-actions">
                                    <button class="btn btn-sm btn-outline-primary view-location-btn" 
                                            data-lat="${favorite.place ? favorite.place.coordenadas_lat : 0}" 
                                            data-lon="${favorite.place ? favorite.place.coordenadas_lon : 0}"
                                            title="Ver ubicación">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-success create-route-btn" 
                                            data-lat="${favorite.place ? favorite.place.coordenadas_lat : 0}" 
                                            data-lon="${favorite.place ? favorite.place.coordenadas_lon : 0}"
                                            title="Crear ruta">
                                        <i class="fas fa-route"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger remove-favorite-btn" 
                                            data-id="${favorite.id}"
                                            title="Eliminar de favoritos">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `;
                        }
                        
                        favoritesList.appendChild(favoriteItem);
                    });
                    
                    // Configurar eventos para los botones de favoritos
                    setupFavoriteButtonEvents();
                } else {
                    document.getElementById('favoritesList').innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados.
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error al cargar favoritos:', error);
                document.getElementById('favoritesList').innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>Error al cargar tus favoritos.
                    </div>
                `;
            });
    }

    // Configura los eventos para los botones de favoritos
    function setupFavoriteButtonEvents() {
        // Botones para ver ubicación
        document.querySelectorAll('.view-location-btn').forEach(button => {
            button.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lon = parseFloat(this.getAttribute('data-lon'));
                
                if (lat && lon) {
                    // Centrar el mapa en la ubicación
                    centerMap(lat, lon);
                    
                    // Cerrar el panel de favoritos en móvil
                    document.getElementById('favorites-panel').classList.remove('visible');
                    
                    // Mostrar toast de confirmación
                    showToast('Ubicación centrada en el mapa', 'info');
                }
            });
        });
        
        // Botones para crear ruta
        document.querySelectorAll('.create-route-btn').forEach(button => {
            button.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lon = parseFloat(this.getAttribute('data-lon'));
                
                if (lat && lon) {
                    // Crear ruta hasta el lugar
                    createRoute(lat, lon);
                    
                    // Cerrar el panel de favoritos en móvil
                    document.getElementById('favorites-panel').classList.remove('visible');
                }
            });
        });
        
        // Botones para ver ruta guardada
        document.querySelectorAll('.view-route-btn').forEach(button => {
            button.addEventListener('click', function() {
                const startCoords = this.getAttribute('data-start').split(',');
                const endCoords = this.getAttribute('data-end').split(',');
                
                if (startCoords.length === 2 && endCoords.length === 2) {
                    const startLat = parseFloat(startCoords[0]);
                    const startLng = parseFloat(startCoords[1]);
                    const endLat = parseFloat(endCoords[0]);
                    const endLng = parseFloat(endCoords[1]);
                    
                    // Si ya existe una ruta, eliminarla
                    if (routeControl) {
                        map.removeControl(routeControl);
                    }
                    
                    // Crear la ruta guardada
                    routeControl = L.Routing.control({
                        waypoints: [
                            L.latLng(startLat, startLng),
                            L.latLng(endLat, endLng)
                        ],
                        routeWhileDragging: false,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: true,
                        showAlternatives: false,
                        lineOptions: {
                            styles: [
                                {color: 'black', opacity: 0.15, weight: 9},
                                {color: 'white', opacity: 0.8, weight: 6},
                                {color: '#0073FF', opacity: 1, weight: 4}
                            ]
                        },
                        router: L.Routing.osrmv1({
                            serviceUrl: 'https://router.project-osrm.org/route/v1',
                            profile: 'car'
                        }),
                        createMarker: function() { return null; } // No crear marcadores adicionales
                    }).addTo(map);
                    
                    // Ocultar las instrucciones detalladas de la ruta
                    routeControl.hide();
                    
                    // Cerrar el panel de favoritos en móvil
                    document.getElementById('favorites-panel').classList.remove('visible');
                    
                    // Mostrar toast de confirmación
                    showToast('Ruta cargada desde favoritos', 'success');
                }
            });
        });
        
        // Botones para eliminar favorito
        document.querySelectorAll('.remove-favorite-btn').forEach(button => {
            button.addEventListener('click', function() {
                const favoriteId = this.getAttribute('data-id');
                
                if (confirm('¿Estás seguro de que quieres eliminar este favorito?')) {
                    fetch(`/favorites/${favoriteId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Eliminar el elemento de la lista
                            this.closest('.favorite-item').remove();
                            
                            // Mostrar toast de confirmación
                            showToast('Favorito eliminado correctamente', 'success');
                            
                            // Si no quedan favoritos, mostrar mensaje
                            if (document.querySelectorAll('.favorite-item').length === 0) {
                                document.getElementById('favoritesList').innerHTML = `
                                    <div class="alert alert-info">
                                        <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados.
                                    </div>
                                `;
                            }
                        } else {
                            showToast('Error al eliminar el favorito', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar favorito:', error);
                        showToast('Error al eliminar el favorito', 'error');
                    });
                }
            });
        });
    }

    // Obtiene el icono de categoría para un lugar
    function getCategoryIcon(category) {
        return categoryIcons[category] || categoryIcons['default'];
    }

    // Verifica si un lugar es favorito
    function checkIfFavorite(placeId, marker) {
        if (!authCheck) return;
        
        fetch(`/favorites/check/${placeId}`)
            .then(response => response.json())
            .then(data => {
                const popup = marker.getPopup();
                const popupContent = popup.getContent();
                const favoriteBtn = popup._contentNode.querySelector('.favorite-btn');
                const favoriteText = popup._contentNode.querySelector('.favorite-text');
                
                if (data.isFavorite) {
                    favoriteBtn.classList.add('active');
                    favoriteText.textContent = 'Guardado';
                } else {
                    favoriteBtn.classList.remove('active');
                    favoriteText.textContent = 'Favorito';
                }
                
                // Configurar el evento click para el botón de favorito
                favoriteBtn.onclick = function() {
                    toggleFavorite(placeId, favoriteBtn, favoriteText);
                };
            })
            .catch(error => {
                console.error('Error al verificar favorito:', error);
            });
    }

    // Alterna el estado de favorito de un lugar
    function toggleFavorite(placeId, button, textElement, callback) {
        if (!authCheck) {
            showToast('Debes iniciar sesión para guardar favoritos', 'warning');
            return;
        }
        
        const isActive = button.classList.contains('active');
        const method = isActive ? 'DELETE' : 'POST';
        const url = isActive ? `/favorites/${placeId}` : '/favorites';
        
        const data = isActive ? {} : { place_id: placeId };
        
        fetch(url, {
            method: method,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: isActive ? null : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (isActive) {
                    button.classList.remove('active');
                    textElement.textContent = 'Favorito';
                    showToast('Eliminado de favoritos', 'info');
                } else {
                    button.classList.add('active');
                    textElement.textContent = 'Guardado';
                    showToast('Añadido a favoritos', 'success');
                }
                
                // Recargar la lista de favoritos
                loadFavorites();
                
                // Ejecutar callback si existe
                if (callback) callback(data);
            } else {
                showToast(data.message || 'Error al actualizar favorito', 'error');
            }
        })
        .catch(error => {
            console.error('Error al actualizar favorito:', error);
            showToast('Error al actualizar favorito', 'error');
        });
    }

    // Guarda una ruta como favorito
    function saveRouteAsFavorite(routeData) {
        if (!authCheck) {
            showToast('Debes iniciar sesión para guardar favoritos', 'warning');
            return;
        }
        
        // Verificar si tenemos un placeId válido
        if (!routeData.placeId) {
            showToast('No se puede guardar la ruta sin un destino válido', 'warning');
            return;
        }
        
        fetch('/favorites/route', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(routeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Ruta guardada en favoritos', 'success');
                
                // Recargar la lista de favoritos
                loadFavorites();
                
                // Ocultar el botón de guardar ruta
                const routeButtonsContainer = document.getElementById('routeButtonsContainer');
                if (routeButtonsContainer) {
                    routeButtonsContainer.style.display = 'none';
                }
            } else {
                showToast(data.message || 'Error al guardar la ruta', 'error');
            }
        })
        .catch(error => {
            console.error('Error al guardar ruta:', error);
            showToast('Error al guardar la ruta', 'error');
        });
    }

    // Encuentra el ID de un lugar por sus coordenadas
    function findPlaceIdByCoordinates(lat, lng, tolerance = 0.0001) {
        if (!placesData || placesData.length === 0) return null;
        
        const place = placesData.find(p => 
            Math.abs(p.coordenadas_lat - lat) < tolerance && 
            Math.abs(p.coordenadas_lon - lng) < tolerance
        );
        
        return place ? place.id : null;
    }

    // Muestra información sobre la ruta
    function showRouteInfo(name, distance, time) {
        // Formatear distancia y tiempo
        const distanceKm = (distance / 1000).toFixed(1);
        const timeMin = Math.round(time / 60);
        
        // Crear o actualizar el panel de información de ruta
        let routeInfoPanel = document.getElementById('routeInfoPanel');
        if (!routeInfoPanel) {
            routeInfoPanel = document.createElement('div');
            routeInfoPanel.id = 'routeInfoPanel';
            routeInfoPanel.className = 'route-info-panel';
            document.body.appendChild(routeInfoPanel);
        }
        
        routeInfoPanel.innerHTML = `
            <div class="route-info-header">
                <i class="fas fa-route me-2"></i>${name}
                <button type="button" class="btn-close" id="closeRouteInfo"></button>
            </div>
            <div class="route-info-content">
                <div class="route-info-item">
                    <i class="fas fa-road me-2"></i>
                    <span>${distanceKm} km</span>
                </div>
                <div class="route-info-item">
                    <i class="fas fa-clock me-2"></i>
                    <span>${timeMin} min</span>
                </div>
            </div>
        `;
        
        routeInfoPanel.style.display = 'block';
        
        // Configurar el evento para cerrar el panel
        document.getElementById('closeRouteInfo').addEventListener('click', function() {
            routeInfoPanel.style.display = 'none';
            
            // Si hay una ruta, eliminarla
            if (routeControl) {
                map.removeControl(routeControl);
                routeControl = null;
            }
            
            // Ocultar el botón de guardar ruta
            const routeButtonsContainer = document.getElementById('routeButtonsContainer');
            if (routeButtonsContainer) {
                routeButtonsContainer.style.display = 'none';
            }
        });
    }

    // =====================================================================
    // FUNCIONES PARA NOTIFICACIONES
    // =====================================================================

    // Muestra una notificación toast
    function showToast(message, type = 'info') {
        // Configurar el color según el tipo
        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = '#28a745';
                icon = 'fa-check-circle';
                break;
            case 'warning':
                bgColor = '#ffc107';
                icon = 'fa-exclamation-triangle';
                break;
            case 'error':
                bgColor = '#dc3545';
                icon = 'fa-exclamation-circle';
                break;
            default: // info
                bgColor = '#17a2b8';
                icon = 'fa-info-circle';
        }
        
        // Crear el contenedor de toasts si no existe
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Crear el toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.backgroundColor = bgColor;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        // Añadir el toast al contenedor
        toastContainer.appendChild(toast);
        
        // Configurar el evento para cerrar el toast
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
        
        // Eliminar el toast automáticamente después de 5 segundos
        setTimeout(() => {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    // =====================================================================
    // FUNCIONES DE GEOLOCALIZACIÓN Y SEGUIMIENTO
    // =====================================================================

    // Función para iniciar el seguimiento de la ubicación del usuario
    function startLocationTracking() {
        if (navigator.geolocation) {
            // Iniciar el seguimiento continuo
            watchId = navigator.geolocation.watchPosition(
                positionUpdateHandler,
                handleGeolocationError,
                opcionesGPS
            );
            
            // Actualizar la interfaz para mostrar que el seguimiento está activo
            updateTrackingUI(true);
            
            // Establecer un intervalo para actualizar la posición cada 10 segundos
            // Esto es útil para simular movimiento incluso cuando el GPS no reporta cambios
            updateInterval = setInterval(function() {
                if (userMarker) {
                    // Simulamos un pequeño movimiento aleatorio para dar sensación de movimiento
                    // (esto es solo para demostración, en una app real usaríamos solo los datos del GPS)
                    const currentPos = userMarker.getLatLng();
                    const randomLat = (Math.random() - 0.5) * 0.0002; // Pequeño cambio aleatorio en latitud
                    const randomLng = (Math.random() - 0.5) * 0.0002; // Pequeño cambio aleatorio en longitud
                    
                    const newPos = {
                        coords: {
                            latitude: currentPos.lat + randomLat,
                            longitude: currentPos.lng + randomLng,
                            accuracy: 10 // Precisión simulada en metros
                        }
                    };
                    
                    positionUpdateHandler(newPos);
                    
                    // Verificar proximidad a checkpoints (compatibilidad con mapa.js)
                    checkProximityToNextCheckpoint();
                }
            }, 10000); // Actualizar cada 10 segundos
            
            isTracking = true;
            
            // Mostrar notificación
            showToast("Seguimiento de ubicación activado", "success");
        } else {
            showToast("Tu navegador no soporta geolocalización", "error");
        }
    }

    // Función para detener el seguimiento cuando el usuario lo solicita
    function stopLocationTracking() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        
        isTracking = false;
        updateTrackingUI(false);
        showToast("Seguimiento de ubicación desactivado", "info");
    }

    // Manejador de actualización de posición
    function positionUpdateHandler(position) {
        userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        // Si es la primera vez, centrar el mapa en la posición del usuario
        if (!userMarker) {
            centerMap(userPosition.lat, userPosition.lng);
            createUserMarker();
            
            // Crear círculo de detección alrededor del usuario (como en mapa.js)
            userLocationCircle = L.circle([userPosition.lat, userPosition.lng], {
                radius: detectionRadius,
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.1,
                weight: 2
            }).addTo(map);
        } else {
            // Actualizar la posición del marcador y del círculo
            userMarker.setLatLng([userPosition.lat, userPosition.lng]);
            
            if (userLocationCircle) {
                userLocationCircle.setLatLng([userPosition.lat, userPosition.lng]);
                userLocationCircle.setRadius(detectionRadius);
            }
        }
        
        // Actualizar la ruta si existe
        if (routeControl) {
            updateRoute(routeControl.getWaypoints()[1]);
        }
        
        // Verificar proximidad a checkpoints (compatibilidad con mapa.js)
        checkProximityToNextCheckpoint();
    }

    // Maneja los errores de geolocalización mostrando mensajes apropiados
    function handleGeolocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.warn("Permiso denegado por el usuario.");
                showToast("Debes permitir el acceso a tu ubicación para usar esta función", "error");
                break;
            case error.POSITION_UNAVAILABLE:
                console.warn("La información de ubicación no está disponible.");
                showToast("No se pudo obtener tu ubicación. Usando ubicación por defecto", "warning");
                break;
            case error.TIMEOUT:
                console.warn("Se ha excedido el tiempo de espera para obtener la ubicación.");
                showToast("Tu ubicación tardó demasiado en cargarse. Usando ubicación por defecto", "warning");
                break;
            default:
                console.warn(`Error desconocido: ${error.message}`);
                showToast("Ocurrió un error desconocido. Usando ubicación por defecto", "error");
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
            
            // Crear círculo de detección alrededor del usuario (como en mapa.js)
            userLocationCircle = L.circle([userPosition.lat, userPosition.lng], {
                radius: detectionRadius,
                color: '#3388ff',
                fillColor: '#3388ff',
                fillOpacity: 0.1,
                weight: 2
            }).addTo(map);
        } else {
            userMarker.setLatLng([userPosition.lat, userPosition.lng]);
            
            if (userLocationCircle) {
                userLocationCircle.setLatLng([userPosition.lat, userPosition.lng]);
            }
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
    // FUNCIONES PARA SEGUIMIENTO DE UBICACIÓN
    // =====================================================================

    // Inicia el seguimiento de la ubicación del usuario
    function startTracking() {
        if (!isTracking) {
            startLocationTracking();
        }
    }

    // Detiene el seguimiento de la ubicación del usuario
    function stopTracking() {
        if (isTracking) {
            stopLocationTracking();
        }
    }

    // Actualiza la interfaz de usuario para reflejar el estado del seguimiento
    function updateTrackingUI(isActive) {
        const trackingButton = document.getElementById('trackingButton');
        const trackingIcon = document.getElementById('trackingIcon');
        
        if (isActive) {
            if (trackingButton) {
                trackingButton.classList.add('active');
                trackingButton.setAttribute('title', 'Desactivar seguimiento');
            }
            
            if (trackingIcon) {
                trackingIcon.classList.add('location-active');
            }
            
            // Actualizar botón en el encabezado móvil
            const headerLocationBtn = document.getElementById('headerLocationBtn');
            if (headerLocationBtn) {
                headerLocationBtn.classList.add('location-active');
                headerLocationBtn.setAttribute('title', 'Ubicación activa');
            }
        } else {
            if (trackingButton) {
                trackingButton.classList.remove('active');
                trackingButton.setAttribute('title', 'Activar seguimiento');
            }
            
            if (trackingIcon) {
                trackingIcon.classList.remove('location-active');
            }
            
            // Actualizar botón en el encabezado móvil
            const headerLocationBtn = document.getElementById('headerLocationBtn');
            if (headerLocationBtn) {
                headerLocationBtn.classList.remove('location-active');
                headerLocationBtn.setAttribute('title', 'Activar ubicación');
            }
        }
    }

    // =====================================================================
    // EVENTOS Y INICIALIZACIÓN
    // =====================================================================

    // Evento para el botón de ubicación
    document.getElementById('headerLocationBtn').addEventListener('click', function() {
        if (isTracking) {
            stopTracking();
        } else {
            startTracking();
        }
    });

    // Evento para el botón de favoritos
    document.getElementById('headerFavoritesBtn').addEventListener('click', function() {
        document.getElementById('favorites-panel').classList.toggle('visible');
        loadFavorites();
    });

    // Evento para cerrar el panel de favoritos
    document.getElementById('closeFavorites').addEventListener('click', function() {
        document.getElementById('favorites-panel').classList.remove('visible');
    });

    // Evento para el botón de búsqueda
    document.getElementById('headerSearchBtn').addEventListener('click', function() {
        document.getElementById('search-container').classList.toggle('visible');
        document.getElementById('searchInputMobile').focus();
    });

    // Evento para el botón de búsqueda en móvil
    document.getElementById('searchButtonMobile').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInputMobile').value.trim();
        if (searchTerm) {
            searchPlaces(searchTerm);
        }
    });

    // Evento para la tecla Enter en el campo de búsqueda
    document.getElementById('searchInputMobile').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                searchPlaces(searchTerm);
            }
        }
    });

    // Función para buscar lugares
    function searchPlaces(term) {
        if (!placesData || placesData.length === 0) {
            showToast('No hay lugares disponibles para buscar', 'warning');
            return;
        }
        
        // Filtrar lugares por nombre o descripción
        const results = placesData.filter(place => 
            place.nombre.toLowerCase().includes(term.toLowerCase()) || 
            place.descripcion.toLowerCase().includes(term.toLowerCase())
        );
        
        if (results.length > 0) {
            // Crear o actualizar el panel de resultados
            let resultsPanel = document.getElementById('searchResultsPanel');
            if (!resultsPanel) {
                resultsPanel = document.createElement('div');
                resultsPanel.id = 'searchResultsPanel';
                resultsPanel.className = 'search-results-panel';
                document.body.appendChild(resultsPanel);
            }
            
            // Generar HTML para los resultados
            let resultsHTML = `
                <div class="results-header">
                    <h5>Resultados de búsqueda (${results.length})</h5>
                    <button type="button" class="btn-close" id="closeResults"></button>
                </div>
                <div class="results-list">
            `;
            
            results.forEach(place => {
                const categoryIcon = getCategoryIcon(place.category?.name || 'default');
                resultsHTML += `
                    <div class="result-item" data-lat="${place.coordenadas_lat}" data-lon="${place.coordenadas_lon}">
                        <div class="result-icon">
                            <i class="fas ${categoryIcon.icon}" style="color: ${categoryIcon.color};"></i>
                        </div>
                        <div class="result-info">
                            <div class="result-name">${place.nombre}</div>
                            <div class="result-category">${place.category?.name || 'Sin categoría'}</div>
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += `</div>`;
            resultsPanel.innerHTML = resultsHTML;
            resultsPanel.style.display = 'block';
            
            // Ocultar el panel de búsqueda
            document.getElementById('search-container').classList.remove('visible');
            
            // Configurar eventos para los resultados
            document.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const lat = parseFloat(this.getAttribute('data-lat'));
                    const lon = parseFloat(this.getAttribute('data-lon'));
                    
                    // Centrar el mapa en el lugar
                    centerMap(lat, lon);
                    
                    // Buscar el marcador correspondiente y abrirlo
                    placeMarkers.forEach(marker => {
                        const markerLat = marker.getLatLng().lat;
                        const markerLng = marker.getLatLng().lng;
                        
                        if (Math.abs(markerLat - lat) < 0.0001 && Math.abs(markerLng - lon) < 0.0001) {
                            marker.openPopup();
                        }
                    });
                    
                    // Cerrar el panel de resultados
                    resultsPanel.style.display = 'none';
                });
            });
            
            // Configurar el evento para cerrar el panel
            document.getElementById('closeResults').addEventListener('click', function() {
                resultsPanel.style.display = 'none';
            });
        } else {
            showToast('No se encontraron lugares que coincidan con tu búsqueda', 'info');
        }
    }

    // Cargar lugares en el mapa
    loadPlacesOnMap();
    
    // Ajustar el tamaño del mapa al cargar y redimensionar
    setTimeout(() => map.invalidateSize(), 100);
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
    
    // Iniciar seguimiento de ubicación automáticamente si está en móvil
    if (window.innerWidth < 768) {
        setTimeout(startTracking, 1000);
    }
});

// =====================================================================
// FUNCIONES GLOBALES (accesibles desde HTML)
// =====================================================================

// Función para crear ruta
function createRoute(lat, lon) {
    if (typeof lat === 'number' && typeof lon === 'number') {
        const endPoint = L.latLng(lat, lon);
        updateRoute(endPoint);
    }
}

// Función para guardar ruta como favorito
function saveRouteAsFavorite(routeData) {
    if (!routeData) return;
    
    const data = {
        name: routeData.name || 'Ruta sin nombre',
        start_lat: routeData.start.lat,
        start_lng: routeData.start.lng,
        end_lat: routeData.end.lat,
        end_lng: routeData.end.lng,
        distance: routeData.distance,
        time: routeData.time
    };
    
    fetch('/favorites/route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Ruta guardada como favorito', 'success');
            loadFavorites(); // Recargar favoritos
        } else {
            showToast(data.message || 'Error al guardar la ruta', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error al guardar la ruta', 'error');
    });
}

// Función para mostrar un lugar en el mapa
function showPlace(lat, lon, name) {
    if (typeof lat === 'number' && typeof lon === 'number') {
        centerMap(lat, lon);
        
        // Crear un marcador temporal para el lugar
        const placeMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${name || 'Lugar'}</b>`)
            .openPopup();
            
        // Eliminar el marcador después de 5 segundos
        setTimeout(() => {
            map.removeLayer(placeMarker);
        }, 5000);
    }
}

// Función para mostrar notificaciones toast
function showToast(message, type) {
    if (typeof Toastify === 'function') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'error' ? "#e74c3c" : 
                            type === 'success' ? "#2ecc71" : 
                            type === 'warning' ? "#f39c12" : "#3498db",
            className: "toast-notification"
        }).showToast();
    } else {
        alert(message);
    }
}
