// app.js
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

// Simulación de una base de datos en memoria
let products = [
  { id: 1, name: 'Laptop Gamer', price: 1200, description: 'Potente laptop para juegos.' },
  { id: 2, name: 'Teclado Mecánico', price: 80, description: 'Teclado retroiluminado con switches azules.' },
  { id: 3, name: 'Mouse Inalámbrico', price: 30, description: 'Mouse ergonómico y de alta precisión.' },
  { id: 4, name: 'Monitor Curvo 27"', price: 300, description: 'Monitor con alta tasa de refresco para una experiencia inmersiva.' }
];

let nextProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (request.method === 'OPTIONS') {
    reply.send();
  } else {
    done();
  }
});

// Rutas de la API

// GET /products - Obtener todos los productos
fastify.get('/products', async (request, reply) => {
  return products;
});

// GET /products/:id - Obtener un producto por ID
fastify.get('/products/:id', async (request, reply) => {
  const { id } = request.params;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) {
    reply.code(404).send({ message: 'Producto no encontrado' });
  }
  return product;
});

// POST /products - Crear un nuevo producto
fastify.post('/products', async (request, reply) => {
  const { name, price, description } = request.body;
  if (!name || !price || !description) {
    reply.code(400).send({ message: 'Faltan campos obligatorios: name, price, description' });
  }
  const newProduct = { id: nextProductId++, name, price, description };
  products.push(newProduct);
  reply.code(201).send(newProduct);
});

// PUT /products/:id - Actualizar un producto existente
fastify.put('/products/:id', async (request, reply) => {
  const { id } = request.params;
  const { name, price, description } = request.body;
  const productIndex = products.findIndex(p => p.id === parseInt(id));

  if (productIndex === -1) {
    reply.code(404).send({ message: 'Producto no encontrado' });
  }

  if (!name || !price || !description) {
    reply.code(400).send({ message: 'Faltan campos obligatorios: name, price, description' });
  }

  products[productIndex] = { ...products[productIndex], name, price, description };
  return products[productIndex];
});

// DELETE /products/:id - Eliminar un producto
fastify.delete('/products/:id', async (request, reply) => {
  const { id } = request.params;
  const initialLength = products.length;
  products = products.filter(p => p.id !== parseInt(id));

  if (products.length === initialLength) {
    reply.code(404).send({ message: 'Producto no encontrado' });
  }
  reply.code(204).send(); 
});

// Iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Servidor Fastify corriendo en http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();