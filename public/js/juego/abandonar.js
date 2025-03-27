// Funcionalidad para abandonar gimcana
document.addEventListener('DOMContentLoaded', function() {
    const abandonarGimcanaBtn = document.getElementById('abandonarGimcana');
    
    if (abandonarGimcanaBtn) {
        abandonarGimcanaBtn.addEventListener('click', function() {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Si abandonas la gimcana, perderás todo tu progreso actual.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, abandonar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar loading mientras se procesa
                    Swal.fire({
                        title: 'Abandonando gimcana...',
                        text: 'Por favor espera mientras se procesa tu solicitud',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    
                    // Hacer la petición para eliminar la relación del usuario con el grupo/gimcana
                    fetch('/gimcana/juego/abandonar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            Swal.fire({
                                title: 'Gimcana abandonada',
                                text: 'Has abandonado la gimcana correctamente',
                                icon: 'success',
                                confirmButtonColor: '#2A4D14'
                            }).then(() => {
                                // Redirigir al usuario a la página principal
                                window.location.href = '/gimcana';
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: data.message || 'Ha ocurrido un error al abandonar la gimcana',
                                icon: 'error',
                                confirmButtonColor: '#d33'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Ha ocurrido un error al abandonar la gimcana',
                            icon: 'error',
                            confirmButtonColor: '#d33'
                        });
                    });
                }
            });
        });
    }
});
