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
            padding-top: 56px;
        }
        #map {
            height: calc(100vh - 56px);
            width: 100%;
        }
        .navbar {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .map-controls {
            position: absolute;
            z-index: 1000;
            width: 90%;
            left: 5%;
            top: 70px;
        }
        .search-container {
            display: flex;
            margin-bottom: 10px;
        }
        #searchInput {
            border-radius: 20px 0 0 20px;
        }
        #searchButton {
            border-radius: 0 20px 20px 0;
        }
        .locate-btn {
            position: absolute;
            right: 10px;
            top: 70px;
            z-index: 1000;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
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

        @media (min-width: 768px) {
            .map-controls {
                width: 400px;
                left: 20px;
                top: 80px;
            }
            .locate-btn {
                right: 20px;
                top: 80px;
            }
            .leaflet-popup-content {
                min-width: 250px;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <!-- Barra de navegación fija -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
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

    <!-- Mapa -->
    <div id="map"></div>

    <!-- Controles del mapa -->
    <div class="map-controls">
        <div class="search-container">
            <input type="text" id="searchInput" class="form-control" placeholder="Buscar ubicación...">
            <button id="searchButton" class="btn btn-primary">
                <i class="fas fa-search"></i>
            </button>
        </div>
    </div>
    
    <button id="locateMe" class="btn btn-outline-primary locate-btn">
        <i class="fas fa-location-arrow"></i>
    </button>

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