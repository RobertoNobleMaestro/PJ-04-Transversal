document.addEventListener('DOMContentLoaded', function () {
    // Función para inicializar el mapa en una ubicación dada
    function inicializarMapa(lat, lng) {
        const map = L.map('map').setView([lat, lng], 13);

        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Cargar los lugares y mostrarlos en el mapa
        cargarLugaresEnMapa(map);

        return map;
    }

    // Verificar si el navegador soporta geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Coordenadas de la ubicación actual
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                inicializarMapa(lat, lng);
            },
            function (error) {
                console.error('Error al obtener la ubicación:', error);
                // Ubicación por defecto (L'Hospitalet)
                inicializarMapa(41.3599, 2.0991);
            }
        );
    } else {
        console.warn('Geolocalización no soportada. Usando ubicación por defecto.');
        inicializarMapa(41.3599, 2.0991);
    }
});

// Función para cargar los lugares y mostrarlos en el mapa
function cargarLugaresEnMapa(map) {
    fetch('/admin/places/getPlaces')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los datos.');
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.warn('No hay lugares disponibles.');
                return;
            }

            data.forEach(place => {
                if (!place.coordenadas_lat || !place.coordenadas_lon) {
                    console.warn('Lugar con coordenadas inválidas:', place);
                    return;
                }

                // Crear un marcador para cada lugar
                const marker = L.marker([place.coordenadas_lat, place.coordenadas_lon]).addTo(map);
                
                // Añadir un popup con información del lugar
                marker.bindPopup(`
                    <b>${place.nombre}</b><br>
                    ${place.direccion || 'Sin dirección'}<br>
                    Categoría: ${place.categoria?.nombre || 'Sin categoría'}
                `);
            });
        })
        .catch(error => console.error('Error al cargar los lugares:', error));
}
