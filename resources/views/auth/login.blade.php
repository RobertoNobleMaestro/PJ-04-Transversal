<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="{{ route('index') }}"><i class="fas fa-map-marked-alt me-2" style="color: var(--primary-color);"></i>TurGimcana</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('index') }}"><i class="fas fa-home me-1" style="color: var(--primary-color);"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('mapa') }}"><i class="fas fa-map me-1" style="color: var(--primary-color);"></i> Mapa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('gimcana') }}"><i class="fas fa-puzzle-piece me-1" style="color: var(--primary-color);"></i> Gimcana</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto"><i class="fas fa-envelope me-1" style="color: var(--primary-color);"></i> Contacto</a>
                    </li>
                    <li class="nav-item ms-lg-3">
                        <a class="btn btn-outline-primary" href="{{ route('index') }}"><i class="fas fa-arrow-left me-1" style="color: var(--primary-color);"></i> Volver</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="auth-container">
        <div class="auth-form-container">
            <div class="auth-header">
                <h2>INICIAR SESIÓN</h2>
            </div>
            <form method="POST" action="{{ route('login') }}" class="auth-form">
                @csrf
                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="text" name="email" id="email" class="form-control" value="maria@example.com">
                    <span id="emailError" class="error-message"></span>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input type="password" name="password" id="password" class="form-control">
                    <span id="passwordError" class="error-message"></span>
                </div>
                <button type="submit" class="btn-form">Login</button>
                <div class="auth-footer">
                    <span>¿TODAVÍA SIN CUENTA? <a href="{{ route('register') }}">REGISTRARSE</a></span>
                </div>
                @if ($errors->any())
                    <div class="alert alert-danger mt-3">
                        <strong>{{ $errors->first() }}</strong>
                    </div>
                @endif
            </form>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/script-login.js') }}"></script>
</body>

</html>
