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
    let favorites = [];      // Array para almacenar los favoritos cargados
    
    // =====================================================================
    // INICIALIZACIÓN
    // =====================================================================
    
    // Cargar favoritos mediante AJAX al iniciar la página
    loadFavoritesAjax();
    
    // Inicializar mapa si existe el elemento
    const mapContainer = document.getElementById('favorites-map');
    if (mapContainer) {
        initMap();
    }
    
    /**
     * Carga los favoritos del usuario mediante AJAX
     * - Realiza una petición fetch a la API
     * - Actualiza la interfaz con los resultados
     */
    function loadFavoritesAjax() {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const favoritesContainer = document.getElementById('favorites-container');
        
        // Mostrar indicador de carga
        if (favoritesContainer) {
            favoritesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">Cargando tus lugares favoritos...</p>
                </div>
            `;
        }
        
        // Realizar petición AJAX
        fetch('/favorites/list', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar favoritos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            favorites = data.favorites || [];
            
            // Actualizar la interfaz con los favoritos
            updateFavoritesUI(favorites);
            
            // Si el mapa está inicializado, cargar los marcadores
            if (map) {
                loadFavoriteMarkers();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (favoritesContainer) {
                favoritesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            Error al cargar tus favoritos: ${error.message}
                            <button class="btn btn-sm btn-outline-danger ms-3" onclick="window.location.reload()">
                                <i class="fas fa-sync-alt me-1"></i>Reintentar
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    /**
     * Actualiza la interfaz de usuario con los favoritos cargados
     * @param {Array} favorites - Array de objetos favoritos
     */
    function updateFavoritesUI(favorites) {
        const favoritesContainer = document.getElementById('favorites-container');
        
        if (!favoritesContainer) return;
        
        // Si no hay favoritos, mostrar mensaje
        if (!favorites || favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados. 
                        <a href="/mapa" class="alert-link">Explora el mapa</a> y marca lugares como favoritos.
                    </div>
                </div>
            `;
            return;
        }
        
        // Generar HTML para cada favorito
        let html = '';
        favorites.forEach(favorite => {
            const place = favorite.place;
            if (!place) return; // Ignorar favoritos sin lugar asociado
            
            const categoryName = place.category ? place.category.name : 'Sin categoría';
            const description = place.descripcion ? place.descripcion.substring(0, 100) + (place.descripcion.length > 100 ? '...' : '') : 'Sin descripción';
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4 favorite-card" data-id="${place.id}">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${place.nombre}</h5>
                            <p class="card-text small text-muted mb-2">
                                <span class="badge bg-primary">${categoryName}</span>
                            </p>
                            <p class="card-text">${description}</p>
                            <p class="card-text small text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i> ${place.direccion || 'Sin dirección'}
                            </p>
                            <div class="d-flex justify-content-between mt-3">
                                <button class="btn btn-sm btn-outline-primary show-on-map" 
                                    data-lat="${place.coordenadas_lat}" 
                                    data-lng="${place.coordenadas_lon}"
                                    data-name="${place.nombre}">
                                    <i class="fas fa-route me-1"></i>Ver ruta
                                </button>
                                <button class="btn btn-sm btn-outline-danger remove-favorite" data-id="${place.id}">
                                    <i class="fas fa-trash-alt me-1"></i>Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Actualizar el contenedor
        favoritesContainer.innerHTML = html;
        
        // Configurar eventos para los nuevos elementos
        setupEventListeners();
    }
    
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
        
        // Usar los favoritos cargados mediante AJAX
        if (!favorites || favorites.length === 0) return;
        
        favorites.forEach(favorite => {
            const place = favorite.place;
            if (!place) return;
            
            const lat = parseFloat(place.coordenadas_lat);
            const lng = parseFloat(place.coordenadas_lon);
            const name = place.nombre;
            
            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'place-marker',
                        html: '<i class="fas fa-map-marker-alt fa-2x text-danger"></i>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 24]
                    })
                }).addTo(map)
                .bindPopup(`
                    <div class="popup-content">
                        <h6>${name}</h6>
                        <p class="small">${place.direccion || ''}</p>
                        <button class="btn btn-sm btn-primary show-route-btn" 
                            onclick="document.querySelector('.show-on-map[data-lat=\\'${lat}\\']').click()">
                            <i class="fas fa-route me-1"></i>Ver ruta
                        </button>
                    </div>
                `);
                
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
    
    /**
     * Configura los event listeners para los elementos de la interfaz
     */
    function setupEventListeners() {
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
        
        // Evento para eliminar un favorito
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                try {
                    const placeId = this.dataset.id;
                    if (confirm('¿Estás seguro de que quieres eliminar este lugar de tus favoritos?')) {
                        const card = this.closest('.favorite-card');
                        // Añadir efecto de transición
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '0.5';
                        card.style.transform = 'translateY(-10px)';
                        
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
                                setTimeout(() => {
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
                                    
                                    // Mostrar notificación de éxito
                                    showToast('Lugar eliminado de favoritos', 'success');
                                }, 300);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            // Restaurar el estilo de la tarjeta si hay error
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }
                } catch (error) {
                    console.error('Error al eliminar favorito:', error);
                }
            });
        });
    }
    
    /**
     * Elimina un lugar de favoritos
     * @param {number} placeId - ID del lugar a eliminar
     * @param {HTMLElement} button - Botón que ha sido pulsado
     */
    function removeFavorite(placeId, button) {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        fetch(`/favorites/toggle/${placeId}`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Content-Type': 'application/json',
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
            if (data.success) {
                // Eliminar la tarjeta del favorito con animación
                const card = button.closest('.favorite-card');
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                // Actualizar el array de favoritos
                favorites = favorites.filter(favorite => favorite.place && favorite.place.id != placeId);
                
                setTimeout(() => {
                    card.remove();
                    
                    // Si no quedan favoritos, mostrar mensaje
                    if (document.querySelectorAll('.favorite-card').length === 0) {
                        updateFavoritesUI([]);
                    }
                    
                    // Actualizar los marcadores en el mapa
                    if (map) {
                        loadFavoriteMarkers();
                    }
                    
                    // Mostrar notificación
                    showToast('Lugar eliminado de favoritos', 'success');
                }, 300);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // No mostrar toast de error aquí
        });
    }
    
    /**
     * Muestra una notificación toast
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, info)
     */
    function showToast(message, type = 'info') {
        // Crear el contenedor de toasts si no existe
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Crear el toast
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Definir colores según el tipo
        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = '#28a745';
                icon = 'check-circle';
                break;
            case 'error':
                bgColor = '#dc3545';
                icon = 'exclamation-circle';
                break;
            default:
                bgColor = '#007bff';
                icon = 'info-circle';
        }
        
        // Contenido del toast
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto"><i class="fas fa-${icon}" style="color: ${bgColor};"></i> Notificación</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        // Añadir al contenedor
        toastContainer.appendChild(toast);
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
        
        // Evento para cerrar manualmente
        toast.querySelector('.btn-close').addEventListener('click', function() {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
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
                    const card = this.closest('.col-md-6');
                    // Añadir efecto de transición
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0.5';
                    card.style.transform = 'translateY(-10px)';
                    
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
                            setTimeout(() => {
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
                                
                                // Mostrar notificación de éxito
                                showToast('Lugar eliminado de favoritos', 'success');
                            }, 300);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Restaurar el estilo de la tarjeta si hay error
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
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
            showToast('Por favor, introduce al menos 2 caracteres para buscar.', 'warning');
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
        
        // Deshabilitar el botón de búsqueda durante la petición
        const searchButton = document.getElementById('searchPlaceBtn');
        if (searchButton) {
            searchButton.disabled = true;
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        }
        
        fetch(`/places/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                // Restaurar el botón de búsqueda
                if (searchButton) {
                    searchButton.disabled = false;
                    searchButton.innerHTML = '<i class="fas fa-search"></i> Buscar';
                }
                
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
                        <i class="fas fa-exclamation-circle me-2"></i>Ha ocurrido un error al buscar lugares.
                        <p class="mt-2 mb-0">Por favor, intenta de nuevo más tarde.</p>
                    </div>
                `;
                
                // Restaurar el botón de búsqueda
                if (searchButton) {
                    searchButton.disabled = false;
                    searchButton.innerHTML = '<i class="fas fa-search"></i> Buscar';
                }
            });
    }
    
    /**
     * Añade o elimina un lugar de favoritos
     * @param {number} placeId - ID del lugar
     * @param {HTMLElement} button - Botón que ha sido pulsado
     */
    function addToFavorites(placeId, button) {
        try {
            // Cambiar el estilo del botón para indicar que se está procesando
            button.disabled = true;
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
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
                        button.innerHTML = '<i class="fas fa-heart"></i>';
                        
                        // Mostrar notificación de éxito con toast
                        showToast('Lugar añadido a favoritos', 'success');
                        
                        // Actualizar la lista de favoritos sin recargar la página
                        loadFavoritesAjax();
                    } else {
                        // Si ya estaba en favoritos y se quitó
                        button.classList.remove('btn-danger');
                        button.classList.add('btn-outline-danger');
                        button.innerHTML = '<i class="fas fa-heart"></i>';
                        showToast('Lugar eliminado de favoritos', 'success');
                    }
                }
                
                // Habilitar el botón nuevamente
                button.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                // Restaurar el botón a su estado original
                button.innerHTML = originalHTML;
                button.disabled = false;
            });
        } catch (error) {
            console.error('Error al añadir a favoritos:', error);
            button.disabled = false;
        }
    }
});
