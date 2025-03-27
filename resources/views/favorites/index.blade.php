<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TurGimcana - Mis Favoritos</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" rel="stylesheet">
    <!-- Leaflet Routing Machine CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.css" rel="stylesheet">
    <!-- CSS personalizado para favoritos -->
    <link href="{{ asset('css/favoritos.css') }}" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .container {
            padding-top: 60px;
        }
        
        /* Header móvil */
        .mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            z-index: 1000;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
        }
        
        .logo-container img {
            height: 40px;
        }
        
        .logo-text {
            margin-left: 10px;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
        }
        
        .header-btn {
            background: none;
            border: none;
            font-size: 1.2rem;
            margin-left: 15px;
            color: #333;
            cursor: pointer;
        }
        
        /* Footer móvil */
        .mobile-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background-color: #ffffff;
            box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-around;
            z-index: 1000;
        }
        
        .footer-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #777;
            font-size: 0.7rem;
        }
        
        .footer-tab.active {
            color: #007bff;
        }
        
        .footer-icon {
            font-size: 1.2rem;
            margin-bottom: 4px;
        }
        
        /* Contenido principal */
        .main-content {
            padding-bottom: 70px;
        }
        
        /* Estilos para la página de favoritos */
        #favorites-map {
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .card {
            transition: transform 0.2s;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .user-marker {
            z-index: 1000;
        }
        
        .custom-marker {
            z-index: 900;
        }
    </style>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <!-- Header móvil -->
    <div class="mobile-header">
        <div class="logo-container">
            <div class="logo-text">TurGimcana</div>
        </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
        <div class="container mt-5 pt-4">
            <div class="row mb-4">
                <div class="col-12">
                    <h2><i class="fas fa-heart text-danger me-2"></i>Mis Lugares Favoritos</h2>
                    <p class="text-muted">Aquí puedes ver todos tus lugares favoritos y obtener direcciones rápidamente.</p>
                    <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addFavoriteModal">
                        <i class="fas fa-plus me-1"></i>Añadir lugar a favoritos
                    </button>
                </div>
            </div>

            @if($favorites->isEmpty())
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>No tienes lugares favoritos guardados. 
                    <a href="{{ route('mapa') }}" class="alert-link">Explora el mapa</a> y marca lugares como favoritos.
                </div>
            @else
                <div class="row" id="favorites-container">
                    @foreach($favorites as $favorite)
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">{{ $favorite->place->nombre }}</h5>
                                    <p class="card-text small text-muted mb-2">
                                        <span class="badge bg-primary">{{ $favorite->place->category->name ?? 'Sin categoría' }}</span>
                                    </p>
                                    <p class="card-text">{{ Str::limit($favorite->place->descripcion, 100) }}</p>
                                    <p class="card-text small text-muted">
                                        <i class="fas fa-map-marker-alt me-1"></i> {{ $favorite->place->direccion }}
                                    </p>
                                    <div class="d-flex justify-content-between mt-3">
                                        <button class="btn btn-sm btn-outline-primary show-on-map" 
                                            data-lat="{{ $favorite->place->coordenadas_lat }}" 
                                            data-lng="{{ $favorite->place->coordenadas_lon }}"
                                            data-name="{{ $favorite->place->nombre }}">
                                            <i class="fas fa-route me-1"></i>Ver ruta
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger remove-favorite" data-id="{{ $favorite->place_id }}">
                                            <i class="fas fa-trash-alt me-1"></i>Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif

            <div id="map-container" class="{{ $favorites->isEmpty() ? 'd-none' : '' }}">
                <div class="row mt-4 mb-3">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 id="route-title">Selecciona un lugar para ver la ruta</h4>
                            <button id="close-map" class="btn btn-sm btn-outline-secondary d-none">
                                <i class="fas fa-times me-1"></i>Cerrar mapa
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div id="favorites-map" style="height: 400px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para añadir lugares a favoritos -->
    <div class="modal fade" id="addFavoriteModal" tabindex="-1" aria-labelledby="addFavoriteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addFavoriteModalLabel">Añadir lugar a favoritos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="searchPlace" class="form-label">Buscar lugar</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="searchPlace" placeholder="Nombre, categoría o dirección...">
                            <button class="btn btn-outline-secondary" type="button" id="searchPlaceBtn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <div id="searchResults" class="mt-3">
                        <!-- Los resultados de búsqueda se mostrarán aquí -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer móvil -->
    <div class="mobile-footer">
        <a href="{{ route('mapa') }}" class="footer-tab">
            <i class="fas fa-map footer-icon"></i>
            <span>Mapa</span>
        </a>
        <a href="{{ route('gimcana') }}" class="footer-tab">
            <i class="fas fa-puzzle-piece footer-icon"></i>
            <span>Gimcana</span>
        </a>
        @auth
        <a href="{{ route('favorites.index') }}" class="footer-tab active">
            <i class="fas fa-heart footer-icon"></i>
            <span>Favoritos</span>
        </a>
        @endauth
        <a href="{{ route('profile') }}" class="footer-tab">
            <i class="fas fa-user footer-icon"></i>
            <span>Log out</span>
        </a>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <!-- Leaflet Routing Machine JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            let map;
            let routeControl;
            let userMarker;
            let userPosition = null;
            let placeMarkers = [];
            
            // Inicializar el mapa cuando sea necesario
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
            
            // Función para cargar los marcadores de los favoritos
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
            
            // Función para mostrar la ruta en el mapa
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
            
            // Función para iniciar el seguimiento de ubicación
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
                                                    <a href="{{ route('mapa') }}" class="alert-link">Explora el mapa</a> y marca lugares como favoritos.
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
            
            // Funcionalidad para buscar y añadir lugares a favoritos
            document.getElementById('searchPlaceBtn').addEventListener('click', searchPlaces);
            document.getElementById('searchPlace').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchPlaces();
                }
            });
            
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
    </script>
</body>
</html>
