<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurGimcana - Turismo y Gimcanas Interactivas</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" rel="stylesheet">
    <!-- Leaflet Routing Machine CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.css" rel="stylesheet">
    <!-- Estilos personalizados -->
    <link href="{{ asset('css/stylesIndex.css') }}" rel="stylesheet">
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fas fa-map-marked-alt me-2" style="color: var(--primary-color);"></i>TurGimcana</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('index') }}"><i class="fas fa-home me-1"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('mapa') }}"><i class="fas fa-map me-1"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('gimcana') }}"><i class="fas fa-puzzle-piece me-1"></i> Gimcana</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto"><i class="fas fa-envelope me-1"></i> Contacto</a>
                    </li>
                    <li class="nav-item ms-lg-3">
                        @auth
                            <a class="nav-link" href="{{ route('profile') }}">
                                <i class="fas fa-user me-1"></i> {{ Auth::user()->name }}
                            </a>
                        @else
                            <a class="btn btn-outline-primary" href="{{ route('login') }}">
                                <i class="fas fa-sign-in-alt me-1"></i> Acceder
                            </a>
                        @endauth
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Contenedor para el mapa -->
    <div class="container my-4">
        <div id="map" style="height: 400px;"></div>
    </div>

    <!-- Barra de búsqueda y controles en la parte inferior -->
    <div class="fixed-bottom bg-light p-3">
        <div class="d-flex justify-content-between">
            <input type="text" id="searchInput" class="form-control" placeholder="Buscar ubicación..." />
            <button id="searchButton" class="btn btn-primary">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div id="userMarkers" class="mt-2">
            <!-- Aquí se irán mostrando los marcadores -->
        </div>
    </div>

    <!-- Formulari per afegir marcadors manualment -->
    <div class="container my-4">
        <h4>Afegeix un marcador manualment</h4>
        <form id="coordinatesForm">
            <div class="mb-3">
                <label for="lat" class="form-label">Latitud</label>
                <input type="number" class="form-control" id="lat" placeholder="Ex: 41.349">
            </div>
            <div class="mb-3">
                <label for="lon" class="form-label">Longitud</label>
                <input type="number" class="form-control" id="lon" placeholder="Ex: 2.1104">
            </div>
            <button type="submit" class="btn btn-primary">Afegeix el marcador</button>
        </form>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.2/leaflet-routing-machine.js"></script>
    <script src="{{ asset('js/script-mapa.js') }}"></script>
</body>
</html>
