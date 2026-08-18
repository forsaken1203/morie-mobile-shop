/* =========================
   MORIÉ PRODUCT DATA
========================= */

const products = [
    {
        id: 1,
        name: "Sage Campus Shirt",
        category: "Tops",
        price: 59.90,
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85",
        description:
            "A relaxed unisex shirt with a clean Korean-inspired silhouette. Its lightweight fabric makes it comfortable for lectures, café visits and casual weekends."
    },
    {
        id: 2,
        name: "Cloud Knit Cardigan",
        category: "Outerwear",
        price: 89.90,
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=700&q=85",
        description:
            "A soft oversized cardigan designed for comfortable layering. The neutral colour and relaxed shape make it easy to match with everyday outfits."
    },
    {
        id: 3,
        name: "Everyday Wide Trousers",
        category: "Bottoms",
        price: 79.90,
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85",
        description:
            "Comfortable high-waisted trousers with a modern wide-leg fit. Designed to create a clean campus look while allowing easy movement throughout the day."
    },
    {
        id: 4,
        name: "Soft Layer T-Shirt",
        category: "Tops",
        price: 39.90,
        badge: "BASIC",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
        description:
            "A breathable everyday T-shirt with a soft touch and relaxed unisex fit. Wear it alone or use it as a simple base layer for Korean-inspired styling."
    },
    {
        id: 5,
        name: "Seoul Zip Jacket",
        category: "Outerwear",
        price: 109.90,
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85",
        description:
            "A lightweight street-style jacket with a practical zip design. It provides a fashionable outer layer for changing weather and air-conditioned classrooms."
    },
    {
        id: 6,
        name: "Pleated Campus Skirt",
        category: "Bottoms",
        price: 69.90,
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85",
        description:
            "A modern pleated skirt with a comfortable waistband and flowing shape. It creates a fresh Korean campus look for classes and casual occasions."
    },
    {
        id: 7,
        name: "Canvas Mini Tote",
        category: "Accessories",
        price: 35.90,
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
        description:
            "A practical canvas tote for carrying daily essentials. Its compact design includes enough space for a phone, wallet, notebook and other small items."
    },
    {
        id: 8,
        name: "Minimal Baseball Cap",
        category: "Accessories",
        price: 29.90,
        badge: "BASIC",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",
        description:
            "A clean and adjustable baseball cap that completes a relaxed campus outfit. The minimal design works well with both casual and sporty clothing."
    }
];

/* =========================
   APPLICATION STATE
========================= */

let cart = [];

try {
    const savedCart = localStorage.getItem("morieCart");
    cart = savedCart ? JSON.parse(savedCart) : [];
} catch (error) {
    cart = [];
}

let currentPage = "home";
let pageHistory = [];

let selectedProduct = products[0];
let selectedSize = "M";
let detailQuantity = 1;

let activeFilter = "All";
let promoApplied = false;
let toastTimer;

/* =========================
   PAGE ELEMENTS
========================= */

const pages = {
    home: document.getElementById("homePage"),
    shop: document.getElementById("shopPage"),
    detail: document.getElementById("detailPage"),
    cart: document.getElementById("cartPage"),
    checkout: document.getElementById("checkoutPage"),
    success: document.getElementById("successPage"),
    profile: document.getElementById("profilePage")
};

const backButton = document.getElementById("backButton");

const featuredProducts = document.getElementById("featuredProducts");
const allProducts = document.getElementById("allProducts");
const noResults = document.getElementById("noResults");
const productResultText = document.getElementById("productResultText");

const productSearch = document.getElementById("productSearch");
const sortProducts = document.getElementById("sortProducts");

const headerCartCount = document.getElementById("headerCartCount");
const bottomCartCount = document.getElementById("bottomCartCount");

const emptyCart = document.getElementById("emptyCart");
const filledCart = document.getElementById("filledCart");
const cartItems = document.getElementById("cartItems");
const cartSubtitle = document.getElementById("cartSubtitle");

const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryFee = document.getElementById("deliveryFee");
const discountRow = document.getElementById("discountRow");
const discountAmount = document.getElementById("discountAmount");
const cartTotal = document.getElementById("cartTotal");

const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutDelivery = document.getElementById("checkoutDelivery");
const checkoutTotal = document.getElementById("checkoutTotal");

