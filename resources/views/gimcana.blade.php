<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurGimcana - Turismo y Gimcanas Interactivas</title>
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS para mapas interactivos -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" rel="stylesheet">
    {{-- link estilos css --}}
    <link href="{{ asset('css/clientegimcana.css') }}" rel="stylesheet">
    {{-- SweetAlert --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fas fa-map-marked-alt me-2"
                    style="color: var(--primary-color);"></i>TurGimcana</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('index') }}"><i class="fas fa-home me-1"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('mapa') }}"><i class="fas fa-map me-1"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('gimcana') }}"><i class="fas fa-puzzle-piece me-1"></i>
                            Gimcana</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto"><i class="fas fa-envelope me-1"></i> Contacto</a>
                    </li>
                    <li class="nav-item ms-lg-3">
                        <a class="btn btn-outline-primary" href="{{ route('login') }}"><i
                                class="fas fa-sign-in-alt me-1"></i> Acceder</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <section>
        <div id="infogrupos">
            <div>
                <h1>Buscas un grupo?</h1>
                <form action="" method="post" id="frmbuscargrupo" onsubmit="buscargrupo(event)">
                    @csrf
                    <div class="filter-container">
                        <input type="text" name="creador" id="creador" placeholder="Creador del grupo">
                        <input type="text" name="codigo" id="codigo" placeholder="Código del grupo">
                        <input type="text" name="gimcana" id="gimcana" placeholder="Nombre gimcana">
                        <div class="button-container">
                            <button type="submit">Buscar</button>
                            <button type="button" id="limpiarfiltros">Limpiar</button>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <h1>Unirse a una gimcana</h1>
                <button id="btnAbrirModal" class="full-width-button">Crear grupo</button>
                <div id="datos_grupos"></div>
            </div>
        </div>

        <div id="infogrupo">
            <div id="datos_grupo" class="container">
            </div>
        </div>
    </section>
    <div id="modalCrearGrupo" class="modal">
        <div class="modal-content">
            <h2>Crear Nuevo Grupo</h2>
            <form id="formCrearGrupo">
                <label for="nombreGrupo">Nombre del Grupo</label>
                @csrf
                <input type="hidden" name="id" id="id">
                <input type="text" name="nombreGrupo" id="nombreGrupo">
                <label for="integrantes">Número de Integrantes:</label>
                <input type="text" name="integrantes" id="integrantes">
                <label for="gimcana">Gimcana</label>
                <input type="text" name="buscargimcana" id="buscargimcana" placeholder="Busca una gimcana">
                <select name="gimcana" id="selectgimcana">
                    <option value="">Cargando..</option>
                </select>
                <button type="submit" id="btnCrearGrupo">Crear</button>
                <button type="button" id="btnCerrarModal">Cancelar</button>
            </form>
        </div>
    </div>
    <footer></footer>
</body>

</html>

<script src="{{ asset('js/gimcana/modal.js') }}"></script>
<script src="{{ asset('js/gimcana/datos.js') }}"></script>
<script src="{{ asset('js/gimcana/gimcana.js') }}"></script>
