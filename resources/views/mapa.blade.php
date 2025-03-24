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
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        #map {
            height: calc(100vh - 120px);
            width: 100%;
        }
        
        /* Header móvil */
        .mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
        }
        
        .logo-icon {
            font-size: 24px;
            color: #007AFF;
            margin-right: 8px;
        }
        
        .logo-text {
            font-weight: 600;
            font-size: 18px;
            color: #333;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
        }
        
        .header-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #007AFF;
            margin-left: 15px;
            padding: 5px;
            position: relative;
        }
        
        .location-active {
            color: #34C759;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        
        /* Barra de búsqueda desplegable */
        .search-container {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background-color: white;
            padding: 10px 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
        }
        
        .search-container.visible {
            transform: translateY(0);
        }
        
        .search-input-container {
            display: flex;
        }
        
        #searchInputMobile {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 10px 0 0 10px;
            padding: 8px 15px;
            font-size: 16px;
        }
        
        #searchButtonMobile {
            background-color: #007AFF;
            color: white;
            border: none;
            border-radius: 0 10px 10px 0;
            padding: 0 15px;
        }
        
        /* Footer móvil */
        .mobile-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: white;
            display: flex;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .footer-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            text-decoration: none;
            font-size: 12px;
        }
        
        .footer-tab.active {
            color: #007AFF;
        }
        
        .footer-icon {
            font-size: 20px;
            margin-bottom: 3px;
        }
        
        /* Estilos para el mapa */
        .leaflet-popup-content {
            min-width: 200px;
            max-width: 250px;
        }
        
        .leaflet-popup-content h5 {
            font-size: 1rem;
            margin-bottom: 5px;
        }
        
        .leaflet-popup-content .badge {
            font-size: 0.7rem;
            padding: 3px 6px;
        }
        
        .leaflet-popup-content p {
            font-size: 0.8rem;
            margin-bottom: 5px;
        }
        
        .leaflet-popup-content img {
            max-width: 100%;
            height: auto;
            margin-top: 5px;
        }
        
        .user-car-marker {
            filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));
        }
        
        /* Estilos para desktop (ocultar en móvil) */
        .desktop-only {
            display: none;
        }
        
        @media (min-width: 768px) {
            .mobile-header, .mobile-footer, .search-container {
                display: none;
            }
            
            .desktop-only {
                display: block;
            }
        }
        
        /* Estilos para el panel de favoritos */
        .favorites-panel {
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100%;
            background-color: white;
            z-index: 1000;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .favorites-panel.active {
            right: 0;
        }
        
        .favorites-header {
            padding: 15px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .favorites-content {
            padding: 10px;
            flex: 1;
            overflow-y: auto;
        }
        
        .favorites-list {
            max-height: 100%;
            overflow-y: auto;
        }
        
        .favorites-footer {
            padding: 10px;
            border-top: 1px solid #ddd;
        }
        
        .favorite-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
            transition: background-color 0.2s;
        }
        
        .favorite-item:hover {
            background-color: #f8f9fa;
        }
        
        .favorite-icon {
            width: 40px;
            height: 40px;
            background-color: #f8f9fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
        }
        
        .favorite-icon i {
            font-size: 20px;
        }
        
        .favorite-info {
            flex: 1;
            overflow: hidden;
        }
        
        .favorite-name {
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .favorite-address {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .favorite-actions {
            display: flex;
            gap: 5px;
        }
        
        .route-info {
            padding: 10px;
        }
        
        .route-info h5 {
            margin-bottom: 10px;
        }
    </style>
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
    <script src="{{ asset('js/script-mapa.js') }}"></script>
</body>
</html>