// server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';

const fastify = Fastify({ logger: true });

// Conecta a la base de datos
connectDB();

// Registra los plugins y rutas
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.register(productRoutes, { prefix: '/api/products' });

fastify.get('/', async (request, reply) => {
  return { message: "¡Hola bienvenido a la tiendita de Casti! Usa /api/products para interactuar." };
});

const startServer = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Servidor escuchando en ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();