const promoCode = document.getElementById("promoCode");
const promoMessage = document.getElementById("promoMessage");
const applyPromoButton = document.getElementById("applyPromoButton");

const checkoutForm = document.getElementById("checkoutForm");

const toast = document.getElementById("toast");

const sizeGuideModal = document.getElementById("sizeGuideModal");
const sizeGuideButton = document.getElementById("sizeGuideButton");
const closeSizeGuide = document.getElementById("closeSizeGuide");

/* =========================
   HELPER FUNCTIONS
========================= */

function formatPrice(price) {
    return `RM${price.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem("morieCart", JSON.stringify(cart));
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show-toast");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2200);
}

function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function calculateOrder() {
    const subtotal = cart.reduce((total, item) => {
        const product = products.find(
            productItem => productItem.id === item.productId
        );

        if (!product) {
            return total;
        }

        return total + product.price * item.quantity;
    }, 0);

    const delivery = subtotal === 0 || subtotal >= 100 ? 0 : 8;
    const discount = promoApplied ? subtotal * 0.10 : 0;
    const total = subtotal + delivery - discount;

    return {
        subtotal,
        delivery,
        discount,
        total
    };
}

/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageName, addToHistory = true) {
    if (!pages[pageName]) {
        return;
    }

    if (pageName === "checkout" && cart.length === 0) {
        showToast("Please add a product before checkout");
        pageName = "cart";
    }

    if (
        addToHistory &&
        currentPage !== pageName &&
        currentPage !== "success"
    ) {
        pageHistory.push(currentPage);
    }

    Object.values(pages).forEach(page => {
        page.classList.remove("active-page");
    });

    pages[pageName].classList.add("active-page");
    currentPage = pageName;

    updateNavigation(pageName);

    const showBackButton = ["detail", "checkout"].includes(pageName);
    backButton.classList.toggle("hidden", !showBackButton);

    if (pageName === "cart" || pageName === "checkout") {
        renderCart();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateNavigation(pageName) {
    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.remove("active-nav");

        if (button.dataset.page === pageName) {
            button.classList.add("active-nav");
        }
    });
}

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

backButton.addEventListener("click", () => {
    const previousPage = pageHistory.pop() || "home";
    showPage(previousPage, false);
});

/* =========================
   PRODUCT CARD CREATION
========================= */

function createProductCard(product) {
    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-badge">
                    ${product.badge}
                </span>

                <button
                    class="quick-add-button"
                    type="button"
                    data-quick-add="${product.id}"
                    aria-label="Quick add ${product.name}"
                >
                    +
                </button>
            </div>

            <p class="product-category">
                ${product.category}
            </p>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <p class="product-price">
                ${formatPrice(product.price)}
            </p>
        </article>
    `;
}

function renderFeaturedProducts() {
    const featured = products.slice(0, 4);

    featuredProducts.innerHTML = featured
        .map(createProductCard)
        .join("");
}

function getFilteredProducts() {
    const searchTerm = productSearch.value
        .trim()
        .toLowerCase();

    let filteredProducts = products.filter(product => {
        const matchesCategory =
            activeFilter === "All" ||
            product.category === activeFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    if (sortProducts.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortProducts.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
}

function renderAllProducts() {
    const filteredProducts = getFilteredProducts();

    allProducts.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");

    productResultText.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1 ? "product" : "products"
        }`;

    noResults.classList.toggle(
        "hidden",
        filteredProducts.length !== 0
    );
}

/* =========================
   PRODUCT CARD EVENTS
========================= */

function handleProductGridClick(event) {
    const quickAddButton = event.target.closest(
        "[data-quick-add]"
    );

    if (quickAddButton) {
        event.stopPropagation();

        const productId = Number(
            quickAddButton.dataset.quickAdd
        );

        addToCart(productId, "M", 1);
        return;
    }

    const productCard = event.target.closest(
        "[data-product-id]"
    );

    if (productCard) {
        const productId = Number(
            productCard.dataset.productId
        );

        openProductDetail(productId);
    }
}

featuredProducts.addEventListener(
    "click",
    handleProductGridClick
);

allProducts.addEventListener(
    "click",
    handleProductGridClick
);

/* =========================
   FILTER AND SEARCH
========================= */

document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        document.querySelectorAll(".filter-button").forEach(
            filterButton => {
                filterButton.classList.remove("active-filter");
            }
        );

        button.classList.add("active-filter");
        renderAllProducts();
    });
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.category;

        document.querySelectorAll(".filter-button").forEach(
            filterButton => {
                filterButton.classList.toggle(
                    "active-filter",
                    filterButton.dataset.filter === activeFilter
                );
            }
        );

        productSearch.value = "";
        renderAllProducts();
        showPage("shop");
    });
});

productSearch.addEventListener("input", renderAllProducts);
sortProducts.addEventListener("change", renderAllProducts);

/* =========================
   PRODUCT DETAIL
========================= */

function openProductDetail(productId) {
    const product = products.find(
        productItem => productItem.id === productId
    );

    if (!product) {
        return;
    }

    selectedProduct = product;
    selectedSize = "M";
    detailQuantity = 1;

    document.getElementById("detailImage").src =
        product.image;

    document.getElementById("detailImage").alt =
        product.name;

    document.getElementById("detailBadge").textContent =
        product.badge;

    document.getElementById("detailCategory").textContent =
        product.category.toUpperCase();

    document.getElementById("detailName").textContent =
        product.name;

    document.getElementById("detailPrice").textContent =
        formatPrice(product.price);

    document.getElementById("detailDescription").textContent =
        product.description;

    document.getElementById("detailQuantity").textContent =
        detailQuantity;

    document.querySelectorAll(".size-button").forEach(button => {
        button.classList.toggle(
            "selected-size",
            button.dataset.size === "M"
        );
    });

    showPage("detail");
}

document.getElementById("sizeOptions").addEventListener(
    "click",
    event => {
        const sizeButton = event.target.closest(".size-button");

        if (!sizeButton) {
            return;
        }

        selectedSize = sizeButton.dataset.size;

        document.querySelectorAll(".size-button").forEach(
            button => {
                button.classList.remove("selected-size");
            }
        );

        sizeButton.classList.add("selected-size");
    }
);

document.getElementById("decreaseQuantity").addEventListener(
    "click",
    () => {
        if (detailQuantity > 1) {
            detailQuantity -= 1;
            document.getElementById(
                "detailQuantity"
            ).textContent = detailQuantity;
        }
    }
);

document.getElementById("increaseQuantity").addEventListener(
    "click",
    () => {
        if (detailQuantity < 10) {
            detailQuantity += 1;
            document.getElementById(
                "detailQuantity"
            ).textContent = detailQuantity;
        }
    }
);

document.getElementById("addToCartButton").addEventListener(
    "click",
    () => {
        addToCart(
            selectedProduct.id,
            selectedSize,
            detailQuantity
        );
    }
);

/* =========================
   SHOPPING CART
========================= */

function addToCart(productId, size, quantity) {
    const existingItem = cart.find(item => {
        return (
            item.productId === productId &&
            item.size === size
        );
    });

    if (existingItem) {
        existingItem.quantity += quantity;

        if (existingItem.quantity > 10) {
            existingItem.quantity = 10;
        }
    } else {
        cart.push({
            productId,
            size,
            quantity
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
    showToast("Product added to your bag");
}

function updateCartCount() {
    const totalQuantity = getCartQuantity();

    headerCartCount.textContent = totalQuantity;
    bottomCartCount.textContent = totalQuantity;

    bottomCartCount.classList.toggle(
        "hidden",
        totalQuantity === 0
    );
}

function createCartItem(item) {
    const product = products.find(
        productItem => productItem.id === item.productId
    );

    if (!product) {
        return "";
    }

    return `
        <article class="cart-item">
            <img
                class="cart-item-image"
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">
                <h3>${product.name}</h3>

                <p class="cart-item-meta">
                    Size: ${item.size}
                </p>

                <p class="cart-item-price">
                    ${formatPrice(product.price)}
                </p>

                <div class="cart-actions">
                    <div class="small-quantity-control">
                        <button
                            type="button"
                            data-cart-action="decrease"
                            data-product-id="${product.id}"
                            data-size="${item.size}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-cart-action="increase"
                            data-product-id="${product.id}"
                            data-size="${item.size}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="remove-button"
                        type="button"
                        data-cart-action="remove"
                        data-product-id="${product.id}"
                        data-size="${item.size}"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderCart() {
    const hasItems = cart.length > 0;

    emptyCart.classList.toggle("hidden", hasItems);
    filledCart.classList.toggle("hidden", !hasItems);

    cartSubtitle.textContent = hasItems
        ? `${getCartQuantity()} ${
            getCartQuantity() === 1 ? "item" : "items"
        } ready for checkout.`
        : "Your bag is currently empty.";

    cartItems.innerHTML = cart
        .map(createCartItem)
        .join("");

    const order = calculateOrder();

    cartSubtotal.textContent = formatPrice(order.subtotal);

    deliveryFee.textContent =
        order.delivery === 0
            ? "FREE"
            : formatPrice(order.delivery);

    discountRow.classList.toggle(
        "hidden",
        !promoApplied
    );

    discountAmount.textContent =
        `−${formatPrice(order.discount)}`;

    cartTotal.textContent = formatPrice(order.total);

    checkoutSubtotal.textContent =
        formatPrice(order.subtotal);

    checkoutDelivery.textContent =
        order.delivery === 0
            ? "FREE"
            : formatPrice(order.delivery);

    checkoutTotal.textContent =
        formatPrice(order.total);

    updateCartCount();
}

cartItems.addEventListener("click", event => {
    const actionButton = event.target.closest(
        "[data-cart-action]"
    );

    if (!actionButton) {
        return;
    }

    const action = actionButton.dataset.cartAction;
    const productId = Number(
        actionButton.dataset.productId
    );
    const size = actionButton.dataset.size;

    const itemIndex = cart.findIndex(item => {
        return (
            item.productId === productId &&
            item.size === size
        );
    });

    if (itemIndex === -1) {
        return;
    }

    if (action === "increase") {
        if (cart[itemIndex].quantity < 10) {
            cart[itemIndex].quantity += 1;
        }
    }

    if (action === "decrease") {
        cart[itemIndex].quantity -= 1;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    if (action === "remove") {
        cart.splice(itemIndex, 1);
        showToast("Product removed from your bag");
    }

    if (cart.length === 0) {
        promoApplied = false;
        promoMessage.textContent = "";
    }

    saveCart();
    renderCart();
});

/* =========================
   PROMO CODE
========================= */

applyPromoButton.addEventListener("click", () => {
    const code = promoCode.value
        .trim()
        .toUpperCase();

    if (cart.length === 0) {
        promoMessage.textContent =
            "Add a product before applying a code.";

        promoMessage.style.color = "#b75555";
        return;
    }

    if (code === "STUDENT10") {
        promoApplied = true;

        promoMessage.textContent =
            "Student discount applied successfully!";

        promoMessage.style.color = "#47734b";

        renderCart();
        showToast("10% student discount applied");
    } else {
        promoApplied = false;

        promoMessage.textContent =
            "The promotional code is not valid.";

        promoMessage.style.color = "#b75555";

        renderCart();
    }
});

/* =========================
   CHECKOUT
========================= */

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your shopping bag is empty");
        showPage("cart");
        return;
    }

    const randomNumber = Math.floor(
        100000 + Math.random() * 900000
    );

    document.getElementById("orderNumber").textContent =
        `MR${randomNumber}`;

    cart = [];
    promoApplied = false;

    saveCart();
    renderCart();

    checkoutForm.reset();
    pageHistory = [];

    showPage("success", false);
    showToast("Your order has been placed");
});

/* =========================
   SIZE GUIDE MODAL
========================= */

sizeGuideButton.addEventListener("click", () => {
    sizeGuideModal.classList.remove("hidden");
});

closeSizeGuide.addEventListener("click", () => {
    sizeGuideModal.classList.add("hidden");
});

sizeGuideModal.addEventListener("click", event => {
    if (event.target === sizeGuideModal) {
        sizeGuideModal.classList.add("hidden");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        sizeGuideModal.classList.add("hidden");
    }
});

/* =========================
   INITIAL PAGE SETUP
========================= */

renderFeaturedProducts();
renderAllProducts();
renderCart();
updateCartCount();
showPage("home", false);