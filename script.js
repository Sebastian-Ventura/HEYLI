
// =====================================================
// HEYLI - CARNE DE GALLINA DE CORRAL
// JavaScript Vanilla
// Catálogo, carrito y pedidos por WhatsApp
// =====================================================


// =====================================================
// 1. CONFIGURACIÓN GENERAL
// =====================================================

const WHATSAPP_NUMBER = "51918874753";

const money = (value) => {
    return `S/ ${value.toFixed(2)}`;
};


// =====================================================
// 2. CATÁLOGO DE PRODUCTOS
// =====================================================

const products = [

    {
        id: "gallina-entera",

        name: "Gallina entera de corral",

        description:
            "Ideal para preparar caldos, sopas y recetas tradicionales.",

        price: 28.00,

        unit: "por unidad",

        image: "src/img/IMG2.webp",

        tag: "Favorito",

        art: "art-one"
    },

    {
        id: "pechuga",

        name: "Pechuga de gallina",

        description:
            "Una opción versátil para tus comidas de todos los días.",

        price: 24.00,

        unit: "por kilo",

        image: "src/img/IMG3.webp",

        tag: "Por kilo",

        art: "art-two"
    },

    {
        id: "menudencia",

        name: "Menudencia fresca",

        description:
            "Para complementar tus caldos y preparaciones caseras.",

        price: 10.00,

        unit: "por kilo",

        image: "src/img/IMG4.webp",

        tag: "Por kilo",

        art: "art-three"
    }

];


// =====================================================
// 3. ELEMENTOS HTML
// =====================================================

const productGrid = document.querySelector("#productGrid");

const cartItems = document.querySelector("#cartItems");

const cartCount = document.querySelector("#cartCount");

const navCartCount = document.querySelector("#navCartCount");

const summaryItems = document.querySelector("#summaryItems");

const cartSubtotal = document.querySelector("#cartSubtotal");

const orderForm = document.querySelector("#orderForm");

const formFeedback = document.querySelector("#formFeedback");


// =====================================================
// 4. VARIABLES DEL CARRITO
// =====================================================

// Guardamos los productos y sus cantidades.

const cart = new Map();


// =====================================================
// 5. MOSTRAR CATÁLOGO DE PRODUCTOS
// =====================================================

function renderProducts() {

    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `

        <article class="product-card">

            <div class="product-art ${product.art}">

                <span class="product-tag">
                    ${product.tag}
                </span>

                <img
                    class="product-photo"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">

                        ${money(product.price)}

                        <small>
                            ${product.unit}
                        </small>

                    </strong>

                    <button
                        class="add-button"
                        type="button"
                        data-add="${product.id}">

                        + Agregar

                    </button>

                </div>

            </div>

        </article>

    `).join("");

}


// =====================================================
// 6. AGREGAR PRODUCTOS AL CARRITO
// =====================================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const currentQuantity = cart.get(productId) || 0;

    cart.set(productId, currentQuantity + 1);

    renderCart();

}


// =====================================================
// 7. CAMBIAR CANTIDAD DE PRODUCTOS
// =====================================================

function changeQuantity(productId, change) {

    if (!cart.has(productId)) return;

    const currentQuantity = cart.get(productId);

    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {

        cart.delete(productId);

    } else {

        cart.set(productId, newQuantity);

    }

    renderCart();

}


// =====================================================
// 8. ELIMINAR PRODUCTOS
// =====================================================

function removeFromCart(productId) {

    cart.delete(productId);

    renderCart();

}


// =====================================================
// 9. CALCULAR CANTIDADES Y SUBTOTALES
// =====================================================

function getCartTotals() {

    let quantity = 0;

    let subtotal = 0;

    cart.forEach((qty, id) => {

        const product = products.find(
            item => item.id === id
        );

        if (!product) return;

        quantity += qty;

        subtotal += product.price * qty;

    });

    return {
        quantity,
        subtotal
    };

}


// =====================================================
// 10. ACTUALIZAR EL CARRITO EN PANTALLA
// =====================================================

