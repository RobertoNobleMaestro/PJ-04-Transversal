// =====================================================================
// SCRIPT DE FAVORITOS - TURGIMCANA
// =====================================================================
// Este script gestiona la funcionalidad de favoritos, incluyendo:
// - Visualización del mapa con ubicaciones favoritas
// - Creación de rutas hacia lugares favoritos
// - Gestión (añadir/eliminar) de lugares favoritos
// - Búsqueda de lugares para añadir a favoritos

document.addEventListener('DOMContentLoaded', function() {
    // =====================================================================
    // VARIABLES GLOBALES
    // =====================================================================
    let map;                // Objeto mapa de Leaflet
    let routeControl;       // Control de rutas de Leaflet
    let userMarker;         // Marcador de la posición del usuario
    let userPosition = null; // Coordenadas del usuario {lat, lng}
    let placeMarkers = [];   // Array de marcadores de lugares favoritos
    
    // =====================================================================
    // INICIALIZACIÓN DEL MAPA
    // =====================================================================
    
    /**
     * Inicializa el mapa de Leaflet cuando sea necesario
     * - Crea el mapa centrado en Barcelona por defecto
     * - Añade la capa base de OpenStreetMap
     * - Obtiene la ubicación del usuario si está disponible
     */
    function initMap() {
        // Si el mapa ya está inicializado, no hacer nada
        if (map) return;
        
        // Crear el mapa
        map = L.map('favorites-map').setView([41.3851, 2.1734], 13);
        
        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Crear marcador para el usuario
                    userMarker = L.marker([userPosition.lat, userPosition.lng], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<i class="fas fa-circle-user fa-2x text-primary"></i>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    }).addTo(map)
                    .bindPopup('<b>Tu ubicación</b>');
                    
                    // Cargar los marcadores de favoritos
                    loadFavoriteMarkers();
                },
                error => {
                    console.warn("Error de geolocalización: ", error.message);
                    userPosition = { lat: 41.3851, lng: 2.1734 }; // Barcelona por defecto
                    loadFavoriteMarkers();
                }
            );
        } else {
            userPosition = { lat: 41.3851, lng: 2.1734 }; // Barcelona por defecto
            loadFavoriteMarkers();
        }
    }
    
    // =====================================================================
    // GESTIÓN DE MARCADORES
    // =====================================================================
    
    /**
     * Carga los marcadores de los lugares favoritos en el mapa
     * - Limpia marcadores existentes
     * - Crea un marcador para cada lugar favorito
     * - Ajusta la vista del mapa para mostrar todos los marcadores
     */
    function loadFavoriteMarkers() {
        // Limpiar marcadores existentes
        placeMarkers.forEach(marker => map.removeLayer(marker));
        placeMarkers = [];
        
        // Obtener todos los elementos con coordenadas
        document.querySelectorAll('.show-on-map').forEach(button => {
            const lat = parseFloat(button.dataset.lat);
            const lng = parseFloat(button.dataset.lng);
            const name = button.dataset.name;
            
            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'place-marker',
                        html: '<i class="fas fa-map-marker-alt fa-2x text-danger"></i>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 24]
                    })
                }).addTo(map)
                .bindPopup(`<b>${name}</b>`);
                
                placeMarkers.push(marker);
            }
        });
        
        // Ajustar la vista para mostrar todos los marcadores
        if (placeMarkers.length > 0) {
            const allMarkers = [...placeMarkers];
            if (userMarker) allMarkers.push(userMarker);
            const bounds = L.latLngBounds(allMarkers.map(m => m.getLatLng()));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    // =====================================================================
    // FUNCIONES PARA RUTAS
    // =====================================================================
    
    /**
     * Muestra una ruta en el mapa desde la ubicación del usuario hasta un destino
     * @param {number} lat - Latitud del destino
     * @param {number} lng - Longitud del destino
     * @param {string} name - Nombre del lugar de destino
     */
    function showRoute(lat, lng, name) {
        // Mostrar el mapa si está oculto
        document.getElementById('map-container').classList.remove('d-none');
        
        // Centrar el mapa en el lugar
        map.setView([lat, lng], 15);
        
        // Actualizar el título
        document.getElementById('route-title').innerHTML = `<i class="fas fa-route me-2"></i>Ruta hacia ${name}`;
        document.getElementById('close-map').classList.remove('d-none');
        
        // Crear la ruta si tenemos la ubicación del usuario
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
                    
                    // Mostrar información de la ruta
                    document.getElementById('route-title').innerHTML = `
                        <div>
                            <h5><i class="fas fa-route me-2"></i>Ruta hacia ${name}</h5>
                            <div class="d-flex mt-2">
                                <div class="me-3">
                                    <i class="fas fa-road me-1"></i>${distance} km
                                </div>
                                <div>
                                    <i class="fas fa-clock me-1"></i>${time} min
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Hacer scroll hasta el mapa
                    document.getElementById('map-container').scrollIntoView({ behavior: 'smooth' });
                }
            });
        } else {
            // Si no tenemos la ubicación del usuario, mostrar un mensaje
            const routeInfoDiv = document.createElement('div');
            routeInfoDiv.innerHTML = `
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No se ha podido obtener tu ubicación actual. 
                    <button id="enable-location" class="btn btn-sm btn-warning ms-2">
                        <i class="fas fa-location-arrow me-1"></i>Activar ubicación
                    </button>
                </div>
            `;
            
            document.getElementById('route-title').innerHTML = `<i class="fas fa-route me-2"></i>Ruta hacia ${name}`;
            document.getElementById('route-title').appendChild(routeInfoDiv);
            
            // Añadir evento al botón de activar ubicación
            document.getElementById('enable-location').addEventListener('click', function() {
                startTracking();
            });
        }
        
        // Hacer scroll hasta el mapa
        document.getElementById('map-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    // =====================================================================
    // FUNCIONES DE GEOLOCALIZACIÓN
    // =====================================================================
    
    /**
     * Inicia el seguimiento de la ubicación del usuario
     * - Solicita la ubicación actual mediante la API de geolocalización
     * - Actualiza el marcador del usuario en el mapa
     */
    function startTracking() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Inicializar el mapa si aún no se ha hecho
                    if (!map) {
                        initMap();
                    } else if (!userMarker) {
                        // Crear marcador para el usuario
                        userMarker = L.marker([userPosition.lat, userPosition.lng], {
                            icon: L.divIcon({
                                className: 'user-marker',
                                html: '<i class="fas fa-circle-user fa-2x text-primary"></i>',
                                iconSize: [24, 24],
                                iconAnchor: [12, 12]
                            })
                        }).addTo(map)
                        .bindPopup('<b>Tu ubicación</b>');
                    } else {
                        // Actualizar posición del marcador
                        userMarker.setLatLng([userPosition.lat, userPosition.lng]);
                    }
                },
                error => {
                    console.warn("Error de geolocalización: ", error.message);
                    alert("No se ha podido obtener tu ubicación. Por favor, activa la geolocalización en tu navegador.");
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    }
    
    // =====================================================================
    // EVENTOS DE INTERFAZ DE USUARIO
    // =====================================================================
    
    // Evento para mostrar la ruta en el mapa
    document.querySelectorAll('.show-on-map').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                const lat = parseFloat(this.dataset.lat);
                const lng = parseFloat(this.dataset.lng);
                const name = this.dataset.name;
                
                // Inicializar el mapa si aún no se ha hecho
                if (!map) {
                    initMap();
                    // Esperar a que el mapa se inicialice completamente
                    setTimeout(() => {
                        showRoute(lat, lng, name);
                    }, 500);
                } else {
                    showRoute(lat, lng, name);
                }
            } catch (error) {
                console.error('Error al mostrar la ruta:', error);
            }
        });
    });
    
    // Evento para cerrar el mapa
    document.getElementById('close-map').addEventListener('click', function() {
        if (routeControl) {
            map.removeControl(routeControl);
            routeControl = null;
        }
        
        document.getElementById('route-title').textContent = 'Selecciona un lugar para ver la ruta';
        this.classList.add('d-none');
        
        // Mostrar todos los marcadores
        if (placeMarkers.length > 0) {
            const allMarkers = [...placeMarkers];
            if (userMarker) allMarkers.push(userMarker);
            const bounds = L.latLngBounds(allMarkers.map(m => m.getLatLng()));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    });
    
    // =====================================================================
    // GESTIÓN DE FAVORITOS
    // =====================================================================
    
    // Evento para eliminar un favorito
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                const placeId = this.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este lugar de tus favoritos?')) {
                    fetch(`/favorites/toggle/${placeId}`, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            // Eliminar la tarjeta del favorito
                            const card = this.closest('.col-md-6');
                            card.remove();
                            
                            // Eliminar el marcador del mapa
                            if (map) {
                                loadFavoriteMarkers();
                            }
                            
                            // Si no quedan favoritos, mostrar mensaje y ocultar mapa
                            if (document.querySelectorAll('#favorites-container .col-md-6').length === 0) {
                                document.getElementById('favorites-container').innerHTML = `
                                    <div class="col-12">
                                        <div class="alert alert-info">
                                            <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados. 
                                            <a href="/mapa" class="alert-link">Explora el mapa</a> y marca lugares como favoritos.
                                        </div>
                                    </div>
                                `;
                                document.getElementById('map-container').classList.add('d-none');
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            } catch (error) {
                console.error('Error al eliminar favorito:', error);
            }
        });
    });
    
    // =====================================================================
    // BÚSQUEDA DE LUGARES
    // =====================================================================
    
    // Funcionalidad para buscar y añadir lugares a favoritos
    document.getElementById('searchPlaceBtn')?.addEventListener('click', searchPlaces);
    document.getElementById('searchPlace')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPlaces();
        }
    });
    
    /**
     * Busca lugares según el término introducido por el usuario
     * - Realiza una petición AJAX al servidor
     * - Muestra los resultados en el modal
     */
    function searchPlaces() {
        const query = document.getElementById('searchPlace').value.trim();
        if (query.length < 2 && query.length > 0) {
            alert('Por favor, introduce al menos 2 caracteres para buscar.');
            return;
        }
        
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = `
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Buscando...</span>
                </div>
                <p class="mt-2">Buscando lugares...</p>
            </div>
        `;
        
        fetch(`/places/search?query=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resultados de búsqueda:', data);
                
                if (!data.places || data.places.length === 0) {
                    searchResults.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>No se encontraron lugares que coincidan con tu búsqueda.
                            <p class="mt-2 mb-0">Sugerencias:</p>
                            <ul class="mb-0">
                                <li>Verifica que la ortografía sea correcta</li>
                                <li>Intenta con términos más generales</li>
                                <li>Prueba con el nombre del lugar o su categoría</li>
                                <li>Deja el campo vacío para ver todos los lugares disponibles</li>
                            </ul>
                        </div>
                    `;
                    return;
                }
                
                let html = '<div class="list-group">';
                data.places.forEach(place => {
                    const categoryName = place.category ? place.category.name : 'Sin categoría';
                    html += `
                        <div class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-1">${place.nombre}</h6>
                                    <p class="mb-1 small text-muted">
                                        <span class="badge bg-primary">${categoryName}</span>
                                        <span class="ms-2">${place.direccion || 'Sin dirección'}</span>
                                    </p>
                                </div>
                                <button class="btn btn-sm btn-outline-danger add-to-favorite" data-id="${place.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                
                searchResults.innerHTML = html;
                
                // Añadir eventos a los botones de añadir a favoritos
                document.querySelectorAll('.add-to-favorite').forEach(button => {
                    button.addEventListener('click', function() {
                        const placeId = this.dataset.id;
                        addToFavorites(placeId, this);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                searchResults.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>Ha ocurrido un error al buscar lugares: ${error.message}
                        <p class="mt-2 mb-0">Por favor, intenta de nuevo más tarde o contacta al administrador.</p>
                    </div>
                `;
            });
    }
    
    /**
     * Añade o elimina un lugar de favoritos
     * @param {number} placeId - ID del lugar
     * @param {HTMLElement} button - Botón que ha sido pulsado
     */
    function addToFavorites(placeId, button) {
        try {
            fetch(`/favorites/toggle/${placeId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.isFavorite) {
                        // Cambiar el estilo del botón
                        button.classList.remove('btn-outline-danger');
                        button.classList.add('btn-danger');
                        
                        // Mostrar mensaje de éxito
                        alert('Lugar añadido a favoritos. Recarga la página para verlo en tu lista.');
                        
                        // Opcional: recargar la página para mostrar el nuevo favorito
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        // Si ya estaba en favoritos y se quitó
                        button.classList.remove('btn-danger');
                        button.classList.add('btn-outline-danger');
                        alert('Lugar eliminado de favoritos.');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } catch (error) {
            console.error('Error al añadir a favoritos:', error);
        }
    }
});
