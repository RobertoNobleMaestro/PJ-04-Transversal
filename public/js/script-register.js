document.addEventListener("DOMContentLoaded", function () {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('password_confirmation');
    const formulario = document.getElementById('registrationForm');

    function mostrarError(id, mensaje) {
        const errorSpan = document.getElementById(id);
        if (errorSpan) {
            errorSpan.textContent = mensaje;
            const input = document.getElementById(id.replace('Error', ''));
            if (input) {
                input.style.borderColor = "red";
            }
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

    function validarNombre() {
        const value = nombre.value.trim();
        const regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s'-]+$/;

        if (value === "") {
            mostrarError("nombreError", "El nombre de usuario está vacío");
            nombre.style.borderColor = "red";
            return false;
        } else if (value.length < 3) {
            mostrarError("nombreError", "El nombre debe tener al menos 3 caracteres");
            nombre.style.borderColor = "red";
            return false;
        } else if (value.length > 50) {
            mostrarError("nombreError", "El nombre no puede exceder los 50 caracteres");
            nombre.style.borderColor = "red";
            return false;
        } else if (!regex.test(value)) {
            mostrarError("nombreError", "El nombre no puede contener números ni caracteres especiales");
            nombre.style.borderColor = "red";
            return false;
        } else {
            limpiarError("nombreError");
            nombre.style.borderColor = "";
            return true;
        }
    }

    function validarEmail() {
        const value = email.value.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (value === "") {
            mostrarError("emailError", "El email está vacío");
            email.style.borderColor = "red";
            return false;
        } else if (!regex.test(value)) {
            mostrarError("emailError", "El email no tiene un formato válido");
            email.style.borderColor = "red";
            return false;
        } else if (value.length > 100) {
            mostrarError("emailError", "El email no puede exceder los 100 caracteres");
            email.style.borderColor = "red";
            return false;
        } else {
            limpiarError("emailError");
            email.style.borderColor = "";
            return true;
        }
    }

    function validarPassword() {
        const value = password.value.trim();
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

        if (value === "") {
            mostrarError("passwordError", "La contraseña está vacía");
            password.style.borderColor = "red";
            return false;
        } else if (value.length < 6) {
            mostrarError("passwordError", "La contraseña debe tener al menos 6 caracteres");
            password.style.borderColor = "red";
            return false;
        } else if (!regex.test(value)) {
            mostrarError("passwordError", "La contraseña debe contener al menos una mayúscula, una minúscula y un número");
            password.style.borderColor = "red";
            return false;
        } else if (value.length > 50) {
            mostrarError("passwordError", "La contraseña no puede exceder los 50 caracteres");
            password.style.borderColor = "red";
            return false;
        } else {
            limpiarError("passwordError");
            password.style.borderColor = "";
            return true;
        }
    }

    function validarPasswordConfirm() {
        if (passwordConfirmation.value.trim() === "") {
            mostrarError("passwordConfirmationError", "Debes repetir la contraseña");
            passwordConfirmation.style.borderColor = "red";
            return false;
        } else if (passwordConfirmation.value !== password.value) {
            mostrarError("passwordConfirmationError", "Las contraseñas no coinciden");
            passwordConfirmation.style.borderColor = "red";
            return false;
        } else {
            limpiarError("passwordConfirmationError");
            passwordConfirmation.style.borderColor = "";
            return true;
        }
    }

    // Eventos para validar en tiempo real
    nombre.addEventListener('blur', validarNombre);
    email.addEventListener('blur', validarEmail);
    password.addEventListener('blur', validarPassword);
    passwordConfirmation.addEventListener('blur', validarPasswordConfirm);

    // Añadir validación en tiempo real para todos los campos
    nombre.addEventListener('input', validarNombre);
    email.addEventListener('input', validarEmail);
    password.addEventListener('input', validarPassword);
    passwordConfirmation.addEventListener('input', validarPasswordConfirm);

    formulario.addEventListener('submit', function (event) {
        let formIsValid = true;

        if (!validarNombre()) formIsValid = false;
        if (!validarEmail()) formIsValid = false;
        if (!validarPassword()) formIsValid = false;
        if (!validarPasswordConfirm()) formIsValid = false;

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