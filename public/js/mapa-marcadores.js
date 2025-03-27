/**
 * Gestión de marcadores en el mapa
 */

// Función para cargar los lugares y mostrarlos en el mapa
function cargarLugaresEnMapa(map) {
    // Limpiar marcadores anteriores
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];

    // Obtener los lugares del servidor
    fetch('/api/places')
        .then(response => response.json())
        .then(data => {
            // Agrupar lugares por categoría para los marcadores
            const categoriesMap = {};
            data.forEach(place => {
                if (place.coordenadas_lat && place.coordenadas_lon) {
                    // Crear icono según la categoría
                    let icon;
                    if (place.categoria) {
                        // Si la categoría ya tiene un icono asignado, usarlo
                        if (!categoriesMap[place.categoria.id]) {
                            categoriesMap[place.categoria.id] = {
                                name: place.categoria.nombre,
                                icon: L.divIcon({
                                    html: `<i class="fas ${place.categoria.icono || 'fa-map-marker-alt'}" style="color: ${place.categoria.color || '#0d6efd'}"></i>`,
                                    className: 'marker-icon',
                                    iconSize: [30, 30],
                                    iconAnchor: [15, 30]
                                })
                            };
                        }
                        icon = categoriesMap[place.categoria.id].icon;
                    } else {
                        // Icono por defecto
                        icon = L.divIcon({
                            html: `<i class="fas fa-map-marker-alt" style="color: #0d6efd"></i>`,
                            className: 'marker-icon',
                            iconSize: [30, 30],
                            iconAnchor: [15, 30]
                        });
                    }

                    // Crear marcador con el icono
                    const marker = L.marker([place.coordenadas_lat, place.coordenadas_lon], {
                        icon: icon,
                        category: place.categoria ? place.categoria.id : null,
                        tags: place.tags ? place.tags.map(tag => tag.id) : [],
                        favorite: place.favorite || false
                    }).addTo(map);

                    // Añadir popup con información del lugar
                    marker.bindPopup(crearContenidoPopup(place));
                    
                    // Añadir el marcador al array de marcadores
                    markers.push(marker);
                }
            });

            // Si hay marcadores, ajustar la vista del mapa para mostrarlos todos
            if (markers.length > 0) {
                const group = L.featureGroup(markers);
                map.fitBounds(group.getBounds(), { padding: [50, 50] });
            }
        })
        .catch(error => {
            console.error('Error al cargar lugares:', error);
        });
}

// Función para crear el contenido del popup de un lugar
function crearContenidoPopup(place) {
    // Imagen del lugar (si existe)
    const imgHtml = place.imagen 
        ? `<img src="${place.imagen}" alt="${place.nombre}" class="img-fluid mb-2" style="max-height: 150px;">`
        : '';

    // Etiquetas
    const tagsHtml = place.tags && place.tags.length > 0
        ? `
            <div class="mt-2">
                ${place.tags.map(tag => `<span class="badge bg-secondary me-1">${tag.nombre}</span>`).join('')}
            </div>
        `
        : '';

    // Botón de favorito
    const favoriteBtn = `
        <button class="btn btn-sm ${place.favorite ? 'btn-warning' : 'btn-outline-warning'} toggle-favorite mt-2" 
            data-place-id="${place.id}" 
            title="${place.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
            <i class="fas fa-star"></i>
        </button>
    `;

    // Botón de ruta
    const routeBtn = `
        <button class="btn btn-sm btn-outline-primary calculate-route mt-2 ms-2" 
            data-lat="${place.coordenadas_lat}" 
            data-lon="${place.coordenadas_lon}" 
            title="Calcular ruta">
            <i class="fas fa-route"></i>
        </button>
    `;

    // Botón de compartir
    const shareBtn = `
        <button class="btn btn-sm btn-outline-success share-place mt-2 ms-2" 
            data-place-id="${place.id}" 
            title="Compartir">
            <i class="fas fa-share-alt"></i>
        </button>
    `;

    // Contenido completo del popup
    return `
        <div class="place-popup">
            ${imgHtml}
            <h5>${place.nombre}</h5>
            <p class="mb-1">${place.descripcion || ''}</p>
            <small class="text-muted">${place.direccion || ''}</small>
            ${tagsHtml}
            <div class="d-flex">
                ${favoriteBtn}
                ${routeBtn}
                ${shareBtn}
            </div>
        </div>
    `;
}

// Función para filtrar marcadores según criterios
function filtrarMarcadores(filters) {
    markers.forEach(marker => {
        let visible = true;
        
        // Filtrar por categorías
        if (filters.categories.length > 0) {
            if (!marker.options.category || !filters.categories.includes(marker.options.category)) {
                visible = false;
            }
        }
        
        // Filtrar por etiquetas
        if (filters.tags.length > 0) {
            if (!marker.options.tags || !marker.options.tags.some(tag => filters.tags.includes(tag))) {
                visible = false;
            }
        }
        
        // Filtrar por favoritos
        if (filters.favorites && !marker.options.favorite) {
            visible = false;
        }
        
        // Mostrar u ocultar el marcador
        if (visible) {
            if (!map.hasLayer(marker)) {
                map.addLayer(marker);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
}

// Inicializar eventos de marcadores cuando se cargan
function inicializarEventosMarcadores() {
    // Eventos para los botones de los popups
    document.addEventListener('click', function(e) {
        // Toggle favorito
        if (e.target.closest('.toggle-favorite')) {
            const button = e.target.closest('.toggle-favorite');
            const placeId = button.getAttribute('data-place-id');
            toggleFavorito(placeId, button);
        }
        
        // Calcular ruta
        if (e.target.closest('.calculate-route')) {
            const button = e.target.closest('.calculate-route');
            const lat = button.getAttribute('data-lat');
            const lon = button.getAttribute('data-lon');
            calcularRuta(lat, lon);
        }
        
        // Compartir lugar
        if (e.target.closest('.share-place')) {
            const button = e.target.closest('.share-place');
            const placeId = button.getAttribute('data-place-id');
            compartirLugar(placeId);
        }
    });
}

// Función para toggle favorito
function toggleFavorito(placeId, button) {
    // Esta función se implementaría para cambiar el estado de favorito
    console.log(`Toggle favorito para lugar ${placeId}`);
    
    // Aquí iría una llamada a la API para cambiar el estado
    // Por ahora solo simulamos el cambio en la interfaz
    if (button.classList.contains('btn-warning')) {
        button.classList.remove('btn-warning');
        button.classList.add('btn-outline-warning');
        button.setAttribute('title', 'Añadir a favoritos');
    } else {
        button.classList.remove('btn-outline-warning');
        button.classList.add('btn-warning');
        button.setAttribute('title', 'Quitar de favoritos');
    }
}

// Función para calcular ruta hasta un lugar
function calcularRuta(lat, lon) {
    // Esta función se implementaría para calcular rutas usando servicios de rutas
    console.log(`Calcular ruta hasta ${lat}, ${lon}`);
    
    // Aquí iría la implementación con un servicio de rutas como leaflet-routing-machine
}

// Función para compartir un lugar
function compartirLugar(placeId) {
    // Esta función se implementaría para compartir lugares
    console.log(`Compartir lugar ${placeId}`);
    
    // Aquí iría la implementación para compartir (ej: copiar enlace, compartir en redes, etc)
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventosMarcadores();
});
