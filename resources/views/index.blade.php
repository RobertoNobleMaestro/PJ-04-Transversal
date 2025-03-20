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
    <style>
/* Paleta de colores inspirada en la naturaleza */
:root {
    --primary-color: #4B7F52;    /* Verde bosque */
    --secondary-color: #7EA172;  /* Verde hoja claro */
    --dark-color: #2A4D14;       /* Verde oscuro */
    --light-color: #F7F9F4;      /* Blanco hueso natural */
    --accent-color: #D68C45;     /* Naranja tierra/atardecer */
    --water-color: #5DA2D5;      /* Azul agua */
    --stone-color: #8D8D8D;      /* Gris piedra */
    --earth-color: #A67C52;      /* Marrón tierra */
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--dark-color);
    background-color: var(--light-color);
}

/* Estilos del encabezado */
.navbar-brand {
    font-weight: 700;
    font-size: 1.8rem;
    color: var(--primary-color);
}

.navbar {
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    background-color: white;
}

.nav-link {
    color: var(--dark-color);
}

.nav-link:hover {
    color: var(--primary-color);
}

.btn-outline-primary {
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-outline-primary:hover {
    background-color: var(--primary-color);
    color: white;
}

/* Estilos de la página de inicio */
.hero-section {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/api/placeholder/1200/600');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 120px 0;
    margin-bottom: 40px;
}

.hero-content h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: var(--dark-color);
    border-color: var(--dark-color);
}

/* Estilos para las tarjetas de características */
.feature-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    border: none;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    background-color: white;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.feature-card:nth-child(1) .feature-icon {
    color: var(--water-color);  /* Icono de mapa con color agua */
}

.feature-card:nth-child(2) .feature-icon {
    color: var(--primary-color);  /* Icono de puzzle con color verde bosque */
}

.feature-card:nth-child(3) .feature-icon {
    color: var(--earth-color);  /* Icono de usuarios con color tierra */
}

/* Estilos para el mapa */
.map-container {
    height: 500px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 2px solid var(--secondary-color);
}

/* Estilos para el panel de administración */
.admin-sidebar {
    background-color: var(--light-color);
    padding: 20px;
    border-radius: 10px;
    height: 100%;
    border-left: 3px solid var(--primary-color);
}

/* Estilos para formularios */
.form-control, .btn {
    border-radius: 5px;
    padding: 10px 15px;
}

.form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(75, 127, 82, 0.25);
    border-color: var(--primary-color);
}

.btn-success {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
}

.btn-success:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

/* Estilos para la gimcana */
.gimcana-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    border: none;
}

.gimcana-card .card-header {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
}

/* Estilos del footer */
.footer {
    background-color: var(--dark-color);
    color: white;
    padding: 40px 0;
    margin-top: 50px;
}

.footer a {
    color: var(--light-color);
    text-decoration: none;
}

.footer a:hover {
    color: var(--accent-color);
}

.social-icon {
    font-size: 1.5rem;
    margin-right: 15px;
    transition: color 0.3s ease;
}

.social-icon:hover {
    color: var(--accent-color);
}

/* Estilos para el login/registro */
.auth-container {
    max-width: 450px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    background-color: white;
    border-top: 4px solid var(--primary-color);
}

/* Estilos responsivos */
@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .hero-content p {
        font-size: 1.1rem;
    }
    
    .map-container {
        height: 350px;
    }
}
    </style>
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
                        <a class="nav-link" href="#inicio"><i class="fas fa-home me-1"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#mapa"><i class="fas fa-map me-1"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#gimcana"><i class="fas fa-puzzle-piece me-1"></i> Gimcana</a>
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
        <div class="hero-content">
            <h1>Descubre y Juega</h1>
            <p>Explora lugares increíbles y participa en gimcanas interactivas. Crea tu propia aventura o únete a otras existentes.</p>
            <div>
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