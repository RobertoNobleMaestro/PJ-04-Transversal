<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <link href="{{ asset('css/juego.css') }}" rel="stylesheet">
    <title>Gimcana - Juego</title>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="header-title">TurGimcana</div>
        <button id="toggleInfo" class="btn-sm btn-outline-secondary">
            <i class="fas fa-info-circle"></i>
        </button>
    </div>
    
    <!-- Panel de pistas -->
    <div id="hintPanel" class="container"></div>

    <!-- Mapa -->
    <div id="map"></div>
    
    <!-- Panel de detalles del checkpoint (inicialmente oculto) -->
    <div id="checkpointDetail" class="checkpoint-detail">
        <!-- El contenido se llenará dinámicamente -->
    </div>

    <!-- Modal para validación de checkpoints -->
    <div class="modal fade" id="validationModal" tabindex="-1" aria-labelledby="validationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" id="validationModalContent">
                <!-- El contenido se llenará dinámicamente -->
            </div>
        </div>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
        <button id="startTracking" class="action-btn">
            <i class="fas fa-location-arrow"></i> Activar ubicación
        </button>
        <button id="abandonarGimcana" class="action-btn danger">
            <i class="fas fa-sign-out-alt"></i> Abandonar Gimcana
        </button>
    </div>

    <!-- Scripts - Importante: Leaflet debe cargarse antes que mapa.js -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/juego/mapa.js') }}"></script>
    <script src="{{ asset('js/juego/abandonar.js') }}"></script>
</body>

</html>
