window.onload = () => {
    recuperaDatos()
}

//RECUPERAMOS DE FORMA ASINCRONA LOS DATOS DEL JSON
async function recuperaDatos() {
    let response = await fetch("./js/productos.json");
    let datos = await response.json();
    pintaMoviles(datos);
}

//FUNCIÓN QUE PINTA LOS PRODUCTOS
function pintaMoviles(datos) {
    let productos = document.querySelector(".productos");
    for (let movil of datos) {
        let divProducto = document.createElement("div");
        divProducto.classList = "producto";
        divProducto.id = movil.modelo.replace(/ /g, "_");
        divProducto.innerHTML += `
                <h2 class="marca">${movil.marca}</h2>
                <div class="imagen_producto">
                    <img src='./images/${movil.foto}'>
                    <div class="unidades_container">
                        <span>Unidades</span>
                        <span class="unidades_producto">${movil.unidades}</span>
                    </div>
                </div>
                <div class="texto">
                    <p class="modelo">${movil.modelo}</p>
                    <p class="descripcion">${movil.descripcion}</p>
                    <p class="precio">${movil.precio} <span class="moneda">${movil.moneda}</span></p>
                </div>
            `;


        if (movil.promociones > 0) {
            let img = document.createElement("img");
            img.classList = "oferta";
            img.src = "./images/oferta2.png";
            img.width = "100";
            divProducto.children[1].appendChild(img);
        }

        let boton = document.createElement("button");
        boton.classList.add("botoncarrito");
        boton.textContent = "Agregar al carrito";

        divProducto.addEventListener("click", agregacarrito);

        divProducto.appendChild(boton);
        productos.appendChild(divProducto);
    }
}

//DESPLEGAR CARRITO
document.querySelector("#carrito").addEventListener("click", () => {
    let carrito = document.querySelector(".divcarrito");
    if (carrito.children[1].children.length < 1) {
        return;
    } else {
        carrito.classList.toggle("mostrar")
    }
});


//          VARIABLES GLOBALES

let cuentaproductos = 0;
let mapCarrito = new Map();
let divCarrito = document.querySelector(".carrito_productos");



function agregacarrito(e) {

    if (e.target.tagName == "BUTTON") {

        let unidades = this.querySelector(".unidades_producto");

        if (unidades.textContent >= 1) {
            unidades.textContent = unidades.textContent - 1;
            let imgsrc = this.querySelector("img").getAttribute("src");
            let marcavar = this.querySelector(".marca").textContent;
            let modelovar = this.querySelector(".modelo").textContent;
            let precioS = this.querySelector(".precio").textContent.split(" ");
            let preciovar = parseInt(precioS[0]);
            cuentaproductos++;

            //GUARDAMOS INFORMACION DE PRODUCTOS DE UN CARRITO EN UN MAPA
            if (!mapCarrito.has(modelovar)) {
                mapCarrito.set(modelovar, {
                    marca : marcavar,
                    modelo: modelovar,
                    imagen: imgsrc,
                    precio: preciovar,
                    preciounidad: preciovar,
                    cantidad: 1
                });
            } else {
                let producto = mapCarrito.get(modelovar);
                producto.precio = preciovar * (producto.cantidad + 1);
                producto.cantidad++;
            }

            //SPAN PRODUCTOS DEL CARRITO
            
            document.querySelector(".contador_productos").innerHTML = `<span>${cuentaproductos}</span>`
          

            //FUNCION QUE PINTA PRODUCTOS EN EL CARRITO
            pintaCarrito(mapCarrito);

            //SI NO HAY MAS PRODUCTOS, FUNCION QUE PINTA CARTEL SOLD-OUT Y RESTA UNIDADES
        } 

        if(unidades.textContent == 0){
            unidades.textContent = 0;
            productoAgotado(this.querySelector(".imagen_producto"), this.querySelector(".botoncarrito"))
        }
         
        
    }

}



function pintaCarrito(mapCarrito) {
    divCarrito.innerHTML = "";

    for (let [modelo, producto] of mapCarrito) {
        let contenido = document.createElement("div");
        contenido.classList.add("contenido");
        contenido.setAttribute("data-modelo",modelo.replace(/\s+/g, '_')); 

        contenido.innerHTML = `
        <div class="carrito_imagen">
            <img src=${producto.imagen} width="200">
        </div>
        <div class="texto_carrito">
            <p>${modelo}</p>
            <p class="precio_sumamoviles">Precio: ${producto.precio}</p>
            <p>Unidad: ${producto.preciounidad}</p>

            <div class="carrito_unidades">
                <button class="menos">-</button>
                <span class="unidades_numero">${producto.cantidad}</span>
                <button class="mas">+</button>
            </div>
            
        </div>
       `
        divCarrito.appendChild(contenido);

        let carritoCantidades = contenido.querySelector(".carrito_unidades");
        carritoCantidades.addEventListener("click", (e) => {
            procesaUnidadesCarrito(e, modelo,contenido, mapCarrito);
        });
    }
}

function procesaUnidadesCarrito(e, modelo, contenido, mapCarrito) {

    let spanCarrito = document.querySelector("header .contador_productos span");
    let unidadesNumero = contenido.querySelector(".unidades_numero");
    let precioSumamoviles = contenido.querySelector(".precio_sumamoviles");

    let producto = mapCarrito.get(modelo);
    
    let carrito = document.querySelector(".divcarrito");


   let productoCarrito = document.querySelector(`[data-modelo="${producto.modelo.replace(/ /g, '_')}"]`);

    let divproducto = document.querySelector(`#${producto.modelo.replace(/ /g, '_')}`);
    
    const stock = divproducto.querySelector('.unidades_producto');

  

    if (e.target.classList == 'menos') {

        stock.innerHTML = parseInt(stock.textContent)+1; 
        producto.cantidad--;
        cuentaproductos--;
        spanCarrito.innerHTML = cuentaproductos;
        producto.precio = producto.precio - producto.preciounidad;
        unidadesNumero.innerHTML = producto.cantidad;
        productoCarrito.querySelector(".mas").disabled = false;

        if(producto.cantidad < 1){
            mapCarrito.delete(modelo);
            productoCarrito.remove();
        }

        if(mapCarrito.size == 0){
            spanCarrito.parentNode.innerHTML = "";
            carrito.classList.remove("mostrar");
        } 

        if(stock.innerHTML >= 1 && divproducto.querySelector("button").disabled == true){
            divproducto.querySelector('button').disabled = false;
            divproducto.querySelector(".imagen_agotado").remove();
        }
    }

  


    //MIRAR CONTADOR PARA QUE NO DEJE COMPRAR MAS MOVILES DE LOS QUE HAY EN STOCK
    if (e.target.classList == 'mas') {

        if(parseInt(stock.innerHTML) > 0){
            producto.precio = producto.precio + producto.preciounidad;
            stock.innerHTML = parseInt(stock.textContent)-1;
            producto.cantidad++;
            cuentaproductos++;
            spanCarrito.innerHTML = parseInt(spanCarrito.textContent)+1;
            unidadesNumero.innerHTML = producto.cantidad;

        }
 
       if(parseInt(stock.innerHTML) < 1){
            productoCarrito.querySelector(".mas").disabled = true;
            productoAgotado(divproducto.querySelector(".imagen_producto"),divproducto.querySelector(".botoncarrito")); 

        }
    }

    precioSumamoviles.innerHTML = `Precio: ${producto.precio}`;
}

function productoAgotado(imagen, boton) {
    let imagenagotado = document.createElement("img");
    imagenagotado.classList.add("imagen_agotado");
    imagenagotado.src = "./images/agotado.png";
    imagenagotado.width = "400";
    imagenagotado.style.position = "absolute";
    imagen.appendChild(imagenagotado);
    boton.disabled = true;
}






