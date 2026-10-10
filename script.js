
"use strict";

const WHATSAPP_NUMBER = "22398007149";
const PRICE = 4000;

const products = [
  {
    id: 1,
    name: "Maillot Club Vert",
    category: "club",
    categoryLabel: "CLUB",
    description: "Style classique pour les passionnés.",
    color: "#176344",
    bg: "#e6efe6",
    number: "10",
    badge: "POPULAIRE"
  },
  {
    id: 2,
    name: "Maillot Rouge",
    category: "club",
    categoryLabel: "CLUB",
    description: "Un look puissant sur le terrain.",
    color: "#b92736",
    bg: "#f5e7e6",
    number: "7",
    badge: "NOUVEAU"
  },
  {
    id: 3,
    name: "Maillot Bleu Nuit",
    category: "club",
    categoryLabel: "CLUB",
    description: "Un style sobre et élégant.",
    color: "#173764",
    bg: "#e6eaf2",
    number: "10",
    badge: ""
  },
  {
    id: 4,
    name: "Maillot des Aigles",
    category: "selection",
    categoryLabel: "SÉLECTION",
    description: "Affiche les couleurs du Mali.",
    color: "#147447",
    bg: "#e6eee2",
    number: "23",
    badge: "MALI"
  },
  {
    id: 5,
    name: "Maillot Jaune",
    category: "selection",
    categoryLabel: "SÉLECTION",
    description: "Un maillot qui se démarque.",
    color: "#d6a91d",
    bg: "#f5efd9",
    number: "9",
    badge: ""
  },
  {
    id: 6,
    name: "Maillot Rétro",
    category: "retro",
    categoryLabel: "RÉTRO",
    description: "Une inspiration vintage.",
    color: "#183e35",
    bg: "#e9e4d7",
    number: "8",
    badge: "CLASSIQUE"
  }
];

const cart = new Map();

let activeFilter = "all";
let searchTerm = "";
let sortMode = "default";

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const itemCounter = document.getElementById("item-counter");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const orderForm = document.getElementById("order-form");
const formMessage = document.getElementById("form-message");

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function renderProducts() {
  let filtered = products.filter(product => {
    const matchesFilter =
      activeFilter === "all" || product.category === activeFilter;

    const searchable =
      `${product.name} ${product.categoryLabel} ${product.description}`
        .toLocaleLowerCase("fr");

    return matchesFilter && searchable.includes(searchTerm);
  });

  if (sortMode === "name") {
    filtered = [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );
  }

  if (filtered.length === 0) {
    productGrid.innerHTML =
      '<div class="empty-results">Aucun maillot ne correspond à ta recherche.</div>';
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" style="--product-bg:${product.bg}">
        ${product.badge
          ? `<span class="product-badge">${product.badge}</span>`
          : ""}
        <div class="product-placeholder">
          <div class="mini-jersey"
               style="--shirt-color:${product.color};--shirt-collar:#c9ed78">
            <b>${product.number}</b>
          </div>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <div class="product-price">
            ${formatPrice(PRICE)}
            <small>Prix par maillot</small>
          </div>
          <button class="add-button"
                  type="button"
                  data-add="${product.id}"
                  aria-label="Ajouter ${product.name} au panier"
                  title="Ajouter au panier">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const current = cart.get(product.id);

  if (current) {
    current.quantity += 1;
  } else {
    cart.set(product.id, {
      product,
      quantity: 1
    });
  }

  renderCart();
  formMessage.textContent = `${product.name} ajouté au panier.`;
}

function changeQuantity(id, delta) {
  const item = cart.get(Number(id));
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.delete(Number(id));
  }

  renderCart();
}

function removeFromCart(id) {
  cart.delete(Number(id));
  renderCart();
}

function getCartQuantity() {
  let quantity = 0;

  for (const item of cart.values()) {
    quantity += item.quantity;
  }

  return quantity;
}

function getCartTotal() {
  return getCartQuantity() * PRICE;
}

