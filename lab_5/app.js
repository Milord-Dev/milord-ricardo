import Fastify from "fastify"

const fastify = Fastify({
    logger: true
})

// Funcion Fibonacci
function fibonacci(n){
    const result = [];
    for (let i = 0; i < n; i++){
        if (i === 0){
            result.push(0);
        }else if (i === 1){
            result.push(1);
        }else{
            resukt.push(result[i-1] + result[i-2]);
        }
    }
    return result;
}

// Endpoint
fastify.get("/fibonacci/:n",(request,reply) => {
    const n = parseInt(request.params.n);

    if(isNaN(n) || n < 1){
        return reply
        .status(400)
        .send({error: 'El parámetro n debe ser un número entero positivo mayor que 0.'})
    }
    const series = fibonacci(n);
    reply.send(series);
})