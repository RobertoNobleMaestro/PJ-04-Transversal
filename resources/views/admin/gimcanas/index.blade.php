<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrar Gimcanas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>Administrar Gimcanas</h1>
        <button id="btnCrearGimcana" class="btn btn-primary mb-3">Crear Gimcana</button>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Lugar</th>
                    <th>Pista</th>
                    <th>Prueba</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="gimcanasTable">
                <!-- Las gimcanas se cargarán aquí con AJAX -->
            </tbody>
        </table>
    </div>

    <script>
        // Cargar gimcanas al iniciar la página
        document.addEventListener('DOMContentLoaded', function() {
            fetch('/admin/gimcanas')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.getElementById('gimcanasTable');
                    tableBody.innerHTML = data.map(gimcana => `
                        <tr>
                            <td>${gimcana.id}</td>
                            <td>${gimcana.place_id}</td>
                            <td>${gimcana.pista}</td>
                            <td>${gimcana.prueba}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarGimcana(${gimcana.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarGimcana(${gimcana.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                });
        });

        // Función para crear una gimcana
        document.getElementById('btnCrearGimcana').addEventListener('click', function() {
            const nuevaGimcana = {
                place_id: 1, // Cambia esto por el ID del lugar que desees
                pista: 'Nueva pista',
                prueba: 'Nueva prueba'
            };

            fetch('/admin/gimcanas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaGimcana),
            })
            .then(response => response.json())
            .then(data => {
                alert('Gimcana creada con éxito');
                location.reload(); // Recargar la página para ver los cambios
            });
        });

        // Función para editar una gimcana
        function editarGimcana(id) {
            const gimcanaActualizada = {
                pista: 'Pista actualizada',
                prueba: 'Prueba actualizada'
            };

            fetch(`/admin/gimcanas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gimcanaActualizada),
            })
            .then(response => response.json())
            .then(data => {
                alert('Gimcana actualizada con éxito');
                location.reload(); // Recargar la página para ver los cambios
            });
        }

        // Función para eliminar una gimcana
        function eliminarGimcana(id) {
            fetch(`/admin/gimcanas/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.status === 204) {
                    alert('Gimcana eliminada con éxito');
                    location.reload(); // Recargar la página para ver los cambios
                }
            });
        }
    </script>
</body>
</html> 