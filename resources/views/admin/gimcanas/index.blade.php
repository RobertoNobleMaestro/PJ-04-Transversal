<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/gimcana.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Document</title>
</head>
<body>
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
                    <button class="btn btn-secondary" onclick="limpiarFiltros('gimcanas')">Limpiar Filtros</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                    <button class="btn btn-secondary" onclick="limpiarFiltros('lugares')">Limpiar Filtros</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Etiquetas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-lugares"></tbody>
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
</body>
</html>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar solo la tabla de gimcanas inicialmente ya que es la pestaña activa
            cargarGimcanas();
            
            // Agregar event listeners a las pestañas
            document.querySelectorAll('.nav-link').forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Remover active de todas las pestañas
                    document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-pane').forEach(p => {
                        p.classList.remove('show', 'active');
                    });
                    
                    // Activar la pestaña seleccionada
                    this.classList.add('active');
                    const targetId = this.getAttribute('data-bs-target').replace('#', '');
                    const targetPane = document.getElementById(targetId);
                    targetPane.classList.add('show', 'active');
                    
                    // Cargar los datos según la pestaña seleccionada
                    if (targetId === 'gimcanas') {
                        cargarGimcanas();
                    } else if (targetId === 'lugares') {
                        cargarLugares();
                    }
                });
            });
        });

        // Función para cargar gimcanas
        function cargarGimcanas() {
            fetch('/admin/gimcanas/getGimcanas')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('tabla-gimcanas');
                    tableBody.innerHTML = data.map(gimcana => `
                        <tr>
                            <td>${gimcana.id}</td>
                            <td>${gimcana.nombre}</td>
                            <td>${gimcana.group?.codigogrupo ?? 'Sin código'}</td>
                            <td>${gimcana.creator?.name ?? 'Sin creador'}</td>
                            <td>${gimcana.completed ? 'Completada' : 'En progreso'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarGimcana(${gimcana.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarGimcana(${gimcana.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                });
        }

        // Función para cargar lugares
        function cargarLugares() {
            fetch('/admin/places/getPlaces')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('tabla-lugares');
                    tableBody.innerHTML = data.map(place => `
                        <tr>
                            <td>${place.id}</td>
                            <td>${place.nombre}</td>
                            <td>${place.categoria?.nombre ?? 'Sin categoría'}</td>
                            <td>${place.etiquetas?.join(', ') ?? ''}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarLugar(${place.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarLugar(${place.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                })
                    .catch(error => {
                        console.error('Error:', error);
                    });
        }

        // Función para editar una gimcana
        function editarGimcana(id) {
            fetch(`/admin/gimcanas/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Aquí puedes abrir un modal con los datos de la gimcana para editarla
                    console.log('Datos de la gimcana:', data);
                    // Ejemplo: abrir un modal con los datos
                    // document.getElementById('editarGimcanaModal').style.display = 'block';
                    // document.getElementById('editarGimcanaNombre').value = data.nombre;
                    // document.getElementById('editarGimcanaCheckpoints').value = data.checkpoints;
                });
        }

        // Función para eliminar una gimcana
        function eliminarGimcana(id) {
            if (confirm('¿Estás seguro de que deseas eliminar esta gimcana?')) {
                fetch(`/admin/gimcanas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json',
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('Gimcana eliminada con éxito');
                        cargarGimcanas(); // Recargar la tabla de gimcanas
                    } else {
                        alert('Error al eliminar la gimcana');
                    }
                });
            }
        }

        // Función para editar un lugar
        function editarLugar(id) {
            fetch(`/admin/places/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Aquí puedes abrir un modal con los datos del lugar para editarlo
                    console.log('Datos del lugar:', data);
                    // Ejemplo: abrir un modal con los datos
                    // document.getElementById('editarLugarModal').style.display = 'block';
                    // document.getElementById('editarLugarNombre').value = data.nombre;
                    // document.getElementById('editarLugarCategoria').value = data.categoria_id;
                    // document.getElementById('editarLugarEtiquetas').value = data.etiquetas;
                });
        }

        // Función para eliminar un lugar
        function eliminarLugar(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este lugar?')) {
                fetch(`/admin/places/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json',
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('Lugar eliminado con éxito');
                        cargarLugares(); // Recargar la tabla de lugares
                    } else {
                        alert('Error al eliminar el lugar');
                    }
                });
            }
        }
    </script>
