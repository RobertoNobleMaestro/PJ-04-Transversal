<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TurGimcana - Mapa Interactivo</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" rel="stylesheet">
    <!-- Leaflet Routing Machine CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.css" rel="stylesheet">
    <!-- Custom Route Styles -->
    <link href="{{ asset('css/route-styles.css') }}" rel="stylesheet">
    <!-- Mapa CSS -->
    <link href="{{ asset('css/mapa.css') }}" rel="stylesheet">
</head>
<body>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Header móvil -->
    <div class="mobile-header">
        <div class="logo-container">
            <i class="fas fa-map-marked-alt logo-icon"></i>
            <span class="logo-text">TurGimcana</span>
        </div>
        <div class="header-actions">
            <button id="toggleLocation" class="header-btn" title="Seguimiento de ubicación">
                <i class="fas fa-location-arrow" id="locationIcon"></i>
            </button>
            <button id="toggleSearch" class="header-btn" title="Buscar">
                <i class="fas fa-search"></i>
            </button>
            @auth
            <button id="toggleFavorites" class="header-btn" title="Mis favoritos">
                <i class="fas fa-heart"></i>
            </button>
            @endauth
        </div>
    </div>
    
    <!-- Barra de búsqueda desplegable -->
    <div class="search-container" id="mobileSearchContainer">
        <div class="search-input-container">
            <input type="text" id="searchInputMobile" class="form-control" placeholder="Buscar ubicación...">
            <button id="searchButtonMobile" class="btn">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>

    <!-- Mapa -->
    <div id="map"></div>

    <!-- Footer móvil -->
    <div class="mobile-footer">
        <a href="{{ route('mapa') }}" class="footer-tab active">
            <i class="fas fa-map footer-icon"></i>
            <span>Mapa</span>
        </a>
        <a href="{{ route('gimcana') }}" class="footer-tab">
            <i class="fas fa-puzzle-piece footer-icon"></i>
            <span>Gimcana</span>
        </a>
        @auth
        <a href="{{ route('favorites.index') }}" class="footer-tab">
            <i class="fas fa-heart footer-icon"></i>
            <span>Favoritos</span>
        </a>
        @endauth
        <a href="{{ route('profile') }}" class="footer-tab">
            <i class="fas fa-user footer-icon"></i>
            <span>Perfil</span>
        </a>
    </div>

    <!-- Barra de navegación para desktop (oculta en móvil) -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top desktop-only">
        <div class="container">
            <a class="navbar-brand" href="{{ route('index') }}">
                <i class="fas fa-map-marked-alt me-2" style="color: var(--primary-color);"></i>TurGimcana
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('index') }}"><i class="fas fa-home me-1"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="{{ route('mapa') }}"><i class="fas fa-map me-1"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('gimcana') }}"><i class="fas fa-puzzle-piece me-1"></i> Gimcana</a>
                    </li>
                    @auth
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('favorites.index') }}"><i class="fas fa-heart me-1"></i> Favoritos</a>
                    </li>
                    @endauth
                    <li class="nav-item ms-lg-3">
                        @auth
                            <a class="nav-link" href="{{ route('profile') }}">
                                <i class="fas fa-user me-1"></i> {{ Auth::user()->name }}
                            </a>
                        @else
                            <a class="btn btn-outline-primary btn-sm" href="{{ route('login') }}">
                                <i class="fas fa-sign-in-alt me-1"></i> Acceder
                            </a>
                        @endauth
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Controles del mapa para desktop (ocultos en móvil) -->
    <div class="map-controls desktop-only">
        <div class="search-container">
            <input type="text" id="searchInput" class="form-control" placeholder="Buscar ubicación...">
            <button id="searchButton" class="btn btn-primary">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>
    
    <button id="locateMe" class="btn btn-outline-primary locate-btn desktop-only">
        <i class="fas fa-location-arrow"></i>
    </button>

    <!-- Panel de favoritos -->
    <div id="favorites-panel" class="favorites-panel">
        <div class="favorites-header">
            <h5><i class="fas fa-heart text-danger me-2"></i>Mis Favoritos</h5>
            <button id="closeFavorites" class="btn-close"></button>
        </div>
        <div class="favorites-content">
            <div id="favorites-list" class="favorites-list">
                <!-- Los favoritos se cargarán aquí dinámicamente -->
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="favorites-footer">
            <button id="viewAllFavorites" class="btn btn-sm btn-primary w-100">
                <i class="fas fa-list me-1"></i>Ver todos mis favoritos
            </button>
        </div>
    </div>

    <script>
        var placesData = @json($places);
        var defaultLocation = { lat: 41.3851, lng: 2.1734 }; // Barcelona por defecto
        var authCheck = @json(auth()->check());
    </script>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/script-mapa.js') }}"></script>
</body>
</html>