<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurGimcana - Turismo y Gimcanas Interactivas</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS para mapas interactivos -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" rel="stylesheet">
    {{-- link estilos css --}}
    <link href="{{ asset('css/stylesIndex.css') }}" rel="stylesheet">
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="fas fa-map-marked-alt me-2" style="color: var(--primary-color);"></i>TurGimcana</a>
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
                        <a class="nav-link" href="{{ route('gimcana') }}"><i class="fas fa-puzzle-piece me-1"></i> Gimcana</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto"><i class="fas fa-envelope me-1"></i> Contacto</a>
                    </li>
                    <li class="nav-item ms-lg-3">
                        <a class="btn btn-outline-primary" href="{{ route('login') }}"><i class="fas fa-sign-in-alt me-1"></i> Acceder</a>
                    </li>
                    
                </ul>
            </div>
        </div>
    </nav>

    <!-- PÁGINA DE INICIO -->
    <section id="inicio" class="hero-section">
        <div class="hero-content text-center">
            <h1>Descubre y Juega</h1>
            <p class="mx-auto" style="max-width: 600px;">Explora lugares increíbles y participa en gimcanas interactivas. Crea tu propia aventura o únete a otras existentes.</p>
            <div class="d-flex justify-content-center gap-2">
                <a href="{{ route('register') }}" class="btn btn-primary btn-lg me-2"><i class="fas fa-user-plus me-1"></i> Registrarse</a>
                <a href="#explorar" class="btn btn-outline-light btn-lg"><i class="fas fa-compass me-1"></i> Explorar</a>
            </div>
        </div>
    </section>
    
    <!-- Sección de características -->
    <section class="container mb-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold">¿Qué te ofrecemos?</h2>
            <p class="lead">Descubre todas las posibilidades que nuestra plataforma tiene para ti</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card feature-card">
                    <div class="card-body text-center py-4">
                        <i class="fas fa-map-marked-alt feature-icon"></i>
                        <h3 class="card-title h5 fw-bold">Mapas Interactivos</h3>
                        <p class="card-text">Explora lugares de interés con nuestros mapas personalizados y filtros avanzados.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card feature-card">
                    <div class="card-body text-center py-4">
                        <i class="fas fa-puzzle-piece feature-icon"></i>
                        <h3 class="card-title h5 fw-bold">Gimcanas Divertidas</h3>
                        <p class="card-text">Participa en gimcanas interactivas o crea las tuyas propias para compartir con amigos.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card feature-card">
                    <div class="card-body text-center py-4">
                        <i class="fas fa-users feature-icon"></i>
                        <h3 class="card-title h5 fw-bold">Experiencia Social</h3>
                        <p class="card-text">Forma grupos, compite con amigos y comparte tus experiencias en tiempo real.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>