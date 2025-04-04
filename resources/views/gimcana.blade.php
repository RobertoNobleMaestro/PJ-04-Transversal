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
    {{-- CSS para detalles de grupo --}}
    <link href="{{ asset('css/grupo-detalle.css') }}" rel="stylesheet">
    {{-- SweetAlert --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
<div class="mobile-header">
        <div class="logo-container">
            <div class="logo-text">TurGimcana</div>
        </div>
    </div>

    <!-- Footer móvil -->
    <div class="mobile-footer">
        <a href="{{ route('mapa') }}" class="footer-tab">
            <i class="fas fa-map footer-icon"></i>
            <span>Mapa</span>
        </a>
        <a href="{{ route('gimcana') }}" class="footer-tab active">
            <i class="fas fa-puzzle-piece footer-icon"></i>
            <span>Gimcana</span>
        </a>
        @auth
            <a href="{{ route('favorites.index') }}" class="footer-tab">
                <i class="fas fa-heart footer-icon"></i>
                <span>Favoritos</span>
            </a>
        @endauth
        <form action="{{ route('logout') }}" method="POST" class="footer-tab">
            @csrf
            <button type="submit"
                style="background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
                <i class="fas fa-sign-out-alt footer-icon"></i>
                <span style="color: #666666;">Logout</span>
            </button>
        </form>
    </div>

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
        <div id="modalCrearGrupo" class="modal">
            <div class="modal-content">
                <h2>Crear Nuevo Grupo</h2>
                <form id="formCrearGrupo">
                    <label for="nombreGrupo">Nombre del Grupo</label>
                    @csrf
                    <input type="hidden" name="id" id="id">
                    <input type="text" name="nombreGrupo" id="nombregrupo" placeholder="nombre grupo">
                    <span id="errornombregrupo"></span>
                    <label for="integrantes">Número de Integrantes:</label>
                    <input type="text" name="integrantes" id="integrantes" placeholder="mínimo 2 y máximo 4">
                    <span id="errorintegrantes"></span>
                    <label for="gimcana">Gimcana</label>
                    <input type="text" name="buscargimcana" id="buscargimcana" placeholder="Busca una gimcana">
                    <select name="gimcana" id="selectgimcana">
                        <option value="">Cargando..</option>
                    </select>
                    <span id="errorselectgimcana"></span>
                    <button type="submit" id="btnCrearGrupo">Crear</button>
                    <button type="button" id="btnCerrarModal">Cancelar</button>
                </form>
            </div>
        </div>
    </section>
    <footer></footer>
</body>

</html>
<script src="{{ asset('js/gimcana/datos.js') }}"></script>
<script src="{{ asset('js/gimcana/modal.js') }}"></script>
<script src="{{ asset('js/gimcana/gimcana.js') }}"></script>
<script src="{{ asset('js/gimcana/validacion.js') }}"></script>
