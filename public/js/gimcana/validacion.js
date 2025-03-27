var nombregrupo = document.getElementById('nombregrupo');
var integrantes = document.getElementById('integrantes');
var selectgimcana = document.getElementById('selectgimcana');

var errornombregrupo = document.getElementById('errornombregrupo');
var errorintegrantes = document.getElementById('errorintegrantes');
var errorselectgimcana = document.getElementById('errorselectgimcana');


nombregrupo.addEventListener('keyup', () => {
    let texto = nombregrupo.value
    //minimo 2 letras 
    if (texto.length < 3) {
        errornombregrupo.style.color = 'red';
        errornombregrupo.innerText = "El nombre debe de tener al menos 3 caracteres"
        return false;
    } else {
        errornombregrupo.innerText = ""
        console.log(true)
        return true
    }
});

integrantes.addEventListener('keyup', () => {
    let texto = integrantes.value

    //mayor a 1 y que solo sean numeros  
    if (/[^0-9]/.test(texto)) {
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "Escribe un nùmero"
        return false;
    }
    if (texto.length < 2) {
        errorintegrantes.style.color = 'red';
        errorintegrantes.innerText = "numero de integrantes minimo 2"
        return false;
    } else {
        errorintegrantes.innerText = ""
        console.log(true)
        return true
    }


    console.log(texto)
});

selectgimcana.addEventListener('change', () => {
    let texto = selectgimcana.value

    if (texto === '0') {
        selectgimcana.classList.add('error');
        return false;
    } else {
        selectgimcana.classList.remove('error');
        console.log(true)
        return true
    }


    console.log(texto)
});