function renderCart() {
  const quantity = getCartQuantity();
  const total = getCartTotal();

  cartCount.textContent = quantity;
  itemCounter.textContent =
    `${quantity} article${quantity > 1 ? "s" : ""}`;
  cartTotal.textContent = formatPrice(total);

  if (cart.size === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span class="empty-icon">🛍</span>
        <strong>Ton panier est vide</strong>
        <p>Choisis un maillot dans la boutique pour commencer.</p>
        <a href="#boutique" class="text-link">Voir les maillots ↗</a>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = [...cart.values()].map(item => `
    <div class="cart-line">
      <div class="cart-thumb"
           style="--product-bg:${item.product.bg};--shirt-color:${item.product.color}">
        ${item.product.number}
      </div>
      <div>
        <div class="cart-product-name">${item.product.name}</div>
        <div class="cart-product-price">${formatPrice(PRICE)} / unité</div>
        <div class="quantity-controls">
          <button type="button"
                  data-minus="${item.product.id}"
                  aria-label="Retirer une unité">−</button>
          <span>${item.quantity}</span>
          <button type="button"
                  data-plus="${item.product.id}"
                  aria-label="Ajouter une unité">+</button>
        </div>
      </div>
      <div class="cart-line-total">
        ${formatPrice(item.quantity * PRICE)}
        <button class="remove-item"
                type="button"
                data-remove="${item.product.id}">Supprimer</button>
      </div>
    </div>
  `).join("");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(plus.dataset.plus, 1);
  if (minus) changeQuantity(minus.dataset.minus, -1);
  if (remove) removeFromCart(remove.dataset.remove);
});

document.getElementById("filter-row").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });

  renderProducts();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLocaleLowerCase("fr");
  renderProducts();
});

sortSelect.addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

orderForm.addEventListener("submit", event => {
  event.preventDefault();
  formMessage.textContent = "";

  if (cart.size === 0) {
    formMessage.textContent =
      "Ajoute au moins un maillot au panier avant de commander.";
    document.getElementById("boutique").scrollIntoView({
      behavior: "smooth"
    });
    return;
  }

  if (!orderForm.reportValidity()) return;

  const formData = new FormData(orderForm);

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "");
  const size = String(formData.get("size") || "");
  const payment = String(formData.get("payment") || "");
  const note = String(formData.get("note") || "").trim();

  const lines = [...cart.values()].map(item =>
    `- ${item.product.name} | Quantité : ${item.quantity} | ` +
    `Sous-total : ${formatPrice(item.quantity * PRICE)}`
  );

  const message = [
    "⚽ *NOUVELLE COMMANDE — OUSBY-SHOP*",
    "",
    `👤 Nom : ${name}`,
    `📞 Téléphone : ${phone}`,
    `📍 Ville : ${city}`,
    `👕 Taille habituelle : ${size}`,
    "",
    "*MA COMMANDE :*",
    ...lines,
    "",
    `🛍 Quantité totale : ${getCartQuantity()} maillot(s)`,
    `💰 Total des articles : ${formatPrice(getCartTotal())}`,
    "",
    `💳 Paiement souhaité : ${payment}`,
    note ? `📝 Précisions : ${note}` : "",
    "",
    "Merci de confirmer la disponibilité, les frais et le délai de livraison avant paiement."
  ].filter(Boolean).join("\n");

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const popup = window.open(whatsappURL, "_blank");

  if (popup) {
    popup.opener = null;
    formMessage.textContent =
      "Ta commande est prête dans WhatsApp. Vérifie le message et envoie-le au vendeur.";
  } else {
    formMessage.textContent =
      "WhatsApp n'a pas pu s'ouvrir automatiquement. Autorise les fenêtres externes ou réessaie.";
    const link = document.createElement("a");
    link.href = whatsappURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "text-link";
    link.textContent = "Ouvrir WhatsApp pour envoyer la commande ↗";
    formMessage.appendChild(document.createElement("br"));
    formMessage.appendChild(link);
  }
});

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("current-year").textContent =
  new Date().getFullYear();

renderProducts();
renderCart();
