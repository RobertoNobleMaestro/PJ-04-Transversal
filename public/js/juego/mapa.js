document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa en las coordenadas de Hospitalet de Llobregat
    const map = L.map('map').setView([41.3662, 2.1079], 15);

    // Añadir la capa de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Marcador para la ubicación del usuario
    let userMarker;
    let userLocationCircle;
    let watchId;
    let checkpointsData = [];
    let updateInterval; // Intervalo para actualizar la posición cada 10 segundos
    let detectionRadius = 100; // Radio de detección en metros

    const checkpointPendingIcon = L.icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
    });

    // Cargar los datos de los checkpoints desde la API
    function loadCheckpoints() {
        fetch('/gimcana/juego/data')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar los datos');
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    console.log('Datos recibidos de la API:', data.checkpoints);
                    
                    // Ordenar los checkpoints por ID para asegurar el orden
                    checkpointsData = data.checkpoints.sort((a, b) => a.id - b.id);
                    
                    // Verificar si hay checkpoints
                    if (checkpointsData.length === 0) {
                        showNoCheckpointsMessage('No hay checkpoints disponibles para esta gimcana.');
                        return;
                    }
                    
                    // Limpiar cualquier ruta existente
                    if (window.routingControl) {
                        map.removeControl(window.routingControl);
                    }
                    
                    // Actualizar el mapa con el siguiente checkpoint pendiente para el grupo
                    updateMapWithNextGroupCheckpoint();
                    
                    // Si ya tenemos la ubicación del usuario, comprobar proximidad
                    if (userMarker) {
                        checkProximityToNextCheckpoint();
                    }
                } else if (data.status === 'warning') {
                    // Mostrar mensaje de advertencia
                    console.warn('Advertencia:', data.message);
                    showNoCheckpointsMessage(data.message);
                } else {
                    // Mostrar error
                    console.error('Error:', data.error);
                    showNoCheckpointsMessage(data.error || 'Error al cargar los checkpoints');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNoCheckpointsMessage('Error de conexión al cargar los checkpoints');
            });
    }
    
    // Función para mostrar un mensaje cuando no hay checkpoints
    function showNoCheckpointsMessage(message) {
        document.getElementById('hintPanel').innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> <strong>Atención:</strong> ${message}
            </div>
        `;
        document.getElementById('hintPanel').style.display = 'block';
    }

    // Función para actualizar el mapa con el siguiente checkpoint pendiente para el grupo
    function updateMapWithNextGroupCheckpoint() {
        // Limpiar marcadores existentes
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && layer !== userMarker) {
                map.removeLayer(layer);
            }
        });
        
        // Encontrar el primer checkpoint no completado por el grupo
        const nextCheckpoint = checkpointsData.find(checkpoint => !checkpoint.completed);
        
        if (!nextCheckpoint) {
            showNoCheckpointsMessage('¡Tu grupo ha completado todos los checkpoints de la gimcana!'); 
            return;
        }
        
        console.log('Siguiente checkpoint para el grupo:', nextCheckpoint);
        
        // NO añadir el checkpoint al mapa inicialmente - se mostrará solo cuando esté en el radio
        // Solo mostrar la pista textual para ayudar a buscar
        
        // Verificar si el usuario ya completó el checkpoint actual pero está esperando al grupo
        const currentUserCompletedButWaiting = nextCheckpoint.userCompleted && !nextCheckpoint.completed;
        
        // Mostrar SOLO la pista del siguiente checkpoint (no la prueba) si todos han completado el anterior
        if (!currentUserCompletedButWaiting) {
            document.getElementById('hintPanel').innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> <strong>Pista para llegar al checkpoint:</strong> ${nextCheckpoint.pista}
                    <button class="btn-sm btn-primary float-end ms-2" id="verDetalleBtn">Ver detalles</button>
                </div>
            `;
            document.getElementById('hintPanel').style.display = 'block';
            
            // Añadir el event listener al botón
            document.getElementById('verDetalleBtn').addEventListener('click', function() {
                showCheckpointDetail(nextCheckpoint.id);
            });
        } else {
            // Si el usuario ya completó pero está esperando al grupo, ocultar el panel de pistas
            document.getElementById('hintPanel').style.display = 'none';
        }
    }
    
    // Función para comprobar si estamos cerca del siguiente checkpoint
    function checkProximityToNextCheckpoint() {
        if (!userMarker) return;
        
        const nextCheckpoint = checkpointsData.find(checkpoint => !checkpoint.completed);
        if (!nextCheckpoint) return;
        
        const userLat = userMarker.getLatLng().lat;
        const userLng = userMarker.getLatLng().lng;
        
        const distance = calculateDistance(userLat, userLng, nextCheckpoint.lat, nextCheckpoint.lng);
        console.log(`Distancia al siguiente checkpoint: ${distance.toFixed(2)} metros`);
        
        // Actualizar el círculo de detección para que siempre tenga el radio definido
        if (userLocationCircle) {
            userLocationCircle.setRadius(detectionRadius);
        }
        
        // Si está dentro del radio de detección
        if (distance <= detectionRadius) {
            // Añadir el checkpoint al mapa SOLO cuando esté dentro del radio
            // Verificar si ya existe este marcador
            let markerExists = false;
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker && layer !== userMarker) {
                    // Si hay otro marcador que no es el usuario, asumimos que es el checkpoint
                    markerExists = true;
                }
            });
            
            // Si no existe el marcador, crearlo
            if (!markerExists) {
                console.log('Mostrando checkpoint en el mapa - estás en el radio de detección');
                const marker = L.marker([nextCheckpoint.lat, nextCheckpoint.lng], { icon: checkpointPendingIcon })
                    .addTo(map);

                marker.bindPopup(`
                    <div class="checkpoint-popup">
                        <h3>${nextCheckpoint.name}</h3>
                        <p>Estado: <span style="color: red;">Pendiente</span></p>
                        <button class="btn-primary" onclick="showCheckpointDetail(${nextCheckpoint.id})">Ver detalle</button>
                    </div>
                `);
            }
            
            // Mostrar el modal con la prueba
            showCheckpointProximityAlert(nextCheckpoint);
        } else {
            // Si está fuera del radio, quitar el marcador del checkpoint si existe
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker && layer !== userMarker) {
                    map.removeLayer(layer);
                }
            });
        }
    }

    // Función para calcular la distancia entre dos puntos (fórmula de Haversine)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Radio de la tierra en metros
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distancia en metros
    }

    // Función para iniciar el seguimiento de la ubicación del usuario
    function startLocationTracking() {
        if (navigator.geolocation) {
            // Iniciar el seguimiento continuo
            watchId = navigator.geolocation.watchPosition(
                positionUpdateHandler,
                function(error) {
                    console.error('Error al obtener la ubicación:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al obtener tu ubicación: ' + error.message,
                        icon: 'error',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Cerrar'
                    });
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000, // 10 segundos
                    timeout: 10000
                }
            );
            
            // Adicionalmente, actualizar la posición cada 10 segundos
            updateInterval = setInterval(function() {
                navigator.geolocation.getCurrentPosition(
                    positionUpdateHandler,
                    function(error) {
                        console.error('Error en actualización periódica:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 5000
                    }
                );
                
                // Comprobar proximidad a checkpoints
                checkProximityToNextCheckpoint();
                
            }, 10000); // 10 segundos
            
            // Cambiar el texto del botón
            document.getElementById('startTracking').textContent = 'Ubicación activa';
            document.getElementById('startTracking').disabled = true;
            
            // Cargar los checkpoints después de activar la ubicación
            loadCheckpoints();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Tu navegador no soporta geolocalización',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        }
    }
    
    // Manejador de actualización de posición
    function positionUpdateHandler(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        // Si es la primera vez o el marcador no existe, crearlo
        if (!userMarker) {
            userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div class="pulse"></div>',
                    iconSize: [20, 20]
                })
            }).addTo(map);

            userLocationCircle = L.circle([lat, lng], {
                radius: detectionRadius, // Radio de detección
                color: '#4A89F3',
                fillColor: '#81A8F3',
                fillOpacity: 0.3
            }).addTo(map);

            // Centrar el mapa en la ubicación del usuario
            map.setView([lat, lng], 17);
        } else {
            // Actualizar la posición del marcador y el círculo
            userMarker.setLatLng([lat, lng]);
            userLocationCircle.setLatLng([lat, lng]);
        }

        // Comprobar si estamos cerca del siguiente checkpoint
        checkProximityToNextCheckpoint();
    }

    // Función para detener el seguimiento cuando el usuario sale de la página
    window.addEventListener('beforeunload', function() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    });

    // Función para mostrar detalles de un checkpoint
    window.showCheckpointDetail = function(checkpointId) {
        const checkpoint = checkpointsData.find(cp => cp.id === checkpointId);
        if (checkpoint) {
            const detailPanel = document.getElementById('checkpointDetail');
            
            // Verificar si el usuario está dentro del radio del checkpoint
            let isWithinRadius = false;
            if (userMarker) {
                const userLat = userMarker.getLatLng().lat;
                const userLng = userMarker.getLatLng().lng;
                const distance = calculateDistance(userLat, userLng, checkpoint.lat, checkpoint.lng);
                isWithinRadius = distance <= detectionRadius;
            }
            
            // Si está dentro del radio, mostrar prueba y opción de responder
            // Si no, mostrar solo la pista para encontrarlo
            detailPanel.innerHTML = `
                <p><strong>Pista:</strong> ${checkpoint.pista}</p>
                ${isWithinRadius && !checkpoint.completed ? `
                    <div class="alert alert-warning">
                        <p><strong>Prueba:</strong> ${checkpoint.prueba}</p>
                    </div>
                    <div class="mt-3">
                        <input type="text" id="respuesta" class="form-control mb-2" placeholder="Tu respuesta aquí...">
                        <button class="btn-primary w-100" onclick="validarCheckpoint(${checkpoint.id})">Validar checkpoint</button>
                    </div>
                ` : isWithinRadius && checkpoint.completed ? `
                    <p class="text-success fw-bold">Checkpoint completado</p>
                ` : `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> Debes acercarte más al checkpoint para ver la prueba.
                    </div>
                `}
                <button class="btn btn-outline-secondary mt-2 w-100" onclick="document.getElementById('checkpointDetail').style.display='none'">Cerrar</button>
            `;
            detailPanel.style.display = 'block';
        }
    };

    // Función para validar un checkpoint
    window.validarCheckpoint = function(checkpointId) {
        // Obtenemos el valor de la respuesta directamente
        const respuesta = document.getElementById('respuesta').value;
        
        const formData = new FormData();
        formData.append('respuesta', respuesta);
        formData.append('_token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
        
        fetch(`/gimcana/juego/checkpoint/${checkpointId}/validar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('validationModal'));
                modal.hide();
                
                if (data.groupCompleted) {
                    // Si TODOS los miembros del grupo han completado el checkpoint
                    // Marcar el checkpoint como completado en nuestros datos locales
                    const index = checkpointsData.findIndex(c => c.id === checkpointId);
                    if (index !== -1) {
                        checkpointsData[index].completed = true;
                    }
                    
                    // Mostrar mensaje de éxito grupal con SweetAlert2
                    Swal.fire({
                        title: '¡Completado!',
                        text: '¡Todo el grupo ha completado el checkpoint! Avanzando al siguiente.',
                        icon: 'success',
                        confirmButtonColor: '#2A4D14',
                        confirmButtonText: 'Continuar'
                    }).then(() => {
                        // Actualizar el mapa para mostrar el siguiente checkpoint
                        updateMapWithNextGroupCheckpoint();
                    });
                } else {
                    // Si solo este usuario ha completado el checkpoint pero faltan otros miembros del grupo
                    // Mostrar un modal bloqueante que no permite hacer nada hasta que todos completen
                    Swal.fire({
                        title: 'Esperando al grupo',
                        html: `<p>${data.message}</p><p>Debes esperar a que todos los miembros del grupo completen este checkpoint para continuar.</p>`,
                        icon: 'info',
                        confirmButtonColor: '#2A4D14',
                        confirmButtonText: 'Entendido',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false
                    });
                    
                    // Ocultar el panel de pistas para el siguiente checkpoint
                    document.getElementById('hintPanel').style.display = 'none';
                    
                    // Configurar un intervalo para verificar si el grupo ha completado
                    const checkGroupCompletion = setInterval(() => {
                        fetch('/gimcana/juego/data')
                            .then(response => response.json())
                            .then(refreshData => {
                                if (refreshData.status === 'success') {
                                    // Buscar el checkpoint actual
                                    const updatedCheckpoint = refreshData.checkpoints.find(c => c.id === checkpointId);
                                    
                                    // Si el checkpoint ahora está completado por todo el grupo
                                    if (updatedCheckpoint && updatedCheckpoint.completed) {
                                        clearInterval(checkGroupCompletion);
                                        
                                        // Actualizar datos locales
                                        checkpointsData = refreshData.checkpoints.sort((a, b) => a.id - b.id);
                                        
                                        // Cerrar el modal de espera
                                        Swal.close();
                                        
                                        // Mostrar mensaje de éxito y avanzar
                                        Swal.fire({
                                            title: '¡Completado!',
                                            text: '¡Todo el grupo ha completado el checkpoint! Avanzando al siguiente.',
                                            icon: 'success',
                                            confirmButtonColor: '#2A4D14',
                                            confirmButtonText: 'Continuar'
                                        }).then(() => {
                                            // Actualizar el mapa para mostrar el siguiente checkpoint
                                            updateMapWithNextGroupCheckpoint();
                                        });
                                    }
                                }
                            })
                            .catch(error => {
                                console.error('Error al verificar el estado del grupo:', error);
                            });
                    }, 5000); 
                }
            } else {
                // Mostrar el error con SweetAlert2 en vez de en el formulario
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al validar el checkpoint',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        });
    }

    // Función para mostrar una alerta cuando estamos cerca de un checkpoint
    function showCheckpointProximityAlert(checkpoint) {
        // Evitar mostrar alertas innecesarias si el checkpoint ya está completado
        if (checkpoint.completed) return;
        
        // Control para no mostrar repetidamente el modal
        if (checkpoint.alertShown) return;
        
        // Marcar que ya se ha mostrado la alerta para este checkpoint
        checkpoint.alertShown = true;
        
        // Mostrar un modal con la PRUEBA (no solo la pista)
        const modal = document.getElementById('validationModal');
        const modalContent = document.getElementById('validationModalContent');
        
        // Contenido del modal
        modalContent.innerHTML = `
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">¡Has llegado al checkpoint!</h5>
                <button type="button" class="btn-close btn-close-white" id="closeModalBtn" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h4>${checkpoint.name}</h4>
                <p><strong>Pista:</strong> ${checkpoint.pista}</p>
                <p class="alert alert-warning"><strong>Prueba:</strong> ${checkpoint.prueba}</p>
                <form id="validationForm">
                    <div class="mt-3">
                        <label for="respuesta" class="form-label">Tu respuesta:</label>
                        <input type="text" name="respuesta" id="respuesta" class="form-control mb-2" required placeholder="Escribe tu respuesta aquí...">
                        <div id="validationError" class="alert alert-danger" style="display: none;"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="closeBtn">Cerrar</button>
                <button type="button" class="btn btn-success" onclick="validarCheckpoint(${checkpoint.id})">Validar respuesta</button>
            </div>
        `;
        
        // Mostrar el modal usando Bootstrap
        const bootstrapModal = new bootstrap.Modal(modal, {
            backdrop: 'static',
            keyboard: false
        });
        bootstrapModal.show();
        
        // Manejar el evento de cierre para volver a abrir el modal
        document.getElementById('closeBtn').addEventListener('click', function() {
            // Cerrar el modal actual
            bootstrapModal.hide();
            
            // Volver a abrir el modal después de un breve retraso
            setTimeout(() => {
                showCheckpointProximityAlert(checkpoint);
            }, 500);
        });
        
        // Manejar el botón de cierre en la esquina superior derecha
        document.getElementById('closeModalBtn').addEventListener('click', function() {
            // Cerrar el modal actual
            bootstrapModal.hide();
            
            // Volver a abrir el modal después de un breve retraso
            setTimeout(() => {
                showCheckpointProximityAlert(checkpoint);
            }, 500);
        });
        
        // Cuando se cierre el modal por otras razones, permitir que se muestre nuevamente
        modal.addEventListener('hidden.bs.modal', function(event) {
            // Solo reiniciar el estado si no fue cerrado por los botones que ya manejan la reapertura
            if (!event.clickEvent || (event.clickEvent.target.id !== 'closeBtn' && event.clickEvent.target.id !== 'closeModalBtn')) {
                setTimeout(() => {
                    checkpoint.alertShown = false;
                    // Volver a mostrar el modal
                    showCheckpointProximityAlert(checkpoint);
                }, 500);
            }
        });
    }

    // Cargar los datos al iniciar
    loadCheckpoints();

    // Botón para iniciar el seguimiento de ubicación
    document.getElementById('startTracking').addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-location-arrow"></i> Ubicación activa';
        
        // Primero cargar los checkpoints y luego iniciar el seguimiento
        loadCheckpoints();
        setTimeout(() => {
            startLocationTracking();
        }, 500);
    });

    // Botón para mostrar/ocultar info
    document.getElementById('toggleInfo').addEventListener('click', function() {
        const detailPanel = document.getElementById('checkpointDetail');
        if (detailPanel.style.display === 'block') {
            detailPanel.style.display = 'none';
        } else {
            detailPanel.innerHTML = `
                <h3>TurGimcana - Juego</h3>
                <p>Bienvenido al juego de TurGimcana. Busca los checkpoints en el mapa y responde correctamente a las pruebas para completarlos.</p>
                <p><strong>Instrucciones:</strong></p>
                <ul>
                    <li>Activa tu ubicación para ver tu posición en el mapa</li>
                    <li>Explora el mapa para encontrar los checkpoints</li>
                    <li>Al acercarte a un checkpoint, recibirás una notificación</li>
                    <li>Responde correctamente a la prueba para validar el checkpoint</li>
                </ul>
                <button class="btn btn-outline-secondary mt-2 w-100" onclick="document.getElementById('checkpointDetail').style.display='none'">Cerrar</button>
            `;
            detailPanel.style.display = 'block';
        }
    });
});