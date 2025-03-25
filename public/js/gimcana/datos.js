compronargrupousuario();

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
            if (data.usuarioengrupo == 0) {
                document.getElementById('infogrupo').style.display = 'none';
                mostrardatos();
            } else {
                document.getElementById('infogrupos').style.display = 'none';
                mostrardatosgrupo();
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
            console.log(data);
            let html = '';
            // Información del grupo
            html += `<h1>Bienvenido a ${data.creador[0].nombre}</h1>`;
            html += '<div class="info">'
            html += `<p>Código: ${data.creador[0].codigogrupo}</p>`;
            html += `<p>Creador: ${data.creador[0].creador.name}</p>`;
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
                if (data.creador[0].creador.id === integrante.user_id) {
                    html += ' (Creador)';
                }
                if (data.creador[0].creador.id === data.usuarioactivo && data.creador[0].creador.id !== integrante.user_id) {
                    html += `<button type="button" onclick="expulsar(${integrante.id}, '${integrante.usuarios.name}')">Expulsar</button>`;
                }
                html += `</li>`;
            });
            html += '<li class="waiting">Esperando para comenzar</li>';
            html += '</ul></div>'; // Cierre de .participants
            // Botones de acción
            if (data.creador[0].creador.id === data.usuarioactivo) {
                html += `<button button button type = "button" class="exit-button" onclick = "Eliminargrupo(${data.gruposusuarios[0].group_id}, '${data.creador[0].nombre}')" >Eliminar grupo</button > `;
            } else {
                html += `<button button button type = "button" class="exit-button" onclick = "salirgimcana(${data.gruposusuarios[0].group_id}, '${data.creador[0].nombre}')" >Salir del grupo</button > `;
            }
            // Asignar el HTML construido al contenedor
            datos_grupo.innerHTML = html;
        })
}

salirgimcana = function (id, nombre) {
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
                    document.getElementById('infogrupos').style.display = 'block';
                    if (primeraParte == 'success') {
                        compronargrupousuario()
                    }
                })
        }
    })
}

Eliminargrupo = function (id, nombre) {
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

expulsar = function (id, nombre) {
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