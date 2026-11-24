/* 1. MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

// Close navigation when a link is clicked

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    });
});


/* 2. MENU CATEGORY FILTERING */

const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active state from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate selected filter
        button.classList.add("active");

        const selectedCategory = button.dataset.filter;

        menuCards.forEach(card => {

            const cardCategory = card.dataset.category;

            if (
                selectedCategory === "all" ||
                cardCategory === selectedCategory
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});


/* 3. SHOPPING CART / ORDER SYSTEM */

// Stores products added to the order

let cart = [];

// Get elements

const addButtons = document.querySelectorAll(".add-btn");
const cartCount = document.getElementById("cartCount");

const viewOrder = document.getElementById("viewOrder");
const orderModal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const clearOrder = document.getElementById("clearOrder");


// Format Kenyan currency

function formatCurrency(amount) {
    return "KSh " + amount.toLocaleString("en-KE");
}


// Update the cart counter

function updateCartCount() {

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
}


// Add a product to the order

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productName = button.dataset.name;
        const productPrice = Number(button.dataset.price);

        if (!productName || !Number.isFinite(productPrice) || productPrice <= 0) {
            return;
        }

        // Check if product already exists

        const existingProduct = cart.find(
            item => item.name === productName
        );

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });

        }

        updateCartCount();

        // Give visual feedback

        const originalText = button.textContent;

        button.textContent = "✓";
        button.style.background = "#A56B45";

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = "";
        }, 700);

    });

});


// Display the order summary

function renderOrder() {

    orderItems.innerHTML = "";

    if (cart.length === 0) {

        orderItems.innerHTML = `
            <p class="empty-order">
                Your order is empty. Add something delicious
                from our menu!
            </p>
        `;

    }

    let total = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const orderItem = document.createElement("div");

        orderItem.className = "order-item";

        const info = document.createElement("div");
        info.className = "order-item-info";

        const name = document.createElement("strong");
        name.textContent = item.name;

        const details = document.createElement("small");
        details.textContent =
            `${item.quantity} × ${formatCurrency(item.price)}`;

        info.append(name, details);

        const rightSide = document.createElement("div");

        const price = document.createElement("strong");
        price.textContent = formatCurrency(itemTotal);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
            cart.splice(index, 1);
            updateCartCount();
            renderOrder();
        });

        rightSide.append(price, removeButton);

        orderItem.append(info, rightSide);

        orderItems.appendChild(orderItem);

    });

    orderTotal.textContent = formatCurrency(total);

}


// Open order modal

function openOrderModal() {

    renderOrder();

    orderModal.classList.add("active");
    orderModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    closeModal.focus();

}


// Close order modal

function hideOrderModal() {

    orderModal.classList.remove("active");
    orderModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    viewOrder.focus();

}


viewOrder.addEventListener("click", openOrderModal);

closeModal.addEventListener("click", hideOrderModal);


// Close when clicking outside the modal

orderModal.addEventListener("click", event => {

    if (event.target === orderModal) {
        hideOrderModal();
    }

});


// Close using Escape key

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        orderModal.classList.contains("active")
    ) {
        hideOrderModal();
    }

});


// Clear all products from order

clearOrder.addEventListener("click", () => {

    cart = [];

    updateCartCount();
    renderOrder();

});


/* 4. CONTACT FORM VALIDATION */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Check required fields

    if (!name || !email || !message) {

        formMessage.textContent = "Please complete all fields.";
        formMessage.style.color = "#B65E4C";

        return;
    }

    // Basic email validation

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "#B65E4C";

        return;
    }

    // Frontend demonstration only

    formMessage.textContent =
        `Thank you, ${name}! Your message has been validated.`;

    formMessage.style.color = "#26382F";

    contactForm.reset();

});


/* 5. NEWSLETTER SUBSCRIPTION */

const newsletterForm = document.getElementById("newsletterForm");

const newsletterEmail = document.getElementById("newsletterEmail");

const newsletterMessage = document.getElementById("newsletterMessage");


newsletterForm.addEventListener("submit", event => {

    event.preventDefault();

    const email = newsletterEmail.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        newsletterMessage.textContent =
            "Please enter a valid email address.";

        newsletterMessage.style.color = "#B65E4C";

        return;
    }

    // Frontend demonstration only

    newsletterMessage.textContent =
        "Thank you for joining the Brew & Bean community!";

    newsletterMessage.style.color = "#26382F";

    newsletterForm.reset();

});


/* 6. DYNAMIC FOOTER YEAR */

const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();


/* 7. NAVIGATION SCROLL EFFECT */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 4px 20px rgba(38,56,47,0.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


/* 8. INITIALIZE WEBSITE */

updateCartCount();

console.log("Brew & Bean website loaded successfully!");
