compronargrupousuario();

let myInterval = null;
function compronargrupousuario() {
    var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    var formData = new FormData();
    formData.append('_token', csrfToken);
    fetch("/compronargrupousuario", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            if (data.usuarioengrupo == 0) {
                document.getElementById('infogrupos').style.display = 'block';
                document.getElementById('infogrupo').style.display = 'none';
                if (myInterval !== null) {
                    clearInterval(myInterval);
                    myInterval = null;
                }
                // myInterval = setInterval(mostrardatos, 1000);
                mostrardatos();
            } else {
                document.getElementById('infogrupos').style.display = 'none';
                document.getElementById('infogrupo').style.display = 'block';
                mostrardatosgrupo();
                // Si ya hay un intervalo, lo detenemos antes de crear uno nuevo
                if (myInterval) {
                    clearInterval(myInterval);
                    myInterval = null;
                }
                // myInterval = setInterval(compronargrupousuario, 1000);
            }
        })
}

function mostrardatosgrupo() {
    let datos_grupo = document.getElementById("datos_grupo");
    var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    var formData = new FormData();
    formData.append('_token', csrfToken);
    fetch("/mostrardatosgrupo", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            let html = '';
            // Estructura de tarjeta para móvil
            html += '<div class="card">';
            // Cabecera de la tarjeta
            html += '<h2>' + data.creador[0].nombre + '</h2>';
            html += '<p><strong>Gimcana:</strong> ' + data.creador[0].gimcana.nombre + '</p>';
            html += '<p><strong>Código:</strong> ' + data.creador[0].codigogrupo + '</p>';
            html += '<p><strong>Creador:</strong> ' + data.creador[0].creator.name + '</p>';
            
            // Estado del grupo
            if (data.creador[0].miembros === 0) {
                html += '<p><span class="badge">Grupo completo</span></p>';
            } else {
                html += '<p>Falta ' + data.creador[0].miembros + ' jugador(es)</p>';
            }
            
            // Lista de participantes - optimizada para móvil
            html += '<div class="participantes-container">';
            html += '<h3>Participantes:</h3>';
            html += '<ul>';
            data.gruposusuarios.forEach(integrante => {
                html += '<li>';
                // Nombre del participante
                if (data.creador[0].creator.id === integrante.user_id) {
                    html += '<span>' + integrante.usuarios.name + ' <span class="creator-badge">(Creador)</span></span>';
                } else {
                    html += '<span>' + integrante.usuarios.name + '</span>';
                }
                // Botón de expulsar
                if (data.creador[0].creator.id === data.usuarioactivo && data.creador[0].creator.id !== integrante.user_id) {
                    html += '<button type="button" class="btn-expulsar" onclick="expulsar(' + integrante.id + ', \'' + integrante.usuarios.name + '\')">';
                    html += '<i class="fas fa-times"></i> Expulsar</button>';
                }
                html += '</li>';
            });
            html += '<li class="waiting">Esperando para comenzar</li>';
            html += '</ul>';
            html += '</div>';
            
            // Botones de acción - optimizados para móvil
            html += '<div class="actions">';
            if (data.creador[0].creator.id === data.usuarioactivo) {
                if (data.creador[0].estado == "Espera") {
                    html += '<button type="button" class="btn-comenzar" disabled>';
                    html += '<i class="fas fa-play"></i> Comenzar</button>';
                    html += '<button type="button" class="exit-button" onclick="Eliminargrupo(' + data.gruposusuarios[0].group_id + ', \'' + data.creador[0].nombre + '\')">';
                    html += '<i class="fas fa-trash"></i> Eliminar grupo</button>';
                } else {
                    html += '<button type="button" class="btn-comenzar" onclick="empezar(' + data.gruposusuarios[0].group_id + ', \'' + data.creador[0].gimcana.nombre + '\')">';
                    html += '<i class="fas fa-play"></i> Comenzar</button>';
                    html += '<button type="button" class="exit-button" onclick="Eliminargrupo(' + data.gruposusuarios[0].group_id + ', \'' + data.creador[0].nombre + '\')">';
                    html += '<i class="fas fa-trash"></i> Eliminar grupo</button>';
                }
            } else {
                html += '<button type="button" class="exit-button" onclick="salirgimcana(' + data.gruposusuarios[0].group_id + ', \'' + data.creador[0].nombre + '\')">';
                html += '<i class="fas fa-sign-out-alt"></i> Salir del grupo</button>';
            }
            html += '</div>';
            html += '</div>'; // Cierre de la tarjeta
            
            // Asignar el HTML construido al contenedor
            datos_grupo.innerHTML = html;
        })
}

function empezar(id, nombre) {
    Swal.fire({
        title: '¿Quieres empezar <br>' + nombre + '?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Empezar'
    }
    ).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Empezando ' + nombre,
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
                var formData = new FormData();
                formData.append('_token', csrfToken);
                formData.append('id', id);
                formData.append('nombre', nombre);
                fetch("/empezargimcana", {
                    method: "POST",
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Error al cargar los datos");
                        return response.text();
                    })
                    .then(data => {
                        compronargrupousuario();
                    });
            })
        }
    })
}

function salirgimcana(id, nombre) {
    Swal.fire({
        title: '¿Quieres dejar el grupo ' + nombre + '?',
        // text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Salir del grupo'
    }
    ).then((result) => {
        if (result.isConfirmed) {
            var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
            var formData = new FormData();
            formData.append('_token', csrfToken);
            formData.append('id', id);
            formData.append('nombre', nombre);
            fetch("/salirgrupo", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al cargar los datos");
                    return response.text();
                })
                .then(data => {
                    const [primeraParte, resto] = data.split(/ (.+)/);
                    Swal.fire({
                        title: resto,
                        icon: primeraParte,
                    });
                    if (primeraParte == 'success') {
                        compronargrupousuario()
                    }
                })
        }
    })
}

function Eliminargrupo(id, nombre) {
    Swal.fire({
        title: '¿Quieres eliminar el grupo ' + nombre + '?',
        // text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Salir, eliminar grupo'
    }
    ).then((result) => {
        if (result.isConfirmed) {
            var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
            var formData = new FormData();
            formData.append('_token', csrfToken);
            formData.append('id', id);
            formData.append('nombre', nombre);
            fetch("/eliminargrupo", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al cargar los datos");
                    return response.text();
                })
                .then(data => {
                    const [primeraParte, resto] = data.split(/ (.+)/);
                    Swal.fire({
                        title: resto,
                        icon: primeraParte,
                    });
                    document.getElementById('infogrupos').style.display = 'block';
                    if (primeraParte == 'success') {
                        compronargrupousuario()
                    }

                })
        }
    })
}

function expulsar(id, nombre) {
    Swal.fire({
        title: '¿Quieres expulsar a <br>' + nombre + ' <br>del grupo?',
        // text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Salir, expulsar'
    }
    ).then((result) => {
        if (result.isConfirmed) {
            var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
            var formData = new FormData();
            formData.append('_token', csrfToken);
            formData.append('id', id);
            formData.append('nombre', nombre);
            fetch("/expulsargrupo", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error("Error al cargar los datos");
                    return response.text();
                })
                .then(data => {
                    const [primeraParte, resto] = data.split(/ (.+)/);
                    Swal.fire({
                        title: resto,
                        icon: primeraParte,
                    });
                    document.getElementById('infogrupos').style.display = 'block';
                    if (primeraParte == 'success') {
                        compronargrupousuario()
                    }
                })
        }
    })
}

function comprobarjuego() {
    var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    var formData = new FormData();
    formData.append('_token', csrfToken);
    fetch("/comprobarjuego", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        })
}
