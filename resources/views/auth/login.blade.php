<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="{{asset('css/styles-form.css')}}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="container d-flex flex-row w-100 justify-content-center align-items-center form-container">
    <div class="container-todo  d-flex flex-row w-100">
        <div class="col-6 d-flex justify-content-center align-items-center">
            <img src="{{asset('img/logo.png')}}" alt="" style="width: 200px;">
        </div>
        <div class="col-6 d-flex">
            <form method="POST" action="{{ route('login') }}" style="width: 80%;">
                @csrf
                @method('POST')
                <div class="mb-3">
                    <h2>LOGIN</h2>
                    <label for="email" class="form-label">Email: </label>
                    <input type="text" name="email" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input type="password" name="password" class="form-control">
                </div>
                <div class="mb-3 d-flex flex-column justify-content-between text-center">
                    <button type="submit" class="text-uppercase btn-form mb-2">Login</button>
                    <span class="fw-bold">¿Todavía sin cuenta? <a href="{{route('register') }}" class="text-decoration-none">Registrarse</a></span>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="{{asset('js/script-register.js')}}"></script>
</body>
</html>