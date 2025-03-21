var map = L.map('map').setView([41.349, 2.1104], 15);

// Agregar capa de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors'
}).addTo(map);

// Agregar marcador inicial para Bellvitge
var bellvitgeMarker = L.marker([41.349, 2.1104]).addTo(map)
    .bindPopup('<b>Bellvitge</b><br>Un barrio emblemático de Hospitalet de Llobregat.')
    .openPopup();

// Variable para almacenar el control de la ruta
var routeControl;

// Función para agregar el marcador del usuario
function addUserMarker(lat, lng, label) {
    var iconColor = '#FF5733'; // Color del marcador

    var marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<i class="fas fa-map-pin" style="color: ${iconColor};"></i>`, // Personalizar el color
            iconSize: [30, 30]
        })
    }).addTo(map)
    .bindPopup('<b>' + label + '</b>')
    .openPopup();

    // Marcadores en la lista debajo de la barra de búsqueda
    var markerDiv = document.createElement('div');
    markerDiv.classList.add('marker-item');
    markerDiv.innerHTML = `<i class="fas fa-map-pin me-2" style="color: ${iconColor};"></i> ${label}`;
    document.getElementById('userMarkers').appendChild(markerDiv);

    // Asignar evento al hacer clic en el icono de la barra
    markerDiv.onclick = function () {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
                var userLat = position.coords.latitude;
                var userLon = position.coords.longitude;

                // Actualizar la ubicación del usuario en el mapa
                if (routeControl) {
                    routeControl.spliceWaypoints(0, 1, L.latLng(userLat, userLon));
                }

                // Centrar el mapa en la nueva ubicación del usuario
                map.setView([userLat, userLon], 15);
            }, function (error) {
                alert("No se pudo obtener la ubicación del usuario.");
            }, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            });

            // Si ya existe una ruta, la eliminamos antes de crear una nueva
            if (routeControl) {
                routeControl.setWaypoints([L.latLng(userLat, userLon), L.latLng(lat, lng)]);
            } else {
                // Crear una nueva ruta
                routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLon), // Ubicación del usuario
                        L.latLng(lat, lng)          // Ubicación del marcador
                    ],
                    routeWhileDragging: true,
                    createMarker: function() { return null; } // No mostrar un marcador extra en la ruta
                }).addTo(map);
            }
        } else {
            alert("Geolocalización no está disponible en tu navegador.");
        }
    };
}

// Lógica para la barra de búsqueda
document.getElementById('searchButton').addEventListener('click', function () {
    var query = document.getElementById('searchInput').value;

    if (query) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    map.setView([lat, lon], 15); // Mover el mapa a la ubicación buscada

                    var marker = L.marker([lat, lon], {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: `<i class="fas fa-map-pin" style="color: #007bff;"></i>`, // Personalizar el color
                            iconSize: [30, 30]
                        })
                    }).addTo(map)
                    .bindPopup('<b>' + query + '</b>')
                    .openPopup();

                    // Agregar el marcador a la lista de marcadores
                    addUserMarker(lat, lon, query);
                }
            });
    }
});

// Formulari per afegir marcadors manualment
document.getElementById('coordinatesForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var lat = parseFloat(document.getElementById('lat').value);
    var lon = parseFloat(document.getElementById('lon').value);

    if (!isNaN(lat) && !isNaN(lon)) {
        var label = "Nuevo marcador";
        
        // Añadir el marcador con las coordenadas introducidas
        addUserMarker(lat, lon, label);
    } else {
        alert("Las coordenadas no son válidas.");
    }
});

// Ejemplo random de la casa del usuario
addUserMarker(41.350, 2.115, 'Casa del Usuario');


navigator.geolocation.getCurrentPosition(
    (position) => {
        posUsuario = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        map.setView([posUsuario.lat, posUsuario.lng], 15);

        // Marcar posición del usuario
        L.marker([posUsuario.lat, posUsuario.lng], { draggable: true }).addTo(map)
            .bindPopup("Estás aquí")
            .openPopup()
            .on('dragend', (e) => {
                posUsuario = e.target.getLatLng(); // Actualizamos la ubicación del usuario
                actualizarRuta();
            });

        // Seguimiento en tiempo real
        navigator.geolocation.watchPosition(actualizarUbicacion, mostrarError, opcionesGPS);
    },
    mostrarError,
    opcionesGPS
);