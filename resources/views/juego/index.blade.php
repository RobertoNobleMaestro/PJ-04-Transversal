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
    <title>Gimcana - Juego</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }

        #map {
            width: 100%;
            height: calc(100vh - 50px);
            position: absolute;
            top: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }

        .action-buttons {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 10px;
            z-index: 1000;
            padding: 0 10px;
        }

        .action-btn {
            padding: 10px 20px;
            border-radius: 30px;
            border: none;
            background-color: #2A4D14;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .action-btn:disabled {
            background-color: #999;
        }

        .action-btn.danger {
            background-color: #4D1414;
        }

        .user-marker {
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #4A89F3;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .pulse {
            width: 14px;
            height: 14px;
            background-color: #4A89F3;
            border-radius: 50%;
            box-shadow: 0 0 0 rgba(74, 137, 243, 0.4);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(74, 137, 243, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(74, 137, 243, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(74, 137, 243, 0);
            }
        }

        .checkpoint-popup h3 {
            font-size: 16px;
            margin: 0 0 5px 0;
            color: #333;
        }

        .checkpoint-popup p {
            margin: 5px 0;
            font-size: 14px;
        }

        .btn-primary {
            background-color: #2A4D14;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            color: white;
            margin-top: 5px;
            cursor: pointer;
            font-size: 13px;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }

        .header-title {
            font-weight: 600;
            font-size: 18px;
            color: #333;
        }

        .checkpoint-detail {
            position: fixed;
            bottom: 80px;
            left: 10px;
            right: 10px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            padding: 15px;
            display: none;
            z-index: 1000;
            max-height: 50vh;
            overflow-y: auto;
        }
        
        /* Estilos para el panel de pistas */
        #hintPanel {
            position: fixed;
            top: 60px;
            left: 10px;
            right: 10px;
            z-index: 1000;
            display: none;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Estilos para la lista de checkpoints */
        .checkpoint-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .checkpoint-list li {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .checkpoint-list li.completed {
            background-color: rgba(42, 77, 20, 0.1);
        }
        
        .checkpoint-list li.pending {
            background-color: rgba(255, 223, 223, 0.3);
        }
    </style>
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
        <button id="listCheckpoints" class="action-btn">
            <i class="fas fa-list"></i> Checkpoints
        </button>
    </div>

    <!-- Scripts - Importante: Leaflet debe cargarse antes que mapa.js -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <script src="{{ asset('js/juego/mapa.js') }}"></script>
</body>

</html>
