<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurGimcana - Turismo y Gimcanas Interactivas</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS para mapas interactivos -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" rel="stylesheet">
    {{-- link estilos css --}}
    <link href="{{ asset('css/stylesIndex.css') }}" rel="stylesheet">
</head>
<style>
    .card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
        width: 40%;
        border-radius: 5px;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }

    img {
        border-radius: 5px 5px 0 0;
    }

    .container {
        padding: 2px 16px;
    }
</style>

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

        <div>
            <p>Buscas un grupo?</p>
            <form action="" method="post" id="frmbuscargrupo">
                @csrf
                <input type="text" name="creador" id="creador" placeholder="Creador del grupo">
                <input type="text" name="codigo" id="codigo" placeholder="Código del grupo">
                <button type="submit">Buscar</button>
            </form>
        </div>
        <div>
            <h1>Unirse a una gimcana</h1>
            <div id="datos_grupos">
                @foreach ($grupos as $grupo)
                    <div class="card">
                        <div class="container">
                            <h2>{{ $grupo->nombre }}</h2>
                            <p>Creador: {{ $grupo->creador }}</p>
                            @if ($grupo->miembros == 0)
                                <p>Grupo lleno</p>
                            @else
                                <p>Quedan {{ $grupo->miembros }} plazas</p>
                                <form action="" method="post">
                                    <input type="hidden" name="codigo" id="codigo" value="{{ $grupo->id }}">
                                    <button type="submit">Unirse</button>
                                </form>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
    <footer></footer>
</body>

</html>

<script src="{{ asset('js/gimcana/datos.js') }}"></script>
