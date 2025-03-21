
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


mostrardatos();

function mostrardatos() {
    var form = document.getElementById("frmbuscargrupo");
    // var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    var formData = new FormData(form);
    // var formData = new FormData();
    // formData.append('_token', csrfToken);
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
            grupos += '        <p>Grupo completo</p>';
        } else {
            grupos += '        <p>Quedan ' + dato.miembros + ' plazas</p>';
            grupos += '        <button type="button" onclick=unirseagrupo(' + dato.id + ')>Unirse</button>';
        }
        grupos += '     </div>';
        grupos += '</div>';
        datos_grupos.innerHTML += grupos;
    });
}


function unirseagrupo(id) {
    Swal.fire({
        title: "Are you sure?" + id,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
            var formData = new FormData();
            formData.append('id', id);
            formData.append('_token', csrfToken);
            fetch("/unirseagrupo", {
                method: "POST",
                body: formData
            }).then(response => {
                return response.text();
            })
                .then(data => {
                    if (data == 'Sin asignar' || data == "Tecnico asignado") {
                        Swal.fire({
                            title: data,
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        datosincidencias()
                    } else {
                        Swal.fire({
                            title: data,
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })
        }
    });

}