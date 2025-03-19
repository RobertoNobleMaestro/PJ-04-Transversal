<!DOCTYPE html>
<html>
<head>
    <title>Registro</title>
    <link rel="stylesheet" href="{{asset('css/styles-form.css')}}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container d-flex flex-row w-100 justify-content-center align-items-center form-container">
        <div class="container-todo d-flex flex-row w-100">
            <div class="col-6 d-flex justify-content-center align-items-center" style="gap:30px;">
                <img src="{{asset('img/logo.png')}}" alt="Logo" style="width: 200px;">
            </div>
            <div class="col-6 d-flex">
                <form id="registrationForm" method="POST" action="{{ route('register') }}" style="width: 80%;">
                    @csrf
                    @method('POST')
                    <div class="mb-3">
                        <h2>REGÍSTRATE</h2>
                        <label for="nombre" class="form-label">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" class="form-control" placeholder="Introduzca aquí el nombre">
                        <span id="nombreError" class="error"></span>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Introduzca aquí el email">
                        <span id="emailError" class="error"></span>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña:</label>
                        <input type="password" id="password" name="password" class="form-control" placeholder="Introduzca aquí la contraseña">
                        <span id="passwordError" class="error"></span>
                    </div>
                    <div class="mb-3">
                        <label for="password_confirmation" class="form-label">Confirmar contraseña:</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" class="form-control" placeholder="Repita aquí la contraseña">
                        <span id="passwordConfirmationError" class="error"></span>
                    </div>
                    <div class="mb-3 d-flex flex-column justify-content-between text-center">
                        <button type="submit" class="btn-form text-uppercase mb-2">Registrarse</button>
                        <span class="fw-bold">¿YA TIENES CUENTA? <a href="{{route('login') }}" class="text-decoration-none">INICIA SESIÓN</a></span>
                    </div>
                    <br>
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <strong>{{ $errors->first() }}</strong>
                        </div>
                    @endif
                </form>
            </div>            
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{asset('js/script-register.js')}}"></script>
</body>
</html>
