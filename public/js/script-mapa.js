var map = L.map('map').setView([41.349, 2.1104], 15);

// Agregar capa de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap contributors'
}).addTo(map);

// Variable para almacenar el control de la ruta
var routeControl;

// Variable para la ubicación del usuario
var posUsuario = { lat: 0, lng: 0 };

// Opciones para la geolocalización
const opcionesGPS = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000
};

// Función para actualizar la ubicación en el mapa
function actualizarUbicacion(position) {
    posUsuario = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    // Actualizamos la vista del mapa en la ubicación del usuario
    map.setView([posUsuario.lat, posUsuario.lng], 15);

    // Si ya hay un marcador del usuario, lo movemos
    if (userMarker) {
        userMarker.setLatLng([posUsuario.lat, posUsuario.lng]);
    }
}

// Función para manejar errores de geolocalización
function mostrarError(error) {
    console.warn(`Error de geolocalización: ${error.message}`);
}

// Obtener la ubicación inicial del usuario
navigator.geolocation.getCurrentPosition(
    (position) => {
        posUsuario = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // Mover el mapa a la ubicación inicial del usuario
        map.setView([posUsuario.lat, posUsuario.lng], 15);

        // Marcar la ubicación del usuario
        var userMarker = L.marker([posUsuario.lat, posUsuario.lng], { draggable: true }).addTo(map)
            .bindPopup("Estás aquí")
            .openPopup()
            .on('dragend', (e) => {
                posUsuario = e.target.getLatLng(); // Actualizamos la ubicación del usuario
                actualizarRuta(); // Actualizamos la ruta si se mueve el marcador
            });

        // Seguimiento en tiempo real de la ubicación del usuario
        navigator.geolocation.watchPosition(actualizarUbicacion, mostrarError, opcionesGPS);
    },
    mostrarError,
    opcionesGPS
);

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
    .on('click', () => {
        // Dibujar la ruta entre la ubicación del usuario y el marcador
        if (routeControl) {
            routeControl.setWaypoints([L.latLng(posUsuario.lat, posUsuario.lng), L.latLng(lat, lng)]);
        } else {
            // Crear una nueva ruta
            routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(posUsuario.lat, posUsuario.lng), // Ubicación del usuario
                    L.latLng(lat, lng)          // Ubicación del marcador
                ],
                routeWhileDragging: true,
                createMarker: function() { return null; } // No mostrar un marcador extra en la ruta
            }).addTo(map);
        }
    });

    // Marcadores en la lista debajo de la barra de búsqueda
    var markerDiv = document.createElement('div');
    markerDiv.classList.add('marker-item');
    markerDiv.innerHTML = `<i class="fas fa-map-pin me-2" style="color: ${iconColor};"></i> ${label}`;
    document.getElementById('userMarkers').appendChild(markerDiv);
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
