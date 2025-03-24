
function buscargrupo(event) {
    event.preventDefault();
    var form = document.getElementById("frmbuscargrupo");
    var formData = new FormData(form);
    fetch("/infogimcana", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            grupos(data.grupos);
        })
}

function borrarfiltros() {
    document.getElementById("formnewuser").reset();
    mostrarrestaurantes();
}

function mostrardatos() {
    var form = document.getElementById("frmbuscargrupo");
    var formData = new FormData(form);
    fetch("/infogimcana", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            grupos(data.grupos);
        })
}

function grupos(datos) {
    let datos_grupos = document.getElementById("datos_grupos");
    datos_grupos.innerHTML = '';
    datos.forEach(dato => {
        let grupos = '';
        grupos += '<div class="card">';
        grupos += '    <div class="container">';
        grupos += '        <h2>' + dato.nombre + '</h2>';
        grupos += '        <p>Creador: ' + dato.creador.name + '</p>';
        if (dato.miembros == 0) {
            grupos += '    <p>Grupo completo</p>';
        } else {
            grupos += '    <p>Quedan ' + dato.miembros + ' plazas</p>';
            grupos += `    <button type="button" onclick=unirseagrupo(${dato.id},'${dato.nombre}')>Unirse</button>`;
        }
        grupos += '     </div>';
        grupos += '</div>';
        datos_grupos.innerHTML += grupos;
    });
}

function unirseagrupo(id, nombre) {
    Swal.fire({
        title: "¿Quiereas unirte a <br>" + nombre + "?",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, unirse!"
    }).then((result) => {
        if (result.isConfirmed) {
            var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
            var formData = new FormData();
            formData.append('id', id);
            formData.append('nombre', nombre);
            formData.append('_token', csrfToken);
            fetch("/unirseagrupo", {
                method: "POST",
                body: formData
            }).then(response => {
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
    });
}