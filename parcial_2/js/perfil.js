(() => {
    const perfilApp = (() => {
        const htmlElements = {
            nombreCompleto: document.querySelector('#nombreCompleto'),
            editNameForm: document.querySelector('#editNameForm'),
            nameUpdateMessage: document.querySelector('#nameUpdateMessage'),
            currentPassword: document.querySelector('#currentPassword'),
            newPassword: document.querySelector('#newPassword'),
            confirmPassword: document.querySelector('#confirmPassword'),
            changePasswordForm: document.querySelector('#changePasswordForm'),
            passwordUpdateMessage: document.querySelector('#passwordUpdateMessage'),
            logoutBtn: document.querySelector('#logoutBtn')
        }

        function hashCode(str) { 
            let hash = 0; 
            for (let i = 0; i < str.length; i++) { 
                let chr = str.charCodeAt(i); 
                hash = (hash << 5) - hash + chr; 
                hash |= 0; // Convierte a 32 bits 
            } 
            return hash; 
        }
        
        const methods = {
            verificarSesion: () => {
                const sesionActiva = localStorage.getItem('sesionActiva');
                if (!sesionActiva) {
                    window.location.href = 'login.html';
                    return false;
                }
                return sesionActiva;
            },

            obtenerInfoUsuario: (username) => {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                return usuarios.find(user => user.username === username);
            },
            cargarInfoUsuario: (username) => {
                const usuario = methods.obtenerInfoUsuario(username);
                if (usuario && htmlElements.nombreCompleto) {
                    htmlElements.nombreCompleto.value = usuario.nombreCompleto;
                }
            },
            actualizarNombre: (event) => {
                event.preventDefault();
                
                const username = methods.verificarSesion();
                if (!username) return;
                
                const nuevoNombre = htmlElements.nombreCompleto.value.trim();
                if (!nuevoNombre) {
                    htmlElements.nameUpdateMessage.textContent = 'El nombre no puede estar vacío';
                    htmlElements.nameUpdateMessage.style.color = 'red';
                    return;
                }
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuarioIndex = usuarios.findIndex(user => user.username === username);
                
                if (usuarioIndex !== -1) {
                    usuarios[usuarioIndex].nombreCompleto = nuevoNombre;
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    
                    htmlElements.nameUpdateMessage.textContent = 'Nombre actualizado correctamente';
                    htmlElements.nameUpdateMessage.style.color = 'green';

                    setTimeout(() => {
                        htmlElements.nameUpdateMessage.textContent = '';
                    }, 3000);
                }
            },

            cambiarContraseña: (event) => {
                event.preventDefault();
                
                const username = methods.verificarSesion();
                if (!username) return;
                
                const currentPassword = htmlElements.currentPassword.value;
                const newPassword = htmlElements.newPassword.value;
                const confirmPassword = htmlElements.confirmPassword.value;

                if (newPassword !== confirmPassword) {
                    htmlElements.passwordUpdateMessage.textContent = 'Las contraseñas no coinciden';
                    htmlElements.passwordUpdateMessage.style.color = 'red';
                    return;
                }
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuarioIndex = usuarios.findIndex(user => user.username === username);
                
                if (usuarioIndex !== -1) {
                    const usuario = usuarios[usuarioIndex];

                    if (usuario.password !== hashCode(currentPassword)) {
                        htmlElements.passwordUpdateMessage.textContent = 'La contraseña actual es incorrecta';
                        htmlElements.passwordUpdateMessage.style.color = 'red';
                        return;
                    }
                    usuarios[usuarioIndex].password = hashCode(newPassword);
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));

                    htmlElements.changePasswordForm.reset();
                    
                    htmlElements.passwordUpdateMessage.textContent = 'Contraseña actualizada correctamente';
                    htmlElements.passwordUpdateMessage.style.color = 'green';

                    setTimeout(() => {
                        htmlElements.passwordUpdateMessage.textContent = '';
                    }, 3000);
                }
            },

            cerrarSesion: () => {
                localStorage.removeItem('sesionActiva');
                window.location.href = 'index.html';
            },
            
            init: () => {
                const username = methods.verificarSesion();
                if (!username) return;
                
                methods.cargarInfoUsuario(username);

                if (htmlElements.editNameForm) {
                    htmlElements.editNameForm.addEventListener('submit', methods.actualizarNombre);
                }
                
                if (htmlElements.changePasswordForm) {
                    htmlElements.changePasswordForm.addEventListener('submit', methods.cambiarContraseña);
                }
                
                if (htmlElements.logoutBtn) {
                    htmlElements.logoutBtn.addEventListener('click', methods.cerrarSesion);
                }
            }
        }
        return {
            init: methods.init
        };
    })();
    perfilApp.init();
})();