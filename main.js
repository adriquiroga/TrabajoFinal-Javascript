
const contenedorProd = document.getElementById("contenedorProduct");
const vercarrito = document.getElementById("vercarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const modalContainer = document.getElementById("modalContainer");

swalShown = false;
document.addEventListener('DOMContentLoaded', function() {
  if (!swalShown) {
    Swal.fire({
      title: '<span class="tit-bienvenida">Te damos la bienvenida a nuestro sitio de cosmética natural</span>',
      imageWidth: 150, 
      imageHeight: 150,
      confirmButtonText: 'Aceptar'
    }); 
    swalShown = true;
  }
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];  
const getProducts = async () => {
  try {
    const response = await fetch("productos.json");    
    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }     
    const productos = await response.json();   
    productos.forEach((producto) => {     
      let contenedor = document.createElement("div");
      contenedor.className = "card contenedorProd";      
      contenedor.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h2 class = "nombre-prod">${producto.nombre}</h2>    
        <p class="precio">$${producto.precio}</p>
      `;      
      let agregarCarrito = document.createElement("button");
      agregarCarrito.innerText = "Agregar al carrito";
      agregarCarrito.className = "boton";      
      contenedor.append(agregarCarrito);      
      contenedorProd.append(contenedor);
      agregarCarrito.addEventListener("click", () => {
        const repeat = carrito.some((repeatProduct) => repeatProduct.id === producto.id);
        if (repeat) {
          carrito = carrito.map((prod) => {
            if (prod.id === producto.id) {
              prod.cantidad++;
            }
            return prod;
          });
        } else {
          carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.img,
            cantidad: producto.cantidad,
          });
        }        
        carritoContador();
        localSave();
        Toastify({
          text: "Producto agregado",
          duration: 1000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          gravity: "top",
          position: "right", 
          stopOnFocus: true, 
          offset: {
              x: "1.5rem", 
              y: "1.5rem", 
            },
          className: "toasti1",
          onClick: function(){} 
      }).showToast();
      });
    });
  } catch (error) {
    console.error(error.message);
  }
};
getProducts();

function localSave() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
JSON.parse(localStorage.getItem("carrito"));

const pintarCarrito = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "block"; 
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h1 class="modal-header">Carrito</h1>
  `;
  modalContainer.append(modalHeader);

  const vaciarCarrito = document.createElement("button");
  vaciarCarrito.innerText = "Vaciar carrito";
  vaciarCarrito.className = "vaciar-carrito";
  vaciarCarrito.addEventListener("click", () => {
    carrito.length = 0; 
    carritoContador();
    pintarCarrito(); 
    localSave();
  });
  modalContainer.append(vaciarCarrito);

  const modalButton = document.createElement("h6");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";  
  modalButton.addEventListener("click", () =>{
      modalContainer.style.display = "none";
  });
  modalHeader.append(modalButton);  
  carrito.forEach((producto) => {
      let carritoContent = document.createElement("div");
      carritoContent.className = "modal-content";
      carritoContent.innerHTML = `      
        <span class="delete-product"> ✕ </span>   
        <img class = "img-carrito" src="${producto.img}">      
        <p class = "nombre-prod2">${producto.nombre}</p>    
        <p class="precio">$${producto.precio}</p>        
        <p class = "cant-prod ">Cantidad: ${producto.cantidad}</p>
        <span class="restar">  -  </span>
        <span class="sumar">   +   </span>
        <p class = "total">Total: $${producto.cantidad * producto.precio}</p>            
      `;
      modalContainer.append(carritoContent);
     
      let restar = carritoContent.querySelector(".restar");
      restar.addEventListener("click", () => {
          if(producto.cantidad !== 1) {
             producto.cantidad--;
          }
          carritoContador();
          pintarCarrito();
          localSave();
      });

      let sumar = carritoContent.querySelector(".sumar");
      sumar.addEventListener("click", () => {
          producto.cantidad++;
          carritoContador();
          pintarCarrito();
          localSave();
      });
      
      let eliminar = carritoContent.querySelector(".delete-product");
      eliminar.addEventListener("click", () => {
          eliminarProducto(producto.id);
          Toastify({
              text: "Producto eliminado",
              duration: 1000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              gravity: "top",
              position: "right", 
              stopOnFocus: true, 
              offset: {
                  x: "1.5rem", 
                  y: "1.5rem", 
                },
              className: "toasti2",
              onClick: function(){} 
          }).showToast();
      });
  });  
  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);                               
  const totalPrecio = document.createElement("div");
  totalPrecio.className = "total-content";
  totalPrecio.innerHTML = `Total a pagar: $${total}`;
  modalContainer.append(totalPrecio);
  
  const finalizarCompra = document.createElement("button");
  finalizarCompra.innerText = "Finalizar compra";
  finalizarCompra.className = "finalizar-compra";
  modalContainer.append(finalizarCompra);

  finalizarCompra.addEventListener("click", () => {
    if (total > 0) {
        abrirFormularioCompra(); 
    } else {
      
    }
});
};
vercarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
  const foundId = carrito.find ((elemento) => elemento.id === id);
  carrito = carrito.filter((carritoId) => {
      return carritoId !== foundId;
  });
  carritoContador();
  localSave();
  pintarCarrito();
};

const carritoContador = () => {
  const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  
  localStorage.setItem("carritoLength", JSON.stringify(totalProductos));
 
  cantidadCarrito.innerText = totalProductos;
};
carritoContador();


const abrirFormularioCompra = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "block";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class="modal-header">Ingresa tus datos</h1>
    `;
  modalContainer.append(modalHeader);

  const modalButton = document.createElement("h6");
  modalButton.innerText = "X";
  modalButton.className = "modal-header-button";
  modalButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
  modalHeader.append(modalButton);
 
const formulario = document.createElement("form");
formulario.className = "formulario-compra";
formulario.innerHTML = `
    <div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" value="Adriana" required>
    </div>
    <div>
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" name="direccion" value="Caseros 2550" required>
    </div>
    <div>
        <label for="codigop">Código postal:</label> 
        <input type="text" id="codigop" name="codigop" value="5000" required>
    </div>
    <div>
        <label for="tarjeta">Número de tarjeta débito/crédito:</label>
        <input type="number" id="tarjeta" name="tarjeta" value="458965112245" required>
    </div>
    <div>
        <label for="nombretarjeta">Nombre y Apellido del titular:</label> 
        <input type="text" id="nombretarjeta" name="nombretarjeta" value="Adriana Garcia" required>
    </div>    
    <div>
        <label for="codigo">Código de seguridad:</label>
        <input type="number" id="codigo" name="codigo" value="111" required>
    </div>    
    <button type="submit" class="finalizar-compra">Confirmar Compra</button>
`;
modalContainer.append(formulario);

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;

  carrito.length = 0;
  carritoContador();
  localSave();

  modalContainer.innerHTML = `
        <h6>Listo, ${nombre}!</h6>
        <p>Su pedido será enviado a la dirección: ${direccion} a la brevedad. ¡Muchas gracias!</p>
        <button class="finalizar-compra">Cerrar</button>
      `;

  const cerrarModalBtn = document.querySelector(".finalizar-compra");
  cerrarModalBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });  
}) 
};





















