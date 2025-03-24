document.getElementById('btnAbrirModal').addEventListener('click', () => {
    document.getElementById('modalCrearGrupo').style.display = 'block';
});

document.getElementById('btnCerrarModal').addEventListener('click', () => {
    var form = document.getElementById("formCrearGrupo");
    form.reset();
    document.getElementById('modalCrearGrupo').style.display = 'none';
});

// Función para crear el grupo
document.getElementById('formCrearGrupo').addEventListener('submit', (event) => {
    event.preventDefault();
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