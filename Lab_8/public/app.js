// app.js (Frontend)
(() => {
    const API_BASE_URL = 'http://localhost:3000/api/products';

    const App = {
        htmlElements: {
            productForm: document.getElementById('product-form'),
            productIdInput: document.getElementById('product-id'),
            productNameInput: document.getElementById('product-name'),
            productPriceInput: document.getElementById('product-price'),
            productDescriptionInput: document.getElementById('product-description'),
            saveButton: document.getElementById('save-button'),
            cancelButton: document.getElementById('cancel-button'),

            productList: document.getElementById('product-list'),
            noProductsMessage: document.getElementById('no-products-message'),

            detailModal: document.getElementById('product-detail-modal'),
            closeModalButton: document.querySelector('#product-detail-modal .close-button'),
            detailId: document.getElementById('detail-id'),
            detailName: document.getElementById('detail-name'),
            detailPrice: document.getElementById('detail-price'),
            detailDescription: document.getElementById('detail-description'),
        },

        init() {
            App.methods.loadProducts();
            App.methods.addEventListeners();
        },

        methods: {
            addEventListeners() {
                App.htmlElements.productForm.addEventListener('submit', App.methods.handleFormSubmit);
                App.htmlElements.cancelButton.addEventListener('click', App.methods.resetForm);
                App.htmlElements.closeModalButton.addEventListener('click', App.methods.closeDetailModal);
                window.addEventListener('click', App.methods.handleClickOutsideModal);
            },

            toggleNoProductsMessage(show) {
                App.htmlElements.noProductsMessage.style.display = show ? 'block' : 'none';
            },

            clearProductList() {
                App.htmlElements.productList.innerHTML = '';
            },

            async loadProducts() {
                App.methods.clearProductList();
                App.methods.toggleNoProductsMessage(true);

                try {
                    const response = await fetch(API_BASE_URL);
                    if (!response.ok) throw new Error('Error al cargar los productos');
                    const products = await response.json();

                    if (products.length === 0) {
                        App.methods.toggleNoProductsMessage(true);
                    } else {
                        App.methods.toggleNoProductsMessage(false);
                        products.forEach(product => App.methods.renderProductCard(product));
                    }
                } catch (error) {
                    console.error('Error al cargar productos:', error);
                    alert('No se pudieron cargar los productos. Asegúrate de que el servidor esté corriendo.');
                    App.methods.toggleNoProductsMessage(true);
                }
            },

            renderProductCard(product) {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.setAttribute('data-id', product._id);

                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                    <p>${product.description.substring(0, 70)}${product.description.length > 70 ? '...' : ''}</p>
                    <div class="card-actions">
                        <button class="view-btn">Ver</button>
                        <button class="edit-btn">Editar</button>
                        <button class="delete-btn">Eliminar</button>
                    </div>
                `;

                productCard.querySelector('.view-btn').addEventListener('click', () => App.methods.viewProduct(product._id));
                productCard.querySelector('.edit-btn').addEventListener('click', () => App.methods.editProduct(product._id));
                productCard.querySelector('.delete-btn').addEventListener('click', () => App.methods.deleteProduct(product._id));

                App.htmlElements.productList.appendChild(productCard);
            },

            async handleFormSubmit(event) {
                event.preventDefault();

                const id = App.htmlElements.productIdInput.value;
                const name = App.htmlElements.productNameInput.value.trim();
                const price = parseFloat(App.htmlElements.productPriceInput.value);
                const description = App.htmlElements.productDescriptionInput.value.trim();

                if (!name || isNaN(price) || !description) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }

                const productData = { name, price, description };

                try {
                    let response;
                    if (id) {
                        response = await fetch(`${API_BASE_URL}/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(productData),
                        });
                        if (!response.ok) throw new Error('Error al actualizar el producto');
                        alert('Producto actualizado exitosamente.');
                    } else {
                        response = await fetch(API_BASE_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(productData),
                        });
                        if (!response.ok) throw new Error('Error al crear el producto');
                        alert('Producto creado exitosamente.');
                    }
                    App.methods.resetForm();
                    App.methods.loadProducts();
                } catch (error) {
                    console.error('Error al guardar el producto:', error);
                    alert(`Error al guardar el producto: ${error.message}`);
                }
            },

            resetForm() {
                App.htmlElements.productIdInput.value = '';
                App.htmlElements.productNameInput.value = '';
                App.htmlElements.productPriceInput.value = '';
                App.htmlElements.productDescriptionInput.value = '';
                App.htmlElements.saveButton.textContent = 'Guardar Producto';
                App.htmlElements.cancelButton.style.display = 'none';
            },

            async editProduct(id) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${id}`);
                    if (!response.ok) throw new Error('Producto no encontrado para editar');
                    const product = await response.json();

                    App.htmlElements.productIdInput.value = product._id;
                    App.htmlElements.productNameInput.value = product.name;
                    App.htmlElements.productPriceInput.value = product.price;
                    App.htmlElements.productDescriptionInput.value = product.description;

                    App.htmlElements.saveButton.textContent = 'Actualizar Producto';
                    App.htmlElements.cancelButton.style.display = 'inline-block';
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } catch (error) {
                    console.error('Error al cargar producto para edición:', error);
                    alert(`No se pudo cargar el producto para editar: ${error.message}`);
                }
            },

            async deleteProduct(id) {
                if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    return;
                }
                try {
                    const response = await fetch(`${API_BASE_URL}/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                         if (response.status === 404) {
                            throw new Error('Producto no encontrado para eliminar.');
                         }
                        throw new Error('Error al eliminar el producto.');
                    }
                    alert('Producto eliminado exitosamente.');
                    App.methods.loadProducts();
                } catch (error) {
                    console.error('Error al eliminar producto:', error);
                    alert(`Error al eliminar el producto: ${error.message}`);
                }
            },

            async viewProduct(id) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${id}`);
                    if (!response.ok) throw new Error('Producto no encontrado para mostrar detalles');
                    const product = await response.json();

                    App.htmlElements.detailId.textContent = product._id;
                    App.htmlElements.detailName.textContent = product.name;
                    App.htmlElements.detailPrice.textContent = product.price.toFixed(2);
                    App.htmlElements.detailDescription.textContent = product.description;
                    App.htmlElements.detailModal.style.display = 'block';
                } catch (error) {
                    console.error('Error al cargar detalles del producto:', error);
                    alert(`No se pudieron cargar los detalles del producto: ${error.message}`);
                }
            },

            closeDetailModal() {
                App.htmlElements.detailModal.style.display = 'none';
            },

            handleClickOutsideModal(event) {
                if (event.target === App.htmlElements.detailModal) {
                    App.methods.closeDetailModal();
                }
            },
        },
    };

    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
})();