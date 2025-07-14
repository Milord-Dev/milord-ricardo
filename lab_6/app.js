const fastify = require("fastify")({ logger: true });

// Base de dato
let productos = [
    { id: 1, nombre: "Soda", precio: 1, categoria: "Bebidas" },
    { id: 2, nombre: "Agua", precio: 1.5, categoria: "Bebidas" },
    { id: 3, nombre: "Galletas", precio: 1.25, categoria: "Snacks" },
];

let siguienteId = 4;

// Validación de productos
function validarProductos(datos) {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim() === "") {
        errores.push("El nombre es requerido");
    }

    if (!datos.precio || datos.precio < 1 || datos.precio > 1000) {
        errores.push("El precio debe estar entre 1 y 1000");
    }

    if (!datos.categoria || datos.categoria.trim() === "") {
        errores.push("La categoría es requerida");
    }

    return errores;
}

fastify.get("/", async (request, reply) => {
    return { mensaje: "Bienvenido a la API de productos de Casti" };
});

// GET Lista todos los productos
fastify.get("/productos", (request, reply) => {
    return reply.send(productos);
});

// GET Obtener un producto por ID
fastify.get("/productos/:id", (request, reply) => {
    const { id } = request.params;
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return reply.code(404).send({
            status: "error",
            error: "Producto no encontrado",
            id: parseInt(id),
        });
    }

    return reply.send(producto);
});

// POST Crear nuevo producto
fastify.post("/productos", (request, reply) => {
    const { id } = request.params;
    const datos = request.body;
    const errores = validarProductos(datos);

    if (errores.length > 0) {
        return reply.code(400).send({ status: "error", errores });
    }

    const nuevoProducto = {
        id: siguienteId++,
        nombre: datos.nombre.trim(),
        precio: Number(datos.precio),
        categoria: datos.categoria.trim(),
    };

    productos.push(nuevoProducto);

    return reply.code(201).send({
        status: "success",
        mensaje: "Producto creado exitosamente",
        producto: nuevoProducto,
    });
});

// PUT Actualizar un producto
fastify.put("/productos/:id", (request, reply) => {
    const { id } = request.params;
    const datos = request.body;

    const index = productos.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        return reply.code(404).send({
            status: "error",
            error: "Producto no encontrado",
        });
    }

    const errores = validarProductos(datos);
    if (errores.length > 0) {
        return reply.code(400).send({ status: "error", errores });
    }

    productos[index] = {
        id: parseInt(id),
        nombre: datos.nombre.trim(),
        precio: Number(datos.precio),
        categoria: datos.categoria.trim(),
    };

    return reply.code(200).send({
        status: "success",
        mensaje: "Producto actualizado exitosamente",
        producto: productos[index],
    });
});

// DELETE Eliminar un producto
fastify.delete("/productos/:id", (request, reply) => {
    const { id } = request.params;
    const index = productos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return reply.code(404).send({
            status: "error",
            error: "Producto no encontrado",
        });
    }

    const productoEliminado = productos.splice(index, 1)[0];

    return reply.send({
        status: "success",
        mensaje: "Producto eliminado exitosamente",
        producto: productoEliminado,
    });
});

// INICIAR SERVIDOR
const iniciarServidor = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("🚀 Servidor corriendo en http://localhost:3000");
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

iniciarServidor();