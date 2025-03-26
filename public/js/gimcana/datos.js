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
                myInterval = setInterval(mostrardatos, 1000);
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
                myInterval = setInterval(compronargrupousuario, 1000);
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
            // Información del grupo
            html += `<h1>Bienvenido a ${data.creador[0].nombre}</h1>`;
            html += '<div class="info">'
            html += `<p>Gimcana: ${data.creador[0].gimcana.nombre}</p>`;
            html += `<p>Código: ${data.creador[0].codigogrupo}</p>`;
            html += `<p>Creador: ${data.creador[0].creator.name}</p>`;
            if (data.creador[0].miembros === 0) {
                html += '<p class="group-complete">Grupo completo</p>';
            } else {
                html += `<p>Falta ${data.creador[0].miembros} jugador(es)</p>`;
            }
            html += '</div>';
            // Lista de participantes
            html += '<div class="participants"><h2>Participantes:</h2><ul>';
            data.gruposusuarios.forEach(integrante => {
                html += `<li>${integrante.usuarios.name}`;
                if (data.creador[0].creator.id === integrante.user_id) {
                    html += ' (Creador)';
                }
                if (data.creador[0].creator.id === data.usuarioactivo && data.creador[0].creator.id !== integrante.user_id) {
                    html += `<button type="button" onclick="expulsar(${integrante.id}, '${integrante.usuarios.name}')">Expulsar</button>`;
                }
                html += `</li>`;
            });
            html += '<li class="waiting">Esperando para comenzar</li>';
            html += '</ul></div>';
            // Botones de acción
            if (data.creador[0].creator.id === data.usuarioactivo) {
                if (data.creador[0].estado == "Espera") {
                    html += `<button type="button" disabled>Comenzar</button>`;
                    html += `<button button button type = "button" class="exit-button" onclick = "Eliminargrupo(${data.gruposusuarios[0].group_id}, '${data.creador[0].nombre}')" >Eliminar grupo</button > `;
                } else {
                    html += `<button type="button"  onclick = "empezar(${data.gruposusuarios[0].group_id}, '${data.creador[0].gimcana.nombre}')">Comenzar</button>`;
                    html += `<button button button type = "button" class="exit-button" onclick = "Eliminargrupo(${data.gruposusuarios[0].group_id}, '${data.creador[0].nombre}')" >Eliminar grupo</button > `;
                }
            } else {
                html += `<button button button type = "button" class="exit-button" onclick = "salirgimcana(${data.gruposusuarios[0].group_id}, '${data.creador[0].nombre}')" >Salir del grupo</button > `;
            }
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
