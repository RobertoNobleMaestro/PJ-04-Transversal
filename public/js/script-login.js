document.addEventListener("DOMContentLoaded", function () {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const formulario = document.querySelector('.auth-form');

    function mostrarError(id, mensaje) {
        const errorSpan = document.getElementById(id);
        if (!errorSpan) {
            const input = document.getElementById(id.replace('Error', ''));
            errorSpan = document.createElement('span');
            errorSpan.id = id;
            errorSpan.className = 'error-message';
            errorSpan.style.color = 'red';
            errorSpan.style.fontSize = '0.8rem';
            errorSpan.style.marginTop = '0.25rem';
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        }
        errorSpan.textContent = mensaje;
        const input = document.getElementById(id.replace('Error', ''));
        if (input) {
            input.style.borderColor = "red";
        }
    }

    function limpiarError(id) {
        const errorSpan = document.getElementById(id);
        if (errorSpan) {
            errorSpan.textContent = "";
            const input = document.getElementById(id.replace('Error', ''));
            if (input) {
                input.style.borderColor = "";
            }
        }
    }

    function validarEmail() {
        const value = email.value.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value === "") {
            mostrarError("emailError", "El email está vacío");
            return false;
        } else if (!regex.test(value)) {
            mostrarError("emailError", "El email no tiene un formato válido");
            return false;
        } else if (value.length > 100) {
            mostrarError("emailError", "El email no puede exceder los 100 caracteres");
            return false;
        } else {
            limpiarError("emailError");
            return true;
        }
    }

    function validarPassword() {
        const value = password.value.trim();

        if (value === "") {
            mostrarError("passwordError", "La contraseña está vacía");
            return false;
        } else if (value.length < 6) {
            mostrarError("passwordError", "La contraseña debe tener al menos 6 caracteres");
            return false;
        } else if (value.length > 50) {
            mostrarError("passwordError", "La contraseña no puede exceder los 50 caracteres");
            return false;
        } else {
            limpiarError("passwordError");
            return true;
        }
    }

    // Eventos para validar en tiempo real
    email.addEventListener('blur', validarEmail);
    password.addEventListener('blur', validarPassword);

    email.addEventListener('input', validarEmail);
    password.addEventListener('input', validarPassword);

    formulario.addEventListener('submit', function (event) {
        let formIsValid = true;

        if (!validarEmail()) formIsValid = false;
        if (!validarPassword()) formIsValid = false;

        if (!formIsValid) {
            event.preventDefault();
            // Enfocar el primer campo con error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                const input = document.getElementById(firstError.id.replace('Error', ''));
                if (input) {
                    input.focus();
                }
            }
        }
    });
});
