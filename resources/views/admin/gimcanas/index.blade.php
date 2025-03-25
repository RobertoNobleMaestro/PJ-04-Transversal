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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<style>
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
            <button class="nav-link" id="lugares-tab" data-bs-toggle="tab" data-bs-target="#Mapa" type="button" role="tab">
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
                    <div class="row mb-3">
                        <div class="col">
                            <label for="crearLatitud" class="form-label">Latitud</label>
                            <input type="number" step="any" class="form-control" id="crearLatitud" name="coordenadas_lat" required>
                        </div>
                        <div class="col">
                            <label for="crearLongitud" class="form-label">Longitud</label>
                            <input type="number" step="any" class="form-control" id="crearLongitud" name="coordenadas_lon" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="crearCategoria" class="form-label">Categoría</label>
                        <select class="form-select" id="crearCategoria" name="categoria_id" required>
                            <option value="">Seleccione una categoría</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="crearImagen" class="form-label">Imagen</label>
                        <input type="file" class="form-control" id="crearImagen" name="imagen" accept="image/*">
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

<!-- Modal de Edición de Lugares -->
<div class="modal fade" id="editarLugarModal" tabindex="-1" aria-labelledby="editarLugarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarLugarModalLabel">Editar Lugar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarLugar" onsubmit="event.preventDefault(); guardarCambiosLugar();" enctype="multipart/form-data">
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
                    <div class="row mb-3">
                        <div class="col">
                            <label for="editarLatitudLugar" class="form-label">Latitud</label>
                            <input type="number" step="any" class="form-control" id="editarLatitudLugar" name="coordenadas_lat" required>
                        </div>
                        <div class="col">
                            <label for="editarLongitudLugar" class="form-label">Longitud</label>
                            <input type="number" step="any" class="form-control" id="editarLongitudLugar" name="coordenadas_lon" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="editarCategoriaLugar" class="form-label">Categoría</label>
                        <select class="form-select" id="editarCategoriaLugar" name="categoria_id" required>
                            <option value="">Seleccione una categoría</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="editarImagenLugar" class="form-label">Imagen</label>
                        <input type="file" class="form-control" id="editarImagenLugar" name="imagen" accept="image/*">
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
                <form id="formEditarGimcana" onsubmit="event.preventDefault(); guardarCambiosGimcana();">
                    <input type="hidden" id="editarGimcanaId" name="id">
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
                            <td>${gimcana.nombre}</td>
                            <td>${gimcana.group?.codigogrupo ?? 'Sin código'}</td>
                            <td>${gimcana.creator?.name ?? 'Sin creador'}</td>
                            <td>${gimcana.completed ? 'Completada' : 'En progreso'}</td>
                            <td class="d-flex flex-row justify-content-center" style="gap: 5px;">
                                <button class="btn btn-info btn-sm" onclick="verCheckpoints(${gimcana.id})">Ver Checkpoints</button>
                                <button class="btn btn-warning btn-sm" onclick="editarGimcana(${gimcana.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarGimcana(${gimcana.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                });
        }

        // Función para ver los checkpoints de una gimcana
        function verCheckpoints(gimcanaId) {
            fetch(`/admin/gimcanas/${gimcanaId}/checkpoints`)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        Swal.fire('Info', 'Esta gimcana no tiene checkpoints asociados.', 'info');
                        return;
                    }

                    const checkpointsList = data.map((checkpoint, index) => `
                        <li class="list-group-item">
                            <strong>Checkpoint ${index + 1}:</strong> ${checkpoint.pista}
                            <br>
                            <small>Prueba: ${checkpoint.prueba}</small>
                            ${checkpoint.place ? `<br><small>Lugar: ${checkpoint.place.nombre}</small>` : ''}
                        </li>
                    `).join('');

                    Swal.fire({
                        title: 'Checkpoints de la Gimcana',
                        html: `
                            <div style="text-align: left;">
                                <ol class="list-group">${checkpointsList}</ol>
                            </div>
                        `,
                        confirmButtonText: 'Cerrar',
                        width: '600px'
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'No se pudieron cargar los checkpoints', 'error');
                });
        }

        // Función para cargar lugares
        function cargarLugares() {
            fetch('/admin/places/getPlaces?t=' + new Date().getTime())
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener los lugares');
                    }
                    return response.json();
                })
                .then(data => {
                    const tableBody = document.getElementById('tabla-lugares');
                    tableBody.innerHTML = data.map(place => `
                        <tr>
                            <td>${place.nombre}</td>
                            <td>${place.direccion ?? 'Sin dirección'}</td>
                            <td>${place.coordenadas_lat ?? 'Sin coordenadas'}</td>
                            <td>${place.coordenadas_lon ?? 'Sin coordenadas'}</td>
                            <td>${place.categoria?.nombre ?? 'Sin categoría'}</td>
                            <td class="d-flex flex-row justify-content-center" style="gap:5px;">
                                <button class="btn btn-warning btn-sm" onclick="editarLugar(${place.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarLugar(${place.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Error al cargar los lugares', 'error');
                });
        }

        // Función para editar una gimcana
        function editarGimcana(id) {
            fetch(`/admin/gimcanas/editar/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Llenar el formulario con los datos de la gimcana
                    document.getElementById('editarGimcanaId').value = data.id;
                    document.getElementById('editarNombre').value = data.nombre;
                    document.getElementById('editarGroupId').value = data.group_id;

                    // Llenar los checkpoints (si es un select múltiple)
                    const checkpointsSelect = document.getElementById('editarCheckpoints');
                    if (checkpointsSelect) {
                        checkpointsSelect.innerHTML = ''; // Limpiar opciones anteriores
                        data.checkpoints.forEach(checkpoint => {
                            const option = document.createElement('option');
                            option.value = checkpoint.id;
                            option.textContent = checkpoint.pista;
                            checkpointsSelect.appendChild(option);
                        });
                    }

                    // Mostrar el modal
                    new bootstrap.Modal(document.getElementById('editarGimcanaModal')).show();
                })
                .catch(error => {
                    Swal.fire('Error', 'No se pudieron cargar los datos de la gimcana', 'error');
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

        // Función para editar lugar
        function editarLugar(id) {
            fetch(`/admin/places/${id}/edit`)
                .then(response => response.json())
                .then(data => {
                    // Llenar el formulario con los datos del lugar
                    document.getElementById('editarLugarId').value = data.id;
                    document.getElementById('editarNombreLugar').value = data.nombre;
                    document.getElementById('editarDescripcionLugar').value = data.descripcion;
                    document.getElementById('editarDireccionLugar').value = data.direccion;
                    document.getElementById('editarLatitudLugar').value = data.coordenadas_lat;
                    document.getElementById('editarLongitudLugar').value = data.coordenadas_lon;

                    // Cargar categorías antes de seleccionar la correcta
                    cargarCategorias().then(() => {
                        document.getElementById('editarCategoriaLugar').value = data.categoria_id;
                    });

                    // Mostrar el modal de edición de lugares
                    new bootstrap.Modal(document.getElementById('editarLugarModal')).show();
                })
                .catch(error => {
                    Swal.fire('Error', 'No se pudieron cargar los datos del lugar', 'error');
                });
        }

        // Función para guardar los cambios
        function guardarCambiosLugar() {
            const form = document.getElementById('formEditarLugar');
            const formData = new FormData(form);
            
            // Verificar que todos los campos requeridos estén presentes
            const requiredFields = {
                'nombre': formData.get('nombre'),
                'descripcion': formData.get('descripcion'),
                'direccion': formData.get('direccion'),
                'coordenadas_lat': formData.get('coordenadas_lat'),
                'coordenadas_lon': formData.get('coordenadas_lon'),
                'categoria_id': formData.get('categoria_id')
            };

            // Validar campos
            for (const [field, value] of Object.entries(requiredFields)) {
                if (!value) {
                    Swal.fire('Error', `El campo ${field} es requerido`, 'error');
                    return;
                }
            }

            // Agregar el método PUT para Laravel
            formData.append('_method', 'PUT');

            fetch(`/admin/places/${formData.get('id')}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    Swal.fire('Éxito', data.success, 'success').then(() => {
                        // Cerrar el modal
                        new bootstrap.Modal(document.getElementById('editarLugarModal')).hide();
                        
                        // Recargar la tabla de lugares
                        cargarLugares();
                    });
                } else {
                    // Mostrar errores de validación del servidor
                    if (data.errors) {
                        let errorMessages = '';
                        for (const [key, value] of Object.entries(data.errors)) {
                            errorMessages += `${value.join(', ')}\n`;
                        }
                        Swal.fire('Error', errorMessages, 'error');
                    } else {
                        Swal.fire('Error', data.message || 'Error al actualizar el lugar', 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error al actualizar el lugar', 'error');
            });
        }

        // Función para eliminar lugar
        function eliminarLugar(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/admin/places/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}',
                            'Accept': 'application/json',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Eliminado!', data.success, 'success').then(() => {
                                cargarLugares();
                            });
                        } else {
                            Swal.fire('Error', data.error, 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Error al eliminar el lugar', 'error');
                    });
                }
            });
        }

        // Función para abrir modal de creación
        function abrirModalCrear() {
            // Limpiar el formulario
            document.getElementById('formCrearLugar').reset();
            new bootstrap.Modal(document.getElementById('crearLugarModal')).show();
        }

        // Función para crear un nuevo lugar
        function crearLugar() {
            const formData = new FormData(document.getElementById('formCrearLugar'));
            console.log([...formData.entries()]); // Verificar los datos enviados

            fetch('/admin/places', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Éxito', data.success, 'success').then(() => {
                        cargarLugares();
                        new bootstrap.Modal(document.getElementById('crearLugarModal')).hide();
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error al crear el lugar', 'error');
            });
        }

        // Función para cargar categorías en los selects
        function cargarCategorias() {
            return fetch('/admin/categories')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar categorías');
                    }
                    return response.json();
                })
                .then(data => {
                    const selectCrear = document.getElementById('crearCategoria');
                    const selectEditar = document.getElementById('editarCategoriaLugar');
                    
                    selectCrear.innerHTML = '<option value="">Seleccione una categoría</option>';
                    selectEditar.innerHTML = '<option value="">Seleccione una categoría</option>';
                    
                    data.forEach(categoria => {
                        const option = document.createElement('option');
                        option.value = categoria.id;
                        option.textContent = categoria.nombre;
                        
                        selectCrear.appendChild(option.cloneNode(true));
                        selectEditar.appendChild(option.cloneNode(true));
                    });
                })
                .catch(error => {
                    console.error('Error al cargar categorías:', error);
                    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
                });
        }

        // Llamar a la función al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            cargarCategorias();
        });
        document.getElementById("CrearPlaceBtn").onclick = abrirModalCrear;
        // document.getElementById("btn").onclick = saludar;
        // document.getElementById("btn").onclick = saludar;
        // document.getElementById("btn").onclick = saludar;
    </script>


