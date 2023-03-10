window.onload = () => {
    recuperaDatos()
}

//          VARIABLES GLOBALES
let cuentaproductos = 0;
let mapCarrito = new Map();
let divCarrito = document.querySelector(".carrito_productos");
let divFactura = document.createElement("div");
divFactura.classList.add("total_carrito_container");
let divTextoFactura = document.createElement("div");
divTextoFactura.classList.add("texto_factura_container");


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
                    <div class="precio_producto">
                        
                    </div>
                </div>
            `;

        let divprecio = divProducto.querySelector(".precio_producto");

        if (movil.promociones == 0) {
            let precioSin = document.createElement("p");
            precioSin.classList.add("precio_final");
            precioSin.innerHTML = `${movil.precio}€`;
            divprecio.appendChild(precioSin);
        }

        if (movil.promociones > 0) {
           pintaProductoPromocion(movil, divProducto, divprecio);
        }

       pintaBotonProducto(divProducto, productos);
    }
}

function pintaProductoPromocion(movil, divProducto, divprecio){

    let img = document.createElement("img");
    img.classList = "oferta";
    if(movil.promociones == 10) img.src = "./images/10pc.png";
    if(movil.promociones == 15) img.src = "./images/15pc.png";
    if (movil.promociones == 20) img.src = "./images/20pc.png";
    img.width = "100";
    divProducto.children[1].appendChild(img);

    let precioCon = document.createElement("p");
    precioCon.classList.add("precio_final");

    let precioSin = document.createElement("p");
    precioSin.classList.add("precio_sinoferta");
    precioSin.innerText = `${movil.precio}€`;

    divprecio.appendChild(precioSin);

    let precioOferta = parseInt(movil.precio) - parseFloat((movil.precio * 20) / 100)
    precioCon.innerHTML = `${precioOferta}€`;

    divprecio.appendChild(precioCon);
}

function pintaBotonProducto(divProducto, productos){
    let boton = document.createElement("button");
    boton.classList.add("botoncarrito");
    boton.textContent = "Agregar al carrito";
    divProducto.addEventListener("click", agregacarrito);
    divProducto.appendChild(boton);
    productos.appendChild(divProducto);
}



//DESPLEGAR CARRITO
document.querySelector("#carrito").addEventListener("click", () => {
    let carrito = document.querySelector(".divcarrito");
    carrito.children[1].children.length < 2 ? null : carrito.classList.toggle("mostrar");
});


//FUNCITON AGREGAR CARRITO
function agregacarrito(e) {
    if (e.target.tagName == "BUTTON") {
        let unidades = this.querySelector(".unidades_producto");
        if (unidades.textContent >= 1) {
            unidades.textContent = unidades.textContent - 1;
            let imgsrc = this.querySelector("img").getAttribute("src");
            let marcavar = this.querySelector(".marca").textContent;
            let modelovar = this.querySelector(".modelo").textContent;
            let precioS = this.querySelector(".precio_final").textContent.split(" ");
            let preciovar = parseInt(precioS[0]);
            cuentaproductos++;

            //GUARDAMOS INFORMACION DE PRODUCTOS DE UN CARRITO EN UN MAPA
            if (!mapCarrito.has(modelovar)) {
                mapCarrito.set(modelovar, {
                    marca: marcavar,
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

            //SPAN NUMERO PRODUCTOS DEL CARRITO
            document.querySelector(".contador_productos").innerHTML = `<span>${cuentaproductos}</span>`

           
        }

        if (unidades.textContent == 0) {
            unidades.textContent = 0;
            productoAgotado(this.querySelector(".imagen_producto"), this.querySelector(".botoncarrito"))
        }

    }
    
    //FUNCION QUE PINTA PRODUCTOS EN EL CARRITO
    pintaCarrito(mapCarrito);

}

//FUNCITON PINTA CARRITO
function pintaCarrito(mapCarrito) {
    divCarrito.innerHTML = "";

    for (let [modelo, producto] of mapCarrito) {
        let contenido = document.createElement("div");
        contenido.classList.add("contenido");
        contenido.setAttribute("data-modelo", modelo.replace(/\s+/g, '_'));

        contenido.innerHTML = `
        <div class="carrito_imagen">
            <img src=${producto.imagen} width="150">
        </div>
        <div class="texto_carrito">
            <p class="carrito_modelo">${modelo}</p>
            <p class="carrito_preciounidad">Unidad: ${producto.preciounidad}€</p>
            <div class="control_carrito_unidades">
                <div class="carrito_unidades">
                    <button class="menos">-</button>
                    <span class="unidades_numero">${producto.cantidad}</span>
                    <button class="mas">+</button>
                    
                </div>
                <i id="borra_producto_carrito" class="fa-solid fa-trash"></i>
            </div>
            <p class="carrito_preciosuma">Precio: ${producto.precio}€</p>
            
        </div>
       `
        divCarrito.appendChild(contenido);

        let carritoCantidades = contenido.querySelector(".control_carrito_unidades");
        carritoCantidades.addEventListener("click", (e) => {
            procesaUnidadesCarrito(e, modelo, contenido, mapCarrito);
        });
    }

    pintaFactura(mapCarrito);
}


//FUNCION PINTA TOTAL FACTURA CARRITO
function pintaFactura(mapCarrito) {
    divTextoFactura.innerHTML = "";

    let precio = 0;

    for (let moviles of mapCarrito.values()) {
        precio += parseFloat(moviles.precio)
    }

    let calculoIVA = parseFloat(precio * 0.21).toFixed(2);
    let calculoSinIVA = parseFloat(precio - calculoIVA).toFixed(2);

    let precioSinIva = document.createElement("span");
    precioSinIva.classList.add("span_siniva");
    precioSinIva.innerHTML = `
    Precio sin IVA: ${calculoSinIVA} €
    `;
    divTextoFactura.appendChild(precioSinIva);

    let IVA = document.createElement("span");
    IVA.classList.add("span_IVA");

    IVA.innerHTML = `
    IVA: ${calculoIVA} €
    `
    divTextoFactura.appendChild(IVA);

    let precioConIva = document.createElement("span");
    precioConIva.classList.add("span_coniva");
    precioConIva.innerHTML = `
    Precio Total: ${precio} €
    `

    precioConIva.style.fontWeight = "bolder";
    divTextoFactura.appendChild(precioConIva);
    divFactura.appendChild(divTextoFactura);
    divCarrito.appendChild(divFactura);
}


//FUNCTIN
function procesaUnidadesCarrito(e, modelo, contenido, mapCarrito) {

    let spanCarrito = document.querySelector("header .contador_productos span");
    let unidadesNumero = contenido.querySelector(".unidades_numero");
    let precioSumamoviles = contenido.querySelector(".carrito_preciosuma");
    let producto = mapCarrito.get(modelo);
    let carrito = document.querySelector(".divcarrito");

    let productoCarrito = document.querySelector(`[data-modelo="${producto.modelo.replace(/ /g, '_')}"]`);

    let divproducto = document.querySelector(`#${producto.modelo.replace(/ /g, '_')}`);
    const stock = divproducto.querySelector('.unidades_producto');

    //BOTON BORRAR
    if (e.target.tagName == "I") {
        stock.innerHTML = parseInt(stock.textContent) + parseInt(producto.cantidad);
        cuentaproductos = cuentaproductos - producto.cantidad;
        spanCarrito.innerHTML = cuentaproductos;
        spanCarrito.textContent == 0 ? spanCarrito.parentNode.innerHTML = "" : null;
        mapCarrito.delete(modelo);
        productoCarrito.remove();
        mapCarrito.size == 0 ? carrito.classList.remove("mostrar") : null;
    }

    //BOTON CANTIDAD MENOS
    if (e.target.classList == 'menos') {
        stock.innerHTML = parseInt(stock.textContent) + 1;
        producto.cantidad--;
        cuentaproductos--;
        spanCarrito.innerHTML = cuentaproductos;
        producto.precio = producto.precio - producto.preciounidad;
        unidadesNumero.innerHTML = producto.cantidad;
        productoCarrito.querySelector(".mas").disabled = false;

        if (producto.cantidad < 1) {
            mapCarrito.delete(modelo);
            productoCarrito.remove();
        }

        if (mapCarrito.size == 0) {
            spanCarrito.parentNode.innerHTML = "";
            carrito.classList.remove("mostrar");
        }

    }

    //BOTON CANTIDAD MAS
    if (e.target.classList == 'mas') {
        if (parseInt(stock.innerHTML) > 0) {
            producto.precio = producto.precio + producto.preciounidad;
            stock.innerHTML = parseInt(stock.textContent) - 1;
            producto.cantidad++;
            cuentaproductos++;
            spanCarrito.innerHTML = parseInt(spanCarrito.textContent) + 1;
            unidadesNumero.innerHTML = producto.cantidad;
        }

        if (parseInt(stock.innerHTML) < 1) {
            productoCarrito.querySelector(".mas").disabled = true;
            productoAgotado(divproducto.querySelector(".imagen_producto"), divproducto.querySelector(".botoncarrito"));
        }
    }

    //Si el producto está agotado, y damos al boton de "-" en el carrito, volvería a haber stock del producto, por lo que eliminarmos la imagen de producto agotado y volvemos a activar el boton de añadir al carrito.
    if (stock.innerHTML >= 1 && divproducto.querySelector("button").disabled == true) {
        divproducto.querySelector('button').disabled = false;
        divproducto.querySelector(".imagen_agotado").remove();
    }

    precioSumamoviles.innerHTML = `Precio: ${producto.precio}€`;
    
    pintaFactura(mapCarrito);
}

//CUANDO SE AGOTA UN PRODUCTO PINTA UNA IMAGEN ENCIMA INDICANDOLO
function productoAgotado(imagen, boton) {
    let imagenagotado = document.createElement("img");
    imagenagotado.classList.add("imagen_agotado");
    imagenagotado.src = "./images/agotado.png";
    imagenagotado.width = "400";
    imagenagotado.style.position = "absolute";
    imagen.appendChild(imagenagotado);
    boton.disabled = true;
}

//BOTON QUE LLAMA A LA FUNCION DE GENERAR HTML DE LA FACUTRA
document.querySelector(".carrito_pdf i").addEventListener("click", function () {
    generaPdf();
});

//FUNCION QUE GENERA LA FACTURA EN HTML. 
function generaPdf() {

    //Enviamos un objeto usuario con todos los datos.
    let usuario = {
        nombre:"Pedro Suarez López",
        direccion:"C/Progreso Nº5 4ºDcha",
        correo:"pedrosuarez@gmail.com",
        telefono:"655 323 232"
    }

    //Enviamos el Mapa con los productos del carrito y el usuario.
    localStorage.setItem("carrito", JSON.stringify(Array.from(mapCarrito.entries())));
    localStorage.setItem("usuario", JSON.stringify(usuario));

    //Abrimos una pagina nueva donde generamos la factura.
    window.open("factura.html");
}






