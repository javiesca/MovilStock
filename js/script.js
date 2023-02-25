window.onload = () => {
    recuperaDatos()
}

//RECUPERAMOS DE FORMA ASINCRONA LOS DATOS DEL JSON
async function recuperaDatos() {
    let response = await fetch("/js/productos.json");
    let datos = await response.json();
    pintaMoviles(datos);
}

//FUNCIÓN QUE PINTA LOS PRODUCTOS
function pintaMoviles(datos) {
    let productos = document.querySelector(".productos");
    for (let movil of datos) {
        let divProducto = document.createElement("div");
        divProducto.classList = "producto";
        divProducto.innerHTML += `
                <h2 class="marca">${movil.marca}</h2>
                <div class="imagen_producto">
                    <img src='./images/${movil.foto}'>
                    <div class="unidades_container">
                        <span>Unidades</span>
                        <span class="unidades">${movil.unidades}</span>
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
            img.src = "/images/oferta2.png";
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

        let unidades = this.querySelector(".unidades");

        if (unidades.textContent > 0) {
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
            if (cuentaproductos > 0) {
                document.querySelector(".contador_productos").innerHTML = `<span>${cuentaproductos}</span>`
            }

            //FUNCION QUE PINTA PRODUCTOS EN EL CARRITO
            pintaCarrito(mapCarrito);

            //SI NO HAY MAS PRODUCTOS, FUNCION QUE PINTA CARTEL SOLD-OUT Y RESTA UNIDADES
        } else {
            productoAgotado(this.querySelector(".imagen_producto"), this.querySelector(".botoncarrito"))
        }
    }

}

function pintaCarrito(mapCarrito) {
    divCarrito.innerHTML = "";
    for (let [modelo, producto] of mapCarrito) {
        let contenido = document.createElement("div");
        contenido.classList.add("contenido");
        contenido.id = modelo.replace(/\s+/g, '_');

        contenido.innerHTML = `
        <div class="carrito_imagen">
            <img src=${producto.imagen} width="200">
        </div>
        <div class="texto_carrito">
            <p>${modelo}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Unidad: ${producto.preciounidad}</p>
            <p class="carrito_unidades"><span>-</span><span>${producto.cantidad}</span><span>+</span></p>
        </div>
       `
        divCarrito.appendChild(contenido);

        let carritoCantidades = contenido.querySelector(".carrito_unidades");
        carritoCantidades.addEventListener("click", (e) => {
            procesaUnidadesCarrito(e,modelo);
        });
    }
}




function productoAgotado(imagen, boton) {
    let imagenagotado = document.createElement("img");
    imagenagotado.src = "/images/agotado.png";
    imagenagotado.width = "400";
    imagenagotado.style.position = "absolute";
    imagen.appendChild(imagenagotado);
    boton.disabled = true;
}






