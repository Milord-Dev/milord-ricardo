(() => {
    const loginApp = (() => {
        const htmlElements = {
            form: document.querySelector('#loginForm'),
            inputUsername: document.querySelector('input[name="username"]'),
            inputPassword: document.querySelector('input[name="password"]'),
            btnSubmit: document.querySelector('button[type="submit"]')
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
            verificarCredenciales: (username, password) => {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuario = usuarios.find(user => user.username === username);
                if (!usuario) {
                    return false;
                }
                const passwordHash = hashCode(password);
                return usuario.password === passwordHash;
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
            handleLogin: (event) => {
                event.preventDefault();
                
                const username = htmlElements.inputUsername.value.trim();
                const password = htmlElements.inputPassword.value;
                
                if (methods.verificarCredenciales(username, password)) {
                    methods.iniciarSesion(username);
                } else {
                    alert('Nombre de usuario o contraseña incorrectos');
                }
            },

            init: () => {
                methods.verificarSesion();
                if (htmlElements.form) {
                    htmlElements.form.addEventListener('submit', methods.handleLogin);
                } else {
                    console.error('No se encontró el formulario de login');
                }
            }
        }

        return {
            init: methods.init
        };
    })();
    loginApp.init();
})();