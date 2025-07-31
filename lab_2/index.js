// variables de numeros
var num1 = 1;
var num2 = 5;

//varibles de suma,resta,multiplicacion,division
var result_suma = num1+num2;
var result_resta = num1-num2;
var result_multi = num1*num2;
var result_div = num1/num2;

//variables de cadena de texto
let saludo = "Hola"
let nombre = "Mundo"

//constantes
const PI = 3.1416;
const GRAVEDAD = "nueve punto ocho";
const PRESIDENTE_MULINO = {
    nombreCompleto: "José Raúl Mulino", 
    edad: 64,
    esPresidente: true, 
    detalles: {
        pais: "Panamá",
        profesion: "Abogado",
        fechaTomaPosesion: "1 de julio de 2024"
    } 
}

//code
function contarVocales(texto) {
    const vocales = "aeiouAEIOU";
    let contador = 0;
    for (let letra of texto) {
        if (vocales.includes(letra)){
        contador++;
    }
}
    return contador;
}

//impresion de varibles de numeros
console.log("La suma es: "+result_suma);
console.log("La resta es: "+result_resta);
console.log("La multiplicacion es: "+result_multi);
console.log("La division es: "+result_div);

//impresion de cadena de texto
console.log(saludo +""+ nombre);

//Imprimir constantes 
console.log(typeof PI);
console.log(typeof GRAVEDAD);

//imprimir objeto 
console.log("Edad:", PRESIDENTE_MULINO.edad);
console.log("Nombre completo:", PRESIDENTE_MULINO.nombreCompleto);
console.log("¿Es presidente?", PRESIDENTE_MULINO.esPresidente);
console.log("Detalles:", PRESIDENTE_MULINO.detalles);

//imprimir funcion
console.log(contarVocales("Ricardo Milord"))