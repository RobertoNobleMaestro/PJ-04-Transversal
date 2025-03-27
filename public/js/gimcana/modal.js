document.getElementById('btnAbrirModal').addEventListener('click', () => {
    cargagimcanas();
    const modal = document.getElementById('modalCrearGrupo');
    modal.style.display = 'flex';
});

document.getElementById('btnCerrarModal').addEventListener('click', () => {
    var form = document.getElementById("formCrearGrupo");
    form.reset();
    document.getElementById('modalCrearGrupo').style.display = 'none';
});

// Función para crear el grupo
document.getElementById('formCrearGrupo').addEventListener('submit', (event) => {
    if (!validarfrmcreargrupo(event)) {
        return;
    }
    var form = document.getElementById("formCrearGrupo");
    var formData = new FormData(form);
    fetch('/creargrupo', {
        method: 'POST',
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
                compronargrupousuario();
                form.reset();
                document.getElementById('modalCrearGrupo').style.display = 'none';
            }
        })
});

document.getElementById('buscargimcana').addEventListener('keyup', () => {
    cargagimcanas();
});

function cargagimcanas() {
    let buscargimcana = document.getElementById('buscargimcana').value;
    let resultado = document.getElementById('selectgimcana');
    var csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    var formData = new FormData();
    formData.append('nombre', buscargimcana);
    formData.append('_token', csrfToken);
    fetch('/cargagimcanas', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar los datos");
            return response.json();
        })
        .then(data => {
            let gimcanas = '';
            if (buscargimcana == '') {
                gimcanas += '<option value="">Selecciona una gimcana</option>';
            }
            data.forEach(dato => {
                gimcanas += '<option value="' + dato.id + '">' + dato.nombre + '</option>';
            });

            if (buscargimcana != '' && data.length == 0) {
                gimcanas += '<option value="">No se han encontrado gimcanas</option>';
            }
            resultado.innerHTML = gimcanas;
        })
}
