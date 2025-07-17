(() => {
    const dashboardApp = (() => {
        const htmlElements = {
            nombreUsuario: document.querySelector('#nombre-usuario'),
            logoutBtn: document.querySelector('#logoutBtn'),
            bookForm: document.querySelector('.bookForm'),
            inputTitle: document.querySelector('#title'),
            inputAuthor: document.querySelector('#author'),
            inputDate: document.querySelector('#date'),
            inputPages: document.querySelector('#pages'),
            inputRecommend: document.querySelector('#recommend'),
            inputNotes: document.querySelector('#notes'),
            tableContainer: document.querySelector('#tableContainer'),
            totalBooks: document.querySelector('#totalBooks'),
            totalPages: document.querySelector('#totalPages'),
            respSection: document.querySelector('#resp')
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
            mostrarNombreUsuario: (username) => {
                const usuario = methods.obtenerInfoUsuario(username);
                if (usuario && htmlElements.nombreUsuario) {
                    htmlElements.nombreUsuario.textContent = usuario.nombreCompleto;
                }
            },
            obtenerLibros: (username) => {
                return JSON.parse(localStorage.getItem(`libros_${username}`)) || [];
            },
            guardarLibros: (username, libros) => {
                localStorage.setItem(`libros_${username}`, JSON.stringify(libros));
            },
            agregarLibro: (username, libroData) => {
                const libros = methods.obtenerLibros(username);
                libroData.id = Date.now().toString();
                libros.push(libroData);
                methods.guardarLibros(username, libros);
                methods.actualizarTablaLibros(username);
                methods.actualizarEstadisticas(username);
                return true;
            },
            eliminarLibro: (username, libroId) => {
                const libros = methods.obtenerLibros(username);
                const nuevosLibros = libros.filter(libro => libro.id !== libroId);
                methods.guardarLibros(username, nuevosLibros);
                methods.actualizarTablaLibros(username);
                methods.actualizarEstadisticas(username);
            },
            formatearFecha: (fechaStr) => {
                const fecha = new Date(fechaStr);
                return fecha.toLocaleDateString('es-ES');
            },
            crearTablaLibros: (libros) => {
                if (libros.length === 0) {
                    return '<p>No has agregado ningún libro todavía.</p>';
                }
                
                let tablaHTML = `
                <table class="books-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Fecha de lectura</th>
                            <th>Páginas</th>
                            <th>Recomendado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
                
                libros.forEach(libro => {
                    tablaHTML += `
                    <tr>
                        <td>${libro.title}</td>
                        <td>${libro.author}</td>
                        <td>${methods.formatearFecha(libro.date)}</td>
                        <td>${libro.pages}</td>
                        <td>${libro.recommend}</td>
                        <td>
                            <button class="delete-btn" data-id="${libro.id}">Eliminar</button>
                        </td>
                    </tr>
                    `;
                });
                
                tablaHTML += `
                    </tbody>
                </table>
                `;
                
                return tablaHTML;
            },
            actualizarTablaLibros: (username) => {
                const libros = methods.obtenerLibros(username);
                if (htmlElements.tableContainer) {
                    htmlElements.tableContainer.innerHTML = methods.crearTablaLibros(libros);
                    if (libros.length > 0 && htmlElements.respSection) {
                        htmlElements.respSection.classList.remove('oculto');
                    }
                    const deleteButtons = document.querySelectorAll('.delete-btn');
                    deleteButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            const libroId = e.target.getAttribute('data-id');
                            methods.eliminarLibro(username, libroId);
                        });
                    });
                }
            },
            actualizarEstadisticas: (username) => {
                const libros = methods.obtenerLibros(username);
                const totalLibros = libros.length;
                const totalPaginas = libros.reduce((total, libro) => total + parseInt(libro.pages), 0);
                
                if (htmlElements.totalBooks) {
                    htmlElements.totalBooks.textContent = totalLibros;
                }
                
                if (htmlElements.totalPages) {
                    htmlElements.totalPages.textContent = totalPaginas;
                }
            },
            handleFormSubmit: (event, username) => {
                event.preventDefault();
                
                const libroData = {
                    title: htmlElements.inputTitle.value.trim(),
                    author: htmlElements.inputAuthor.value.trim(),
                    date: htmlElements.inputDate.value,
                    pages: parseInt(htmlElements.inputPages.value),
                    recommend: htmlElements.inputRecommend.value,
                    notes: htmlElements.inputNotes.value.trim()
                };
                
                if (methods.agregarLibro(username, libroData)) {
                    htmlElements.bookForm.reset();
                    alert('Libro agregado correctamente');
                }
            },
            cerrarSesion: () => {
                localStorage.removeItem('sesionActiva');
                window.location.href = 'index.html';
            },
            
            init: () => {
                const username = methods.verificarSesion();
                if (!username) return;
                methods.mostrarNombreUsuario(username);
                methods.actualizarTablaLibros(username);
                methods.actualizarEstadisticas(username);

                if (htmlElements.bookForm) {
                    htmlElements.bookForm.addEventListener('submit', (e) => methods.handleFormSubmit(e, username));
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
    dashboardApp.init();
})();