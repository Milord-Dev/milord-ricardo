(() => {
    const signupApp = (() => {
        const htmlElements = {
            form: document.querySelector('#registroForm'),
            inputUsuario: document.querySelector('#nombreUsuario'),
            inputNombre: document.querySelector('#nombre'),
            inputApellido: document.querySelector('#apellido'),
            inputContraseña: document.querySelector('#contraseña'),
            btnSubmit: document.querySelector('#btnSubmit')
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
            usuarioExiste: (username) => {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                return usuarios.some(user => user.username === username);
            },
            guardarUsuario: (userData) => {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                usuarios.push(userData);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            },
            iniciarSesion: (username) => {
                localStorage.setItem('sesionActiva', username);
                window.location.href = 'dashboard.html';
            },
            verificarSesion: () => {
                const sesionActiva = localStorage.getItem('sesionActiva');
                if (sesionActiva) {
                    window.location.href = 'dashboard.html';
                }
            },

            registrarUsuario: (event) => {
                event.preventDefault();
                const username = htmlElements.inputUsuario.value.trim();
                const nombre = htmlElements.inputNombre.value.trim();
                const apellido = htmlElements.inputApellido.value.trim();
                const password = htmlElements.inputContraseña.value;

                if (methods.usuarioExiste(username)) {
                    alert('El nombre de usuario ya está en uso. Por favor, elige otro.');
                    return;
                }
                const userData = {
                    username,
                    nombreCompleto: `${nombre} ${apellido}`,
                    password: hashCode(password)
                };

                methods.guardarUsuario(userData);
                methods.iniciarSesion(username);
            },

            init: () => {
                methods.verificarSesion();
                
                console.log('Formulario encontrado:', htmlElements.form);
                if (htmlElements.form) {
                    htmlElements.form.addEventListener('submit', (e) => {
                        console.log('Formulario enviado');
                        methods.registrarUsuario(e);
                    });
                } else {
                    console.error('No se encontró el formulario de registro');
                }
            }
        }
        return {
            init: methods.init
        };
    })();
    signupApp.init();
})();