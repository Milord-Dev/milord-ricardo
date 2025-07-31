// routes/productRoutes.js
import Product from '../models/product.js';

// Validación básica de datos
const validateProduct = (data) => {
  const errors = [];
  if (!data.name || data.name.trim() === '') {
    errors.push('El nombre es requerido.');
  }
  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.push('El precio debe ser un número positivo.');
  }
  if (!data.description || data.description.trim() === '') {
    errors.push('La descripción es requerida.');
  }
  return errors;
};

const productRoutes = async (fastify, options) => {
  // GET /api/products/ - Listar todos los productos
  fastify.get('/', async (request, reply) => {
    try {
      const products = await Product.find();
      return reply.send(products);
    } catch (error) {
      reply.code(500).send({ error: 'Error interno del servidor.' });
    }
  });

  // GET /api/products/:id - Obtener un producto por ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const product = await Product.findById(request.params.id);
      if (!product) {
        return reply.code(404).send({ error: 'Producto no encontrado.' });
      }
      return reply.send(product);
    } catch (error) {
      reply.code(500).send({ error: 'ID de producto inválido o error del servidor.' });
    }
  });

  // POST /api/products/ - Crear un nuevo producto
  fastify.post('/', async (request, reply) => {
    const errors = validateProduct(request.body);
    if (errors.length > 0) {
      return reply.code(400).send({ errors });
    }
    try {
      const newProduct = new Product(request.body);
      const savedProduct = await newProduct.save();
      return reply.code(201).send(savedProduct);
    } catch (error) {
      reply.code(500).send({ error: 'Error al crear el producto.' });
    }
  });

  // PUT /api/products/:id - Actualizar un producto
  fastify.put('/:id', async (request, reply) => {
    const errors = validateProduct(request.body);
    if (errors.length > 0) {
      return reply.code(400).send({ errors });
    }
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true } // Para devolver el documento actualizado
      );
      if (!updatedProduct) {
        return reply.code(404).send({ error: 'Producto no encontrado.' });
      }
      return reply.send(updatedProduct);
    } catch (error) {
      reply.code(500).send({ error: 'ID de producto inválido o error del servidor.' });
    }
  });

  // DELETE /api/products/:id - Eliminar un producto
  fastify.delete('/:id', async (request, reply) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(request.params.id);
      if (!deletedProduct) {
        return reply.code(404).send({ error: 'Producto no encontrado.' });
      }
      reply.code(204); // 204 No Content para eliminaciones exitosas
    } catch (error) {
      reply.code(500).send({ error: 'ID de producto inválido o error del servidor.' });
    }
  });
};

export default productRoutes;