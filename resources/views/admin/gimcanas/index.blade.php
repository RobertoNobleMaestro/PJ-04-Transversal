<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/gimcana.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <!-- Añadir CSS de Leaflet Control Geocoder -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <!-- Estilos de administración -->
    <link rel="stylesheet" href="{{ asset('css/admin-styles.css') }}">
    <title>Administración de Gimcanas</title>
</head>
<body>
<div class="container mt-4">
    <!-- Información del usuario y logout -->
    <div class="user-header mb-4 d-flex justify-content-between align-items-center">
        <div class="user-info">
            <h4 class="mb-0">Administración de Gimcanas y Lugares</h4>
        </div>
        <div>
            <form action="{{ route('logout') }}" method="POST" style="display: inline;">
                @csrf
                <button type="submit" class="btn btn-outline-secondary">Cerrar Sesión</button>
            </form>
        </div>
    </div>

    <!-- Navegación por tabs -->
    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="gimcanas-tab" data-bs-toggle="tab" data-bs-target="#gimcanas" type="button" role="tab" aria-controls="gimcanas" aria-selected="true">Gimcanas</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="lugares-tab" data-bs-toggle="tab" data-bs-target="#lugares" type="button" role="tab" aria-controls="lugares" aria-selected="false">Lugares</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="checkpoints-tab" data-bs-toggle="tab" data-bs-target="#checkpoints" type="button" role="tab" aria-controls="checkpoints" aria-selected="false">Checkpoints</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="usuarios-tab" data-bs-toggle="tab" data-bs-target="#usuarios" type="button" role="tab" aria-controls="usuarios" aria-selected="false">Usuarios</button>
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
                    <label for="filtroCreador-gimcanas" class="form-label">Filtrar por Creador:</label>
                    <input type="text" id="filtroCreador-gimcanas" class="form-control" placeholder="Buscar por creador...">
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="limpiarFiltrosGimcanas()">Limpiar Filtros</button>
                </div>
            </div>
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary" onclick="abrirModalCrearGimcana()">
                    <i class="fas fa-plus"></i> Crear Gimcana
                </button>
            </div>
            <div class="table-responsive">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th>Nombre</th>
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
                <div class="col-md-4">
                    <label for="filtroNombre-lugares" class="form-label">Filtrar por Nombre:</label>
                    <input type="text" id="filtroNombre-lugares" class="form-control" placeholder="Buscar por nombre...">
                </div>
                <div class="col-md-4">
                    <label for="filtroCategoria-lugares" class="form-label">Filtrar por Categoría:</label>
                    <select id="filtroCategoria-lugares" class="form-select">
                        <option value="">Todas</option>
                        <!-- Opciones de categorías se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="col-md-4 d-flex align-items-end justify-content-between">
                    <button class="btn btn-secondary" onclick="limpiarFiltrosLugares()">Limpiar Filtros</button>
                    <button class="btn btn-primary" id="CrearPlaceBtn">Crear Lugar</button>
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
        </div>
        
        <!-- Pestaña Checkpoints -->
        <div class="tab-pane fade" id="checkpoints" role="tabpanel">
            <div class="row mb-3">
                <div class="col-md-12">
                    <h4>Crear Checkpoints desde el Mapa</h4>
                    <p>Utiliza el mapa para seleccionar lugares y crear nuevos puntos de control para las gimcanas.</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <!-- Mapa para seleccionar lugares -->
                    <div id="checkpoint-map" style="height: 500px;"></div>
                </div>
                <div class="col-md-4">
                    <!-- Formulario para crear checkpoint -->
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            Crear nuevo Checkpoint
                        </div>
                        <div class="card-body">
                            <form id="formCrearCheckpoint">
                                <div class="mb-3">
                                    <label for="checkpoint_lugar" class="form-label">Lugar seleccionado</label>
                                    <input type="text" class="form-control" id="checkpoint_lugar" readonly>
                                    <input type="hidden" id="checkpoint_place_id" name="place_id">
                                </div>
                                <div class="mb-3">
                                    <label for="checkpoint_pista" class="form-label">Pista</label>
                                    <textarea class="form-control" id="checkpoint_pista" name="pista" required></textarea>
                                    <small class="text-muted">Escribe una pista para encontrar este lugar.</small>
                                </div>
                                <div class="mb-3">
                                    <label for="checkpoint_prueba" class="form-label">Prueba</label>
                                    <textarea class="form-control" id="checkpoint_prueba" name="prueba" required></textarea>
                                    <small class="text-muted">Describe la prueba que deberán realizar en este punto.</small>
                                </div>
                                <div class="mb-3">
                                    <label for="checkpoint_respuesta" class="form-label">Respuesta</label>
                                    <input type="text" class="form-control" id="checkpoint_respuesta" name="respuesta" required>
                                    <small class="text-muted">Escribe la respuesta correcta para esta prueba.</small>
                                </div>
                                <div class="mb-3">
                                    <label for="checkpoint_gimcana" class="form-label">Asignar a Gimcana</label>
                                    <select class="form-select" id="checkpoint_gimcana" name="gimcana_id">
                                        <option value="">Seleccione una gimcana (opcional)</option>
                                    </select>
                                </div>
                                <button type="button" id="btnCrearCheckpoint" class="btn btn-primary w-100">Crear Checkpoint</button>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Lista de checkpoints creados -->
                    <div class="card mt-3">
                        <div class="card-header bg-secondary text-white">
                            Checkpoints Recientes
                        </div>
                        <div class="card-body checkpoint-list" style="max-height: 200px; overflow-y: auto;">
                            <div id="checkpoints-recientes">
                                <p class="text-center text-muted">Aún no hay checkpoints creados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pestaña Usuarios -->
        <div class="tab-pane fade" id="usuarios" role="tabpanel">
            <!-- Filtros para Usuarios -->
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="filtroNombre-usuarios" class="form-label">Filtrar por Nombre:</label>
                    <input type="text" id="filtroNombre-usuarios" class="form-control" placeholder="Buscar por nombre...">
                </div>
                <div class="col-md-4">
                    <label for="filtroRol-usuarios" class="form-label">Filtrar por Rol:</label>
                    <select id="filtroRol-usuarios" class="form-select">
                        <option value="">Todos</option>
                        <!-- Opciones de roles se cargarán dinámicamente -->
                    </select>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <button class="btn btn-secondary" onclick="limpiarFiltrosUsuarios()">Limpiar Filtros</button>
                </div>
            </div>
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearUsuarioModal">
                    <i class="fas fa-plus"></i> Crear Usuario
                </button>
            </div>
            <div class="table-responsive">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usuariosTable"></tbody>
                </table>
            </div>
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

<!-- Modal para Crear Lugar -->
<div class="modal fade" id="crearLugarModal" tabindex="-1" aria-labelledby="crearLugarModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 900px; margin: 1.75rem auto;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="crearLugarModalLabel">Crear Nuevo Lugar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <form id="formCrearLugar">
                            <div class="mb-3">
                                <label for="crearNombreLugar" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="crearNombreLugar" name="nombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="crearDescripcionLugar" class="form-label">Descripción</label>
                                <textarea class="form-control" id="crearDescripcionLugar" name="descripcion" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="crearDireccionLugar" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="crearDireccionLugar" name="direccion" required>
                            </div>
                            <div class="mb-3">
                                <label for="crearLatitudLugar" class="form-label">Latitud</label>
                                <input type="number" step="any" class="form-control" id="crearLatitudLugar" name="coordenadas_lat" required>
                            </div>
                            <div class="mb-3">
                                <label for="crearLongitudLugar" class="form-label">Longitud</label>
                                <input type="number" step="any" class="form-control" id="crearLongitudLugar" name="coordenadas_lon" required>
                            </div>
                            <div class="mb-3">
                                <label for="crearCategoriaLugar" class="form-label">Categoría</label>
                                <select class="form-select" id="crearCategoriaLugar" name="categoria_id" required>
                                    <option value="">Seleccione una categoría</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="crearImagenLugar" class="form-label">Imagen</label>
                                <input type="file" class="form-control" id="crearImagenLugar" name="imagen">
                            </div>
                        </form>
                    </div>
                    <div class="col-md-6">
                        <!-- Mapa para seleccionar ubicación -->
                        <div class="mb-2">
                            <label class="form-label">Selecciona la ubicación en el mapa</label>
                            <p class="text-muted small">Puedes hacer clic en el mapa o usar el buscador para ubicar el lugar</p>
                        </div>
                        <div id="crear-lugar-map" style="height: 350px;"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarLugar">Guardar Lugar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editarLugarModal" tabindex="-1" aria-labelledby="editarLugarModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="max-width: 900px; margin: 1.75rem auto;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarLugarModalLabel">Editar Lugar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <form id="formEditarLugar" onsubmit="event.preventDefault(); guardarCambiosLugar();">
                            <input type="hidden" id="editarLugarId" name="id">
                            <div class="mb-3">
                                <label for="editarNombreLugar" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="editarNombreLugar" name="nombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="editarDescripcionLugar" class="form-label">Descripción</label>
                                <textarea class="form-control" id="editarDescripcionLugar" name="descripcion" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="editarDireccionLugar" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="editarDireccionLugar" name="direccion" required>
                            </div>
                            <div class="mb-3">
                                <label for="editarLatitudLugar" class="form-label">Latitud</label>
                                <input type="number" step="any" class="form-control" id="editarLatitudLugar" name="coordenadas_lat" required>
                            </div>
                            <div class="mb-3">
                                <label for="editarLongitudLugar" class="form-label">Longitud</label>
                                <input type="number" step="any" class="form-control" id="editarLongitudLugar" name="coordenadas_lon" required>
                            </div>
                            <div class="mb-3">
                                <label for="editarCategoriaLugar" class="form-label">Categoría</label>
                                <select class="form-select" id="editarCategoriaLugar" name="categoria_id" required>
                                    <option value="">Seleccione una categoría</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="editarImagen" class="form-label">Imagen</label>
                                <input type="file" class="form-control" id="editarImagen" name="imagen">
                            </div>
                        </form>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Selecciona la ubicación en el mapa</label>
                        <p class="text-muted small">Puedes hacer clic en el mapa o usar el buscador para ubicar el lugar</p>
                        <div id="editar-lugar-map" style="height: 350px;"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="guardarCambiosLugar()">Guardar</button>
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
                <form id="formEditarGimcana">
                    <input type="hidden" id="editarIdGimcana" name="id">
                    <div class="mb-3">
                        <label for="editarNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editarNombre" name="nombre" required>
                    </div>
                    <div class="checkpoints-container">
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-secondary" id="btnAddCheckpoint">
                            <i class="fas fa-plus"></i> Añadir siguiente checkpoint
                        </button>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="actualizarGimcana()">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal para crear gimcana -->
