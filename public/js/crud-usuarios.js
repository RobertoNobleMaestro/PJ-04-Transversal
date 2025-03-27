// Funciones de usuarios
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarios();
    cargarRolesParaFiltro();
    
    // Añadir eventos para los filtros
    document.getElementById('filtroNombre-usuarios').addEventListener('input', aplicarFiltrosUsuarios);
    document.getElementById('filtroRol-usuarios').addEventListener('change', aplicarFiltrosUsuarios);
});

// Variables para almacenar los datos originales
let todosLosUsuarios = [];

// Función para cargar usuarios
function cargarUsuarios() {
    fetch('/admin/usuarios/getUsers', {
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        todosLosUsuarios = data; // Guardar todos los usuarios para filtrar después
        mostrarUsuariosEnTabla(data);
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los usuarios: ' + error.message
        });
    });
}

// Función para mostrar usuarios en la tabla
function mostrarUsuariosEnTabla(usuarios) {
    const tableBody = document.getElementById('usuariosTable');
    tableBody.innerHTML = usuarios.length > 0 
        ? usuarios.map(user => `
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
        `).join('')
        : '<tr><td colspan="5" class="text-center">No se encontraron usuarios</td></tr>';
}

// Función para cargar roles para el filtro
function cargarRolesParaFiltro() {
    fetch('/admin/roles', {
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => response.json())
    .then(data => {
        const selectRol = document.getElementById('filtroRol-usuarios');
        const selectRolCrear = document.getElementById('crearRoleId');
        const selectRolEditar = document.getElementById('editarRoleId');
        
        // Añadir opciones al filtro
        data.forEach(rol => {
            selectRol.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
            
            // También actualizar los selects de los formularios
            if (selectRolCrear) {
                selectRolCrear.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
            }
            
            if (selectRolEditar) {
                selectRolEditar.innerHTML += `<option value="${rol.id}">${rol.nombre}</option>`;
            }
        });
    })
    .catch(error => {
        console.error('Error al cargar roles:', error);
    });
}

// Función para aplicar filtros a los usuarios
function aplicarFiltrosUsuarios() {
    const filtroNombre = document.getElementById('filtroNombre-usuarios').value.toLowerCase();
    const filtroRol = document.getElementById('filtroRol-usuarios').value;
    
    const usuariosFiltrados = todosLosUsuarios.filter(user => {
        // Filtrar por nombre
        const nombreCoincide = user.name.toLowerCase().includes(filtroNombre);
        
        // Filtrar por rol
        const rolCoincide = filtroRol === '' || (user.role && user.role.id.toString() === filtroRol);
        
        return nombreCoincide && rolCoincide;
    });
    
    mostrarUsuariosEnTabla(usuariosFiltrados);
}

// Función para limpiar filtros
function limpiarFiltrosUsuarios() {
    document.getElementById('filtroNombre-usuarios').value = '';
    document.getElementById('filtroRol-usuarios').value = '';
    
    // Volver a mostrar todos los usuarios
    mostrarUsuariosEnTabla(todosLosUsuarios);
}

// Validación de formulario
function validarFormulario(form) {
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const role_id = form.querySelector('[name="role_id"]').value;
    
    if (!name) {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: 'El nombre es obligatorio'
        });
        return false;
    }
    
    if (!email) {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: 'El email es obligatorio'
        });
        return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: 'El formato del email no es válido'
        });
        return false;
    }
    
    if (!role_id) {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: 'Debe seleccionar un rol'
        });
        return false;
    }
    
    return true;
}

// Función para crear un usuario
function crearUsuario() {
    const form = document.getElementById('crearUsuarioForm');
    
    if (!validarFormulario(form)) {
        return;
    }
    
    const formData = new FormData(form);

    Swal.fire({
        title: 'Creando usuario...',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    fetch('/admin/usuarios/crear', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json',
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario creado con éxito',
            timer: 1500
        });
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('crearUsuarioModal'));
        if (modal) {
            modal.hide();
        }
        
        // Limpiar el formulario
        form.reset();
        
        // Recargar la tabla de usuarios
        cargarUsuarios();
    })
    .catch(error => {
        let errorMessage = 'No se pudo crear el usuario';
        
        if (error.errors) {
            errorMessage = Object.values(error.errors).join('\n');
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
        });
    });
}

// Función para cargar los datos de un usuario en el modal de edición
function cargarUsuarioParaEditar(id) {
    Swal.fire({
        title: 'Cargando usuario...',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    fetch(`/admin/usuarios/${id}`, {
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Asignar los valores a los campos del formulario
        document.getElementById('editarUsuarioId').value = data.id;
        document.getElementById('editarNombreUsuario').value = data.name;
        document.getElementById('editarEmail').value = data.email;
        document.getElementById('editarRoleId').value = data.role_id;
        
        // Cerrar el SweetAlert
        Swal.close();
        
        // Mostrar el modal de edición
        const editarUsuarioModal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
        editarUsuarioModal.show();
    })
    .catch(error => {
        console.error('Error al cargar el usuario:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar el usuario: ' + error.message
        });
    });
}

// Función para actualizar un usuario
function actualizarUsuario() {
    const form = document.getElementById('editarUsuarioForm');
    
    if (!validarFormulario(form)) {
        return;
    }
    
    const formData = new FormData(form);
    const userId = document.getElementById('editarUsuarioId').value;
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        role_id: formData.get('role_id'),
        password: formData.get('password') // Solo se incluirá si se proporciona
    };

    // Si no hay contraseña nueva, la eliminamos del objeto
    if (!data.password) {
        delete data.password;
    }

    Swal.fire({
        title: 'Actualizando usuario...',
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    fetch(`/admin/usuarios/editar/${userId}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario actualizado con éxito',
            timer: 1500
        });
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarUsuarioModal'));
        if (modal) {
            modal.hide();
        }
        
        // Recargar la tabla de usuarios
        cargarUsuarios();
    })
    .catch(error => {
        console.error('Error completo:', error);
        
        let errorMessage = 'No se pudo actualizar el usuario';
        
        if (error.errors) {
            errorMessage = Object.values(error.errors).join('\n');
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
        });
    });
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando usuario...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });

            fetch(`/admin/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 204) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Usuario eliminado con éxito',
                        timer: 1500
                    });
                    
                    // Recargar la tabla de usuarios
                    cargarUsuarios();
                } else {
                    throw new Error('Error al eliminar el usuario');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error: ' + error.message
                });
            });
        }
    });
}