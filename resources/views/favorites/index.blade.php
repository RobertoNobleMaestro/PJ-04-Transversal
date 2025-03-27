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
    <link href="{{ asset('css/route-favorito.css') }}" rel="stylesheet">

    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <!-- Header móvil -->
    <div class="mobile-header">
        <div class="logo-container">
            <i class="fas fa-map-marked-alt logo-icon"></i>
            <span class="logo-text">TurGimcana</span>
        </div>
        <div class="header-actions">
            @auth
            <a href="{{ route('favorites.index') }}" class="header-btn">
                <i class="fas fa-heart text-danger"></i>
            </a>
            @endauth
            <button class="header-btn" id="menuBtn">
                <i class="fas fa-bars"></i>
            </button>
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
            <span>Perfil</span>
        </a>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <!-- Leaflet Routing Machine JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.min.js"></script>
    <!-- Script de favoritos -->
    <script src="{{ asset('js/script-favoritos.js') }}"></script>
</body>
</html>
