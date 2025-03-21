<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrar Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>Administrar Usuarios</h1>
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#crearUsuarioModal">
            Crear Usuario
        </button>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="usuariosTable">
                <!-- Los usuarios se cargarán aquí con AJAX -->
            </tbody>
        </table>
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
                @method('PUT')
                @csrf
                    <form id="editarUsuarioForm" method="POST">
                        <input type="hidden" id="editarUsuarioId" name="id">
                        <div class="mb-3">
                            <label for="editarNombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editarNombre" name="name" required>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Cargar usuarios y roles al iniciar la página
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar usuarios
            fetch('/admin/usuarios/getUsers')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('usuariosTable');
                    tableBody.innerHTML = data.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role ? user.role.nombre : 'Sin rol'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="cargarUsuarioParaEditar(${user.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${user.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                });

        });

        // Función para crear un usuario
        function crearUsuario() {
            const formData = new FormData(document.getElementById('crearUsuarioForm'));

            fetch('/admin/usuarios/crear', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json', // Asegúrate de que el servidor devuelva JSON
                },
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; }); // Manejar errores de validación
                }
                return response.json();
            })
            .then(data => {
                alert('Usuario creado con éxito');
                location.reload(); // Recargar la página para ver los cambios
            })
            .catch(error => {
                if (error.errors) {
                    // Si hay errores de validación, mostrarlos
                    const errorMessages = Object.values(error.errors).join('\n');
                    alert('Errores de validación:\n' + errorMessages);
                } else {
                    alert('Error: ' + (error.message || 'No se pudo crear el usuario')); // Mostrar mensaje de error
                }
            });
        }

        // Función para cargar los datos de un usuario en el modal de edición
        function cargarUsuarioParaEditar(id) {
            fetch(`/admin/usuarios/${id}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('editarUsuarioId').value = data.id;
                    document.getElementById('editarNombre').value = data.name;
                    document.getElementById('editarEmail').value = data.email;
                    document.getElementById('editarRoleId').value = data.role_id;

                    // Mostrar el modal de edición
                    const editarUsuarioModal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
                    editarUsuarioModal.show();
                });
        }

        // Función para actualizar un usuario
        function actualizarUsuario() {
            const formData = new FormData(document.getElementById('editarUsuarioForm'));

            fetch(`/admin/usuarios/editar/${document.getElementById('editarUsuarioId').value}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a JSON
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; }); // Manejar errores de validación
                }
                return response.json();
            })
            .then(data => {
                alert('Usuario actualizado con éxito');
                location.reload(); // Recargar la página para ver los cambios
            })
            .catch(error => {
                if (error.errors) {
                    // Si hay errores de validación, mostrarlos
                    const errorMessages = Object.values(error.errors).join('\n');
                    alert('Errores de validación:\n' + errorMessages);
                } else {
                    alert('Error: ' + (error.message || 'No se pudo actualizar el usuario')); // Mostrar mensaje de error
                }
            });
        }

        // Función para eliminar un usuario
        function eliminarUsuario(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                fetch(`/admin/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                })
                .then(response => {
                    if (response.status === 204) {
                        alert('Usuario eliminado con éxito');
                        location.reload(); // Recargar la página para ver los cambios
                    }
                });
            }
        }
    </script>
</body>
</html>
