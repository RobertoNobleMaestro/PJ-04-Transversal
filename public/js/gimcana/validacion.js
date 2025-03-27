var nombregrupo = document.getElementById('nombregrupo');
var integrantes = document.getElementById('integrantes');
var selectgimcana = document.getElementById('selectgimcana');

var errornombregrupo = document.getElementById('errornombregrupo');
var errorintegrantes = document.getElementById('errorintegrantes');
var errorselectgimcana = document.getElementById('errorselectgimcana');

nombregrupo.addEventListener('keyup', comprobarnombre);
integrantes.addEventListener('blur', comprointegrantes);
selectgimcana.addEventListener('change', comprogimcana);

function comprobarnombre() {
    let texto = nombregrupo.value
    let minletra = 4
    if (texto.length < minletra) {
        errornombregrupo.style.color = 'red';
        errornombregrupo.innerText = "El nombre debe de tener al menos " + minletra + " caracteres"
        return false;
    } else {
        errornombregrupo.innerText = ""
        return true
    }
}

function comprointegrantes() {
    let texto = integrantes.value
    let intminimos = 2
    let intmaximos = 4
    if (texto == "") {
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "El campo no puede estar vacio"
        return false;
    } else if (/[^0-9]/.test(texto)) {
        integrantes.value = "";
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "Escribe un número"
        return false;
    } else if (texto < intminimos) {
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "número de integrantes mínimo " + intminimos
        return false;
    }
    else if (texto > intmaximos) {
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "número de integrantes máximos " + intmaximos
        return false;
    } else {
        errorintegrantes.innerText = ""
        return true
    }
}

function comprogimcana() {
    let texto = selectgimcana.value
    if (texto == 0) {
        errorselectgimcana.style.color = 'red';
        errorselectgimcana.innerText = "Escoge una gimcana"
        return false;
    }
    else {
        errorselectgimcana.style.color = 'red';
        errorselectgimcana.innerText = ""
        return true;
    }
}

function validarfrmcreargrupo(event) {
    event.preventDefault();
    const isValid =
        comprobarnombre() &
        comprointegrantes() &
        comprogimcana()
    return isValid;
}