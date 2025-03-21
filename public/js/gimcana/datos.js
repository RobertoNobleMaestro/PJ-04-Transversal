mostrardatos();

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
            grupos += '        <p>Grupo completo</p>';
        } else {
            grupos += '        <p>Quedan ' + dato.miembros + ' plazas</p>';
            grupos += '        <form action="" method="post">';
            grupos += '            <input type="hidden" name="codigo" id="codigo" value="' + dato.id + '">';
            grupos += '            <button type="submit">Unirse</button>';
            grupos += '        </form>';
        }
        grupos += '     </div>';
        grupos += '</div>';
        datos_grupos.innerHTML += grupos;
    });
    console.log(datos);

}

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