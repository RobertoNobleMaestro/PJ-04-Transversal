document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el elemento del mapa existe en la página actual
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.warn('Elemento del mapa no encontrado en la página actual.');
        return;
    }

    let map = null;
    let markers = []; // Array para almacenar todos los marcadores
    let activeFilters = {
        categories: [],
        tags: [],
        favorites: false
    };

    // Función para inicializar el mapa en una ubicación dada
    function inicializarMapa(lat, lng) {
        console.log('Inicializando mapa en:', lat, lng);
        
        // Crear el mapa y establecer la vista
        map = L.map('map').setView([lat, lng], 13);

        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Añadir control de escala
        L.control.scale().addTo(map);

        // Añadir control de búsqueda por dirección (geocodificación)
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false
        }).on('markgeocode', function(e) {
            const bbox = e.geocode.bbox;
            const poly = L.polygon([
                bbox.getSouthEast(),
                bbox.getNorthEast(),
                bbox.getNorthWest(),
                bbox.getSouthWest()
            ]).addTo(map);
            map.fitBounds(poly.getBounds());
            
            // Si estamos en modo de creación, establecer las coordenadas en el formulario
            if (window.creatingPlace) {
                const latlng = e.geocode.center;
                document.getElementById('crearLatitud').value = latlng.lat;
                document.getElementById('crearLongitud').value = latlng.lng;
                document.getElementById('crearDireccion').value = e.geocode.name;
                
                // Añadir marcador temporal
                if (window.tempMarker) {
                    map.removeLayer(window.tempMarker);
                }
                window.tempMarker = L.marker(latlng).addTo(map)
                    .bindPopup("Ubicación seleccionada: " + e.geocode.name)
                    .openPopup();
            }
        }).addTo(map);

        // Añadir control de capas para filtrar por categorías
        cargarControlesFiltros(map);

        // Asegurarse de que el mapa se renderice correctamente
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Cargar los lugares y mostrarlos en el mapa
        cargarLugaresEnMapa(map);

        // Añadir evento de clic en el mapa para permitir seleccionar ubicación
        map.on('click', function(e) {
            if (window.creatingPlace || window.editingPlace) {
                const latlng = e.latlng;
                
                // Actualizar los campos del formulario correspondiente
                if (window.creatingPlace) {
                    document.getElementById('crearLatitud').value = latlng.lat;
                    document.getElementById('crearLongitud').value = latlng.lng;
                    
                    // Obtener dirección mediante geocodificación inversa
                    geocoder.options.geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function(results) {
                        if (results.length > 0) {
                            document.getElementById('crearDireccion').value = results[0].name;
                        }
                    });
                    
                    // Añadir marcador temporal
                    if (window.tempMarker) {
                        map.removeLayer(window.tempMarker);
                    }
                    window.tempMarker = L.marker(latlng).addTo(map)
                        .bindPopup("Nueva ubicación seleccionada")
                        .openPopup();
                } else if (window.editingPlace) {
                    document.getElementById('editarLatitud').value = latlng.lat;
                    document.getElementById('editarLongitud').value = latlng.lng;
                    
                    // Obtener dirección mediante geocodificación inversa
                    geocoder.options.geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function(results) {
                        if (results.length > 0) {
                            document.getElementById('editarDireccion').value = results[0].name;
                        }
                    });
                    
                    // Añadir marcador temporal
                    if (window.tempEditMarker) {
                        map.removeLayer(window.tempEditMarker);
                    }
                    window.tempEditMarker = L.marker(latlng).addTo(map)
                        .bindPopup("Ubicación actualizada")
                        .openPopup();
                }
            }
        });

        return map;
    }

    // Función para cargar los controles de filtros
    function cargarControlesFiltros(map) {
        // Crear contenedor para los filtros
        const filterControl = L.control({position: 'topright'});
        
        filterControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'map-filter-control');
            div.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h5>Filtros</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <label class="form-label">Categorías</label>
                            <div id="category-filters"></div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Etiquetas</label>
                            <div id="tag-filters"></div>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="favorite-filter">
                            <label class="form-check-label" for="favorite-filter">
                                Solo favoritos
                            </label>
                        </div>
                        <button class="btn btn-sm btn-primary" id="apply-filters">Aplicar filtros</button>
                        <button class="btn btn-sm btn-secondary" id="reset-filters">Resetear</button>
                    </div>
                </div>
            `;
            
            // Evitar que los clics en el control propaguen al mapa
            L.DomEvent.disableClickPropagation(div);
            
            return div;
        };
        
        filterControl.addTo(map);
        
        // Cargar categorías y etiquetas para los filtros
        cargarOpcionesFiltros();
        
        // Añadir event listeners para los botones de filtro
        setTimeout(() => {
            document.getElementById('apply-filters').addEventListener('click', aplicarFiltros);
            document.getElementById('reset-filters').addEventListener('click', resetearFiltros);
            document.getElementById('favorite-filter').addEventListener('change', function() {
                activeFilters.favorites = this.checked;
            });
        }, 500);
    }
    
    // Función para cargar las opciones de filtros
    function cargarOpcionesFiltros() {
        // Cargar categorías
        fetch('/admin/categories')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('category-filters');
                data.forEach(category => {
                    const div = document.createElement('div');
                    div.className = 'form-check';
                    div.innerHTML = `
                        <input class="form-check-input category-filter" type="checkbox" value="${category.id}" id="category-${category.id}">
                        <label class="form-check-label" for="category-${category.id}">
                            ${category.name}
                        </label>
                    `;
                    container.appendChild(div);
                });
                
                // Añadir event listeners para los checkboxes de categorías
                document.querySelectorAll('.category-filter').forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        const categoryId = parseInt(this.value);
                        if (this.checked) {
                            if (!activeFilters.categories.includes(categoryId)) {
                                activeFilters.categories.push(categoryId);
                            }
                        } else {
                            activeFilters.categories = activeFilters.categories.filter(id => id !== categoryId);
                        }
                    });
                });
            });
            
        // Cargar etiquetas
        fetch('/admin/tags')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('tag-filters');
                data.forEach(tag => {
                    const div = document.createElement('div');
                    div.className = 'form-check';
                    div.innerHTML = `
                        <input class="form-check-input tag-filter" type="checkbox" value="${tag.id}" id="tag-${tag.id}">
                        <label class="form-check-label" for="tag-${tag.id}">
                            ${tag.nombre}
                        </label>
                    `;
                    container.appendChild(div);
                });
                
                // Añadir event listeners para los checkboxes de etiquetas
                document.querySelectorAll('.tag-filter').forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        const tagId = parseInt(this.value);
                        if (this.checked) {
                            if (!activeFilters.tags.includes(tagId)) {
                                activeFilters.tags.push(tagId);
                            }
                        } else {
                            activeFilters.tags = activeFilters.tags.filter(id => id !== tagId);
                        }
                    });
                });
            });
    }
    
    // Función para aplicar filtros
    function aplicarFiltros() {
        // Limpiar todos los marcadores existentes
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Volver a cargar los lugares con los filtros aplicados
        cargarLugaresEnMapa(map);
    }
    
    // Función para resetear filtros
    function resetearFiltros() {
        // Resetear los checkboxes
        document.querySelectorAll('.category-filter, .tag-filter').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.getElementById('favorite-filter').checked = false;
        
        // Resetear los filtros activos
        activeFilters = {
            categories: [],
            tags: [],
            favorites: false
        };
        
        // Aplicar los filtros (que ahora están vacíos)
        aplicarFiltros();
    }

    // Función para cargar los lugares y mostrarlos en el mapa
    function cargarLugaresEnMapa(map) {
        console.log('Cargando lugares en el mapa...');
        
        // Limpiar marcadores existentes
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
        
        // Construir la URL con los parámetros de filtro
        let url = '/admin/places/getPlaces';
        const params = new URLSearchParams();
        
        if (activeFilters.categories.length > 0) {
            params.append('categories', activeFilters.categories.join(','));
        }
        
        if (activeFilters.tags.length > 0) {
            params.append('tags', activeFilters.tags.join(','));
        }
        
        if (activeFilters.favorites) {
            params.append('favorites', '1');
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        console.log('Solicitando lugares desde:', url);
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos de lugares recibidos:', data);
                
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn('No hay lugares disponibles o la respuesta no es un array.');
                    return;
                }

                // Verificar la estructura de los datos recibidos
                console.log('Primer lugar de ejemplo:', data[0]);

                data.forEach(place => {
                    // Verificar si las coordenadas son válidas
                    if (!place.coordenadas_lat || !place.coordenadas_lon) {
                        console.warn('Lugar con coordenadas inválidas:', place);
                        return;
                    }
                    
                    console.log(`Añadiendo marcador para ${place.nombre} en [${place.coordenadas_lat}, ${place.coordenadas_lon}]`);
                    
                    // Verificar todas las posibles estructuras de categoría para obtener el color y el icono
                    let categoryColor = '#3388ff'; // Color por defecto
                    let categoryIcon = 'fa-map-marker-alt'; // Icono por defecto
                    let categoryName = 'Sin categoría';
                    
                    // 1. Verificar estructura completa category/categoria
                    if (place.categoria) {
                        if (place.categoria.color) categoryColor = place.categoria.color;
                        if (place.categoria.icon) categoryIcon = place.categoria.icon;
                        if (place.categoria.name) categoryName = place.categoria.name;
                        if (place.categoria.nombre) categoryName = place.categoria.nombre;
                    } else if (place.category) {
                        if (place.category.color) categoryColor = place.category.color;
                        if (place.category.icon) categoryIcon = place.category.icon;
                        if (place.category.name) categoryName = place.category.name;
                        if (place.category.nombre) categoryName = place.category.nombre;
                    }
                    
                    // 2. Verificar si hay id de categoría y asignar color según id
                    // Colores correspondientes a las categorías según seeder:
                    const categoryColors = {
                        1: '#FF5733', // Museos
                        2: '#33FF57', // Restaurantes
                        3: '#3357FF', // Parques
                        4: '#FF33A1', // Monumentos
                        5: '#FFA500', // Mercados
                        6: '#8A2BE2', // Teatros
                        7: '#228B22'  // Estadios
                    };
                    
                    // Si tenemos category_id pero no tenemos color, usar el mapeo
                    if ((!place.categoria || !place.categoria.color) && (!place.category || !place.category.color)) {
                        const categoryId = place.category_id || (place.categoria ? place.categoria.id : null);
                        if (categoryId && categoryColors[categoryId]) {
                            categoryColor = categoryColors[categoryId];
                        }
                    }
                    
                    // Definir iconos por categoría según el id
                    const categoryIcons = {
                        1: 'fa-landmark', // Museos
                        2: 'fa-utensils',  // Restaurantes
                        3: 'fa-tree',      // Parques
                        4: 'fa-monument',  // Monumentos
                        5: 'fa-shopping-basket', // Mercados
                        6: 'fa-theater-masks',  // Teatros
                        7: 'fa-football-ball'   // Estadios
                    };
                    
                    // Si no tenemos icono pero tenemos category_id, usar el mapeo
                    if ((!place.categoria || !place.categoria.icon) && (!place.category || !place.category.icon)) {
                        const categoryId = place.category_id || (place.categoria ? place.categoria.id : null);
                        if (categoryId && categoryIcons[categoryId]) {
                            categoryIcon = categoryIcons[categoryId];
                        }
                    }
                    
                    // Asegurarse de que el icono incluya el prefijo "fa-"
                    if (categoryIcon && !categoryIcon.startsWith('fa-')) {
                        categoryIcon = 'fa-' + categoryIcon;
                    }
                    
                    // Crear un icono personalizado basado en la categoría
                    let customIcon;
                    
                    // Intentar usar un icono personalizado con FontAwesome
                    try {
                        customIcon = L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style="background-color: ${categoryColor};" class="marker-pin"></div><i class="fa ${categoryIcon}"></i>`,
                            iconSize: [30, 42],
                            iconAnchor: [15, 42]
                        });
                    } catch (error) {
                        console.warn('Error al crear icono personalizado:', error);
                        
                        // Si falla, usar el icono predeterminado de Leaflet
                        customIcon = L.icon({
                            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                            shadowSize: [41, 41]
                        });
                    }

                    // Crear un marcador para cada lugar con el icono personalizado
                    try {
                        const marker = L.marker([parseFloat(place.coordenadas_lat), parseFloat(place.coordenadas_lon)], {
                            icon: customIcon,
                            title: place.nombre
                        }).addTo(map);
                        
                        // Guardar referencia al marcador
                        markers.push(marker);
                        
                        // Preparar las etiquetas para mostrar en el popup
                        let tagsHtml = '';
                        if (place.etiquetas && place.etiquetas.length > 0) {
                            tagsHtml = '<div class="mt-2"><strong>Etiquetas:</strong> ';
                            tagsHtml += place.etiquetas.map(tag => {
                                // Verificar si la etiqueta es un objeto o un string
                                if (typeof tag === 'object' && tag !== null) {
                                    return `<span class="badge bg-secondary">${tag.nombre || tag.name || ''}</span>`;
                                } else {
                                    return `<span class="badge bg-secondary">${tag}</span>`;
                                }
                            }).join(' ');
                            tagsHtml += '</div>';
                        } else if (place.tags && place.tags.length > 0) {
                            tagsHtml = '<div class="mt-2"><strong>Etiquetas:</strong> ';
                            tagsHtml += place.tags.map(tag => {
                                // Verificar si la etiqueta es un objeto o un string
                                if (typeof tag === 'object' && tag !== null) {
                                    return `<span class="badge bg-secondary">${tag.nombre || tag.name || ''}</span>`;
                                } else {
                                    return `<span class="badge bg-secondary">${tag}</span>`;
                                }
                            }).join(' ');
                            tagsHtml += '</div>';
                        }
                        
                        const isFavorite = place.favorito === true || place.favorito === 1 || place.favorito === '1';
                        
                        // Añadir un popup con información del lugar
                        marker.bindPopup(`
                            <div class="place-popup">
                                <h5>${place.nombre}</h5>
                                <p>${place.descripcion || ''}</p>
                                <p><strong>Dirección:</strong> ${place.direccion || 'Sin dirección'}</p>
                                <p><strong>Categoría:</strong> ${categoryName}</p>
                                ${tagsHtml}
                                ${place.imagen ? `<img src="/storage/${place.imagen}" alt="${place.nombre}" class="img-fluid mt-2 mb-2">` : ''}
                                <div class="mt-2">
                                    <button class="btn btn-sm btn-primary toggle-favorite" data-id="${place.id}" data-favorite="${isFavorite ? '1' : '0'}">
                                        ${isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                    </button>
                                    <button class="btn btn-sm btn-info view-place" data-id="${place.id}">Ver detalles</button>
                                </div>
                            </div>
                        `);
                        
                        // Añadir event listener para el botón de favoritos después de abrir el popup
                        marker.on('popupopen', function() {
                            const toggleFavoriteBtn = document.querySelector(`.toggle-favorite[data-id="${place.id}"]`);
                            if (toggleFavoriteBtn) {
                                toggleFavoriteBtn.addEventListener('click', function() {
                                    const placeId = this.getAttribute('data-id');
                                    const isFavorite = this.getAttribute('data-favorite') === '1';
                                    
                                    // Enviar solicitud para actualizar el estado de favorito
                                    fetch(`/admin/places/${placeId}/toggle-favorite`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                                        },
                                        body: JSON.stringify({ favorito: !isFavorite })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            // Actualizar el texto del botón
                                            this.textContent = isFavorite ? 'Añadir a favoritos' : 'Quitar de favoritos';
                                            this.setAttribute('data-favorite', isFavorite ? '0' : '1');
                                            
                                            // Si el filtro de favoritos está activo, recargar el mapa
                                            if (activeFilters.favorites) {
                                                cargarLugaresEnMapa(map);
                                            }
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error al actualizar favorito:', error);
                                    });
                                });
                            }
                            
                            const viewPlaceBtn = document.querySelector(`.view-place[data-id="${place.id}"]`);
                            if (viewPlaceBtn) {
                                viewPlaceBtn.addEventListener('click', function() {
                                    const placeId = this.getAttribute('data-id');
                                    window.location.href = `/admin/places/${placeId}`;
                                });
                            }
                        });
                    } catch (error) {
                        console.error(`Error al crear marcador para ${place.nombre}:`, error);
                    }
                });
                
                console.log(`${markers.length} marcadores añadidos al mapa.`);
            })
            .catch(error => {
                console.error('Error al cargar los lugares:', error);
            });
    }

    // Verificar si estamos en una página con pestañas (como en el CRUD)
    const mapaTab = document.getElementById('mapa-tab');
    if (mapaTab) {
        // Si estamos en una página con pestañas, inicializar el mapa cuando se haga clic en la pestaña
        mapaTab.addEventListener('click', function() {
            // Solo inicializar si el mapa no existe
            if (!map) {
                // Ubicación por defecto (L'Hospitalet)
                setTimeout(() => {
                    inicializarMapa(41.3599, 2.0991);
                }, 300); // Pequeño retraso para asegurar que el contenedor esté visible
            } else {
                // Si el mapa ya existe, solo actualizar su tamaño
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);
            }
        });
        
        // Añadir event listeners para los botones de crear y editar lugar
        document.addEventListener('click', function(e) {
            // Botón para abrir modal de crear lugar
            if (e.target && e.target.id === 'CrearPlaceBtn') {
                window.creatingPlace = true;
                window.editingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempMarker && map) {
                    map.removeLayer(window.tempMarker);
                    window.tempMarker = null;
                }
            }
            
            // Botón para guardar nuevo lugar
            if (e.target && (e.target.id === 'guardarLugarBtn' || e.target.closest('#formCrearLugar button[type="submit"]'))) {
                window.creatingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempMarker && map) {
                    map.removeLayer(window.tempMarker);
                    window.tempMarker = null;
                }
            }
            
            // Botón para cancelar creación
            if (e.target && e.target.closest('#crearLugarModal .btn-secondary')) {
                window.creatingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempMarker && map) {
                    map.removeLayer(window.tempMarker);
                    window.tempMarker = null;
                }
            }
            
            // Botón para editar lugar
            if (e.target && e.target.classList.contains('btn-editar-lugar')) {
                window.editingPlace = true;
                window.creatingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempEditMarker && map) {
                    map.removeLayer(window.tempEditMarker);
                    window.tempEditMarker = null;
                }
            }
            
            // Botón para guardar lugar editado
            if (e.target && (e.target.id === 'actualizarLugarBtn' || e.target.closest('#formEditarLugar button[type="submit"]'))) {
                window.editingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempEditMarker && map) {
                    map.removeLayer(window.tempEditMarker);
                    window.tempEditMarker = null;
                }
            }
            
            // Botón para cancelar edición
            if (e.target && e.target.closest('#editarLugarModal .btn-secondary')) {
                window.editingPlace = false;
                
                // Limpiar marcador temporal si existe
                if (window.tempEditMarker && map) {
                    map.removeLayer(window.tempEditMarker);
                    window.tempEditMarker = null;
                }
            }
        });
    } else {
        // Si no estamos en una página con pestañas, inicializar el mapa directamente
        // Verificar si el navegador soporta geolocalización
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // Coordenadas de la ubicación actual
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    console.log('Geolocalización exitosa:', lat, lng);
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
    }
    
    // Exponer funciones globalmente para poder usarlas desde otros scripts
    window.mapFunctions = {
        inicializarMapa,
        cargarLugaresEnMapa,
        aplicarFiltros,
        resetearFiltros
    };
});
