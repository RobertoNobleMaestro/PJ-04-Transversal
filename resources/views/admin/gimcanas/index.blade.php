<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/gimcana.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <!-- Añadir CSS de Leaflet Control Geocoder -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet-control-geocoder/2.4.0/Control.Geocoder.css" />
    <title>Administración de Gimcanas</title>
</head>
<body>
<style>
    #map {
        width: 100%;
        height: 90vh;
    }

    .modal-content {
        border-radius: 10px;
    }
    .modal-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
    }
    .modal-footer {
        border-top: 1px solid #dee2e6;
    }
</style>
<div class="container mt-4">
    <!-- Información del usuario y logout -->
    <div class="user-header mb-4 d-flex justify-content-between align-items-center">
        <div class="user-info">
            <h4 class="mb-0">Administración de Gimcanas y Lugares</h4>
        </div>
        <form action="{{ route('logout') }}" method="POST" class="d-inline">
            @csrf
            <button type="submit" class="btn btn-outline-danger">Cerrar Sesión</button>
        </form>
    </div>

    <!-- Pestañas -->
    <ul class="nav nav-tabs mb-4" id="gimcanasTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="gimcanas-tab" data-bs-toggle="tab" data-bs-target="#gimcanas" type="button" role="tab">
                Gimcanas
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="lugares-tab" data-bs-toggle="tab" data-bs-target="#lugares" type="button" role="tab">
                Lugares
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="mapa-tab" data-bs-toggle="tab" data-bs-target="#Mapa" type="button" role="tab">
                Mapa gimcanas
            </button>
        </li>
    </ul>

    <!-- Contenido de las pestañas -->
    <div class="tab-content" id="myTabContent">
        <!-- Pestaña Gimcanas -->
        <div class="tab-pane fade show active" id="gimcanas" role="tabpanel">
            <!-- Filtros para Gimcanas -->
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="filtroNombre-gimcanas" class="form-label">Filtrar por Nombre:</label>
                    <input type="text" id="filtroNombre-gimcanas" class="form-control" placeholder="Buscar por nombre...">
                </div>
                <div class="col-md-4">
                    <label for="filtroCheckpoint-gimcanas" class="form-label">Filtrar por Checkpoint:</label>
                    <select id="filtroCheckpoint-gimcanas" class="form-select">
                        <option value="">Todos</option>
                        <!-- Opciones de checkpoints se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <button class="btn btn-secondary" >Limpiar Filtros</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Grupo</th>
                            <th>Creador</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-gimcanas"></tbody>
                </table>
            </div>
        </div>

        <!-- Pestaña Lugares -->
        <div class="tab-pane fade" id="lugares" role="tabpanel">
            <!-- Filtros para Lugares -->
            <div class="row mb-3">
                <div class="col-md-3">
                    <label for="filtroNombre-lugares" class="form-label">Filtrar por Nombre:</label>
                    <input type="text" id="filtroNombre-lugares" class="form-control" placeholder="Buscar por nombre...">
                </div>
                <div class="col-md-3">
                    <label for="filtroCategoria-lugares" class="form-label">Filtrar por Categoría:</label>
                    <select id="filtroCategoria-lugares" class="form-select">
                        <option value="">Todas</option>
                        <!-- Opciones de categorías se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="filtroEtiqueta-lugares" class="form-label">Filtrar por Etiqueta:</label>
                    <select id="filtroEtiqueta-lugares" class="form-select">
                        <option value="">Todas</option>
                        <!-- Opciones de etiquetas se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button class="btn btn-secondary">Limpiar Filtros</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Coordenadas de longitud</th>
                            <th>Coordenadas de latitud</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-lugares"></tbody>
                </table>
            </div>
            <button class="btn btn-primary mb-3" id="CrearPlaceBtn">
                <i class="fas fa-plus"></i> Crear Nuevo Lugar
            </button>
        </div>
    
        <!-- Pestaña Mapa -->
        <div class="tab-pane fade" id="Mapa" role="tabpanel">
            <div id="map"></div>
        </div>
    </div>
