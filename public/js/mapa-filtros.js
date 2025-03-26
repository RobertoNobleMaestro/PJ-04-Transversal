/**
 * Sistema de filtrado para el mapa
 */

// Variables globales
let activeFilters = {
    categories: [],
    tags: [],
    favorites: false
};

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
    
    // Cargar etiquetas (tags)
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
    if (typeof filtrarMarcadores === 'function') {
        filtrarMarcadores(activeFilters);
    } else {
        console.error('La función filtrarMarcadores no está disponible');
    }
}

// Función para resetear filtros
function resetearFiltros() {
    // Resetear estado de los checkboxes
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('.tag-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('favorite-filter').checked = false;
    
    // Resetear filtros activos
    activeFilters = {
        categories: [],
        tags: [],
        favorites: false
    };
    
    // Aplicar cambios
    aplicarFiltros();
}