<div class="modal fade" id="crearGimcanaModal" tabindex="-1" aria-labelledby="crearGimcanaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="crearGimcanaModalLabel">Crear Gimcana</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formCrearGimcana">
                    <div class="mb-3">
                        <label for="crearNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="crearNombre" name="nombre" required>
                    </div>
                    <div class="checkpoints-container"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnCrearGimcana">Crear</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal para crear usuario -->
<div class="modal fade" id="crearUsuarioModal" tabindex="-1" aria-labelledby="crearUsuarioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="crearUsuarioModalLabel">Crear Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="crearUsuarioForm" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="role_id" class="form-label">Rol</label>
                        <select class="form-select" id="role_id" name="role_id" required>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}">{{ $role->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="crearUsuario()">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal para editar usuario -->
<div class="modal fade" id="editarUsuarioModal" tabindex="-1" aria-labelledby="editarUsuarioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarUsuarioModalLabel">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editarUsuarioForm" method="POST">
                    <input type="hidden" id="editarUsuarioId" name="id">
                    <div class="mb-3">
                        <label for="editarNombreUsuario" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editarNombreUsuario" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editarEmail" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="editarRoleId" class="form-label">Rol</label>
                        <select class="form-select" id="editarRoleId" name="role_id" required>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}">{{ $role->nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="actualizarUsuario()">Guardar Cambios</button>
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
<!-- SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{ asset('js/mapa-nucleo.js') }}"></script>
<script src="{{ asset('js/mapa-marcadores.js') }}"></script>
<script src="{{ asset('js/mapa-filtros.js') }}"></script>
<!-- Archivos CRUD -->
<script src="{{ asset('js/crud-lugares.js') }}"></script>
<script src="{{ asset('js/crud-gimcanas.js') }}"></script>
<script src="{{ asset('js/crud-checkpoints.js') }}"></script>
<script src="{{ asset('js/crud-usuarios.js') }}"></script>
<script src="{{ asset('js/crud-comun.js') }}"></script>
</body>
</html>