</div>

<!-- Modal de Asignación -->
<div id="modal-asignar">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Asignar Técnico</h3>
        </div>
        <div class="modal-body">
            <form id="form-asignar">
                <input type="hidden" id="incidencia-id" name="incidencia_id" />
                <div class="form-group">
                    <label for="tecnico-select">Seleccionar Técnico:</label>
                    <select id="tecnico-select" name="tecnico_id" class="form-select">
                        <option value="">Seleccione un técnico</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="checkpoints">Checkpoints:</label>
                    <select id="checkpoints" name="checkpoints[]" class="form-select" multiple required>
                        <option value="">Seleccione 4 checkpoints</option>
                        <!-- Opciones de checkpoints se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Asignar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="crearLugarModal" tabindex="-1" aria-labelledby="crearLugarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="crearLugarModalLabel">Crear Nuevo Lugar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formCrearLugar" onsubmit="event.preventDefault(); crearLugar();">
                    <div class="mb-3">
                        <label for="crearNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="crearNombre" name="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="crearDescripcion" class="form-label">Descripción</label>
                        <textarea class="form-control" id="crearDescripcion" name="descripcion" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="crearDireccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="crearDireccion" name="direccion" required>
                    </div>
                    <div class="mb-3">
                        <label for="crearLatitud" class="form-label">Latitud</label>
                        <input type="number" step="any" class="form-control" id="crearLatitud" name="coordenadas_lat" required>
                    </div>
                    <div class="mb-3">
                        <label for="crearLongitud" class="form-label">Longitud</label>
                        <input type="number" step="any" class="form-control" id="crearLongitud" name="coordenadas_lon" required>
                    </div>
                    <div class="mb-3">
                        <label for="crearCategoria" class="form-label">Categoría</label>
                        <select class="form-select" id="crearCategoria" name="categoria_id" required>
                            <option value="">Seleccione una categoría</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="crearImagen" class="form-label">Imagen</label>
                        <input type="file" class="form-control" id="crearImagen" name="imagen">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editarLugarModal" tabindex="-1" aria-labelledby="editarLugarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarLugarModalLabel">Editar Lugar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarLugar" onsubmit="event.preventDefault(); actualizarLugar();">
                    <input type="hidden" id="editarId" name="id">
                    <div class="mb-3">
                        <label for="editarNombreLugar" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editarNombreLugar" name="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarDescripcion" class="form-label">Descripción</label>
                        <textarea class="form-control" id="editarDescripcion" name="descripcion" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="editarDireccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="editarDireccion" name="direccion" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarLatitud" class="form-label">Latitud</label>
                        <input type="number" step="any" class="form-control" id="editarLatitud" name="coordenadas_lat" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarLongitud" class="form-label">Longitud</label>
                        <input type="number" step="any" class="form-control" id="editarLongitud" name="coordenadas_lon" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarCategoria" class="form-label">Categoría</label>
                        <select class="form-select" id="editarCategoria" name="categoria_id" required>
                            <option value="">Seleccione una categoría</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="editarImagen" class="form-label">Imagen</label>
                        <input type="file" class="form-control" id="editarImagen" name="imagen">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editarGimcanaModal" tabindex="-1" aria-labelledby="editarGimcanaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarGimcanaModalLabel">Editar Gimcana</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarGimcana" onsubmit="event.preventDefault(); actualizarGimcana();">
                    <input type="hidden" id="editarIdGimcana" name="id">
                    <div class="mb-3">
                        <label for="editarNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editarNombre" name="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarGroupId" class="form-label">Grupo</label>
                        <select class="form-select" id="editarGroupId" name="group_id" required>
                            <option value="">Seleccione un grupo</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="editarCheckpoints" class="form-label">Checkpoints</label>
                        <select class="form-select" id="editarCheckpoints" name="checkpoints[]" multiple required>
                            <option value="">Seleccione checkpoints</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>    

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
<script src="{{ asset('js/map.js') }}"></script>
<script src="{{ asset('js/script-crud-gimcana.js') }}"></script>
</body>
</html>