function renderCart() {

    if (!cartItems) return;

    const {
        quantity,
        subtotal
    } = getCartTotals();


    // Actualizar contadores.

    if (cartCount) {
        cartCount.textContent = quantity;
    }

    if (navCartCount) {
        navCartCount.textContent = quantity;
    }

    if (summaryItems) {
        summaryItems.textContent = quantity;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = money(subtotal);
    }


    // Mostrar mensaje si el carrito está vacío.

    if (cart.size === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🧺</span>

                <strong>
                    Tu carrito está esperando.
                </strong>

                <p>
                    Agrega productos para comenzar tu pedido.
                </p>

                <a href="#productos" class="text-link">
                    Ver productos →
                </a>

            </div>

        `;

        return;

    }


    // Mostrar los productos seleccionados.

    cartItems.innerHTML = [...cart.entries()].map(
        ([id, qty]) => {

            const product = products.find(
                item => item.id === id
            );

            if (!product) return "";

            return `

                <article class="cart-item">

                    <div>

                        <h4>
                            ${product.name}
                        </h4>

                        <small>
                            ${money(product.price)}
                            · ${product.unit}
                        </small>

                    </div>


                    <div
                        class="quantity-control"
                        aria-label="Cantidad de ${product.name}">

                        <button
                            type="button"
                            data-change="-1"
                            data-id="${id}"
                            aria-label="Disminuir cantidad">

                            −

                        </button>

                        <strong>
                            ${qty}
                        </strong>

                        <button
                            type="button"
                            data-change="1"
                            data-id="${id}"
                            aria-label="Aumentar cantidad">

                            +

                        </button>

                    </div>


                    <div class="item-subtotal">

                        ${money(product.price * qty)}

                        <button
                            class="remove-item"
                            type="button"
                            data-remove="${id}">

                            Quitar

                        </button>

                    </div>

                </article>

            `;

        }

    ).join("");

}


// =====================================================
// 11. EVENTO PARA AGREGAR PRODUCTOS
// =====================================================

if (productGrid) {

    productGrid.addEventListener("click", event => {

        const button = event.target.closest("[data-add]");

        if (!button) return;

        const productId = button.dataset.add;

        addToCart(productId);


        // Mostrar confirmación visual.

        const originalText = button.textContent;

        button.textContent = "✓ Agregado";

        button.disabled = true;

        window.setTimeout(() => {

            button.textContent = originalText;

            button.disabled = false;

        }, 850);

    });

}


// =====================================================
// 12. EVENTOS DEL CARRITO
// =====================================================

if (cartItems) {

    cartItems.addEventListener("click", event => {

        const quantityButton =
            event.target.closest("[data-change]");

        const removeButton =
            event.target.closest("[data-remove]");


        // Aumentar o disminuir cantidades.

        if (quantityButton) {

            const productId = quantityButton.dataset.id;

            const change = Number(
                quantityButton.dataset.change
            );

            changeQuantity(productId, change);

        }


        // Eliminar productos.

        if (removeButton) {

            const productId = removeButton.dataset.remove;

            removeFromCart(productId);

        }

    });

}


// =====================================================
// 13. VALIDAR Y ENVIAR PEDIDO A WHATSAPP
// =====================================================

if (orderForm) {

    orderForm.addEventListener("submit", event => {

        event.preventDefault();


        // Verificar si existen productos.

        const {
            quantity,
            subtotal
        } = getCartTotals();


        if (quantity === 0) {

            formFeedback.textContent =
                "Tu carrito está vacío. Agrega productos antes de enviar tu pedido.";

            document.querySelector("#productos")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

            return;

        }


        // Obtener información del cliente.

        const formData = new FormData(orderForm);

        const name = String(
            formData.get("name") || ""
        ).trim();

        const phone = String(
            formData.get("phone") || ""
        ).trim();

        const address = String(
            formData.get("address") || ""
        ).trim();

        const message = String(
            formData.get("message") || ""
        ).trim();


        // Validar información obligatoria.

        if (!name || !phone || !address) {

            formFeedback.textContent =
                "Completa tu nombre, teléfono y dirección.";

            return;

        }


        // Construir detalle de productos.

        const orderLines = [...cart.entries()].map(
            ([id, qty]) => {

                const product = products.find(
                    item => item.id === id
                );

                return `• ${product.name}: ${qty} ${
                    qty === 1 ? "unidad" : "unidades"
                } — ${money(product.price * qty)}`;

            }
        );


        // Crear mensaje del pedido.

        const whatsappMessage = [

            "¡Hola, HEYLI! Quiero realizar el siguiente pedido:",

            "",

            ...orderLines,

            "",

            `Subtotal referencial: ${money(subtotal)}`,

            "(El peso y el importe final se confirmarán según disponibilidad.)",

            "",

            "DATOS DEL CLIENTE",

            `Nombre: ${name}`,

            `Teléfono: ${phone}`,

            `Dirección/zona: ${address}`,

            `Mensaje adicional: ${
                message || "Sin mensaje adicional"
            }`,

            "",

            "Quedo atento/a para confirmar disponibilidad y coordinar la entrega. ¡Gracias!"

        ].join("\n");


        // Codificar mensaje para WhatsApp.

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;


        // Abrir WhatsApp.

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );


        formFeedback.textContent =
            "Se preparó tu pedido en WhatsApp. Revisa el mensaje y presiona Enviar.";

    });

}


// =====================================================
// 14. MENÚ RESPONSIVO
// =====================================================

const menuToggle = document.querySelector("#menuToggle");

const navLinks = document.querySelector("#navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

    });


    // Cerrar el menú al seleccionar una sección.

    navLinks.addEventListener("click", event => {

        if (event.target.closest("a")) {

            navLinks.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menú"
            );

        }

    });

}


// =====================================================
// 15. ANIMACIONES AL DESPLAZARSE
// =====================================================

const revealElements = document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    // Compatibilidad con navegadores antiguos.

    revealElements.forEach(element => {

        element.classList.add("is-visible");

    });

}


// =====================================================
// 16. CONTROL DEL VIDEO
// =====================================================

const presentationVideo =
    document.querySelector(".video-card video");


if (presentationVideo) {

    presentationVideo.addEventListener(
        "loadeddata",
        () => {

            presentationVideo
                .closest(".video-card")
                ?.classList.add("has-video");

        }
    );

}


// =====================================================
// 17. INICIALIZAR LA PÁGINA
// =====================================================

renderProducts();

renderCart();


// =====================================================
// FIN DEL JAVASCRIPT DE HEYLI
// =====================================================
