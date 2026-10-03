import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const UPI_ID = "bharatsingh6688@axl";
const STORE_NAME = "Flikart";

function SaleTimer() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 600 : s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sale-timer">
      <span>Live Sale:</span>{" "}
      <b>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </b>
    </div>
  );
}

function Header({ search, setSearch, setPage, cartCount }) {
  return (
    <>
      <header className="desktop-header">
        <button className="desktop-logo" onClick={() => setPage("home")}>
          <span className="logo-icon">F</span>
          Flikart
        </button>

        <div className="desktop-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Products"
          />
        </div>

        <button className="desktop-cart" onClick={() => setPage("cart")}>
          🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </header>

      <header className="mobile-header">
        <div className="mobile-top">
          <button className="mobile-logo" onClick={() => setPage("home")}>
            <span className="logo-icon">F</span>
            Flikart
          </button>

          <button className="mobile-cart" onClick={() => setPage("cart")}>
            🛒
            {cartCount > 0 && <i>{cartCount}</i>}
          </button>
        </div>

        <div className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Product"
          />
        </div>
      </header>
    </>
  );
}

function Categories({ setPage }) {
  const categories = [
    ["🛍️", "For You"],
    ["👕", "Fashion"],
    ["👞", "Footwear"],
    ["⌚", "Watches"],
    ["🎒", "Accessories"],
    ["💎", "Premium"],
  ];

  return (
    <div className="categories">
      {categories.map(([icon, name], index) => (
        <button
          key={name}
          className={`category ${index === 0 ? "active" : ""}`}
          onClick={() => setPage("shop")}
        >
          <span>{icon}</span>
          <b>{name}</b>
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, openProduct }) {
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <article className="product-card" onClick={() => openProduct(product)}>
      <div className="product-image-wrap">
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-short">{product.short}</p>

        <div className="discount-row">
          <span>{discount}% Off</span>
          <del>₹{product.mrp}</del>
        </div>

        <div className="price-row">
          <strong>₹{product.price}</strong>
          <span className="assured">✓ Assured</span>
        </div>

        <div className="rating-row">
          <span className="rating">4.5 ★</span>
          <span>{2500 + product.id * 713} Ratings</span>
        </div>

        <p className="delivery">Free Delivery</p>

        <div className="tap-hint">Tap to view product</div>
      </div>
    </article>
  );
}

function Home({ search, setPage, openProduct }) {
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      `${product.name} ${product.short}`.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <main>
      <Categories setPage={setPage} />

      <section className="sale-banner">
        <div className="banner-content">
          <small>FLIKART SPECIAL</small>
          <h1>MEGA FASHION SALE</h1>
          <p>Premium combos at special prices</p>
        </div>
      </section>

      <section className="live-sale">
        <SaleTimer />

        <div className="watching">
          <span></span>
          14,352 people watching
        </div>
      </section>

      <section className="products-area">
        <div className="section-heading">
          <div>
            <h2>Best Deals For You</h2>
            <p>Tap any product to view details</p>
          </div>

          <button onClick={() => setPage("shop")}>View All</button>
        </div>

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              openProduct={openProduct}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-box">
            <div>🔍</div>
            <h3>No product found</h3>
          </div>
        )}
      </section>
    </main>
  );
}

function Shop({ search, openProduct }) {
  const filtered = products.filter((product) =>
    `${product.name} ${product.short}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h2>All Products</h2>
          <p>Flikart premium collection</p>
        </div>

        <span>{filtered.length} items</span>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            openProduct={openProduct}
          />
        ))}
      </div>
    </main>
  );
}

function ProductDetails({ product, setPage, addToCart, buyNow }) {
  if (!product) return null;

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <main className="details-page">
      <button className="back-button" onClick={() => setPage("home")}>
        ← Back
      </button>

      <div className="details-card">
        <div className="details-image-box">
          {product.badge && (
            <span className="details-badge">{product.badge}</span>
          )}

          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <h1>{product.name}</h1>

          <p className="details-short">{product.short}</p>

          <div className="details-rating">
            <span>4.5 ★</span>
            <b>Trusted Product</b>
          </div>

          <div className="details-price">
            <strong>₹{product.price}</strong>
            <del>₹{product.mrp}</del>
            <em>{discount}% OFF</em>
          </div>

          <div className="offer-box">
            <b>Special Flikart Offer</b>
            <span>Limited-time deal on this product</span>
          </div>

          <div className="details-delivery">🚚 Free Delivery</div>

          <div className="payment-info">
            <b>Advance: ₹{product.advance}</b>
            <span>COD: ₹{product.cod}</span>
          </div>

          <div className="details-buttons">
            <button
              className="detail-cart"
              onClick={() => addToCart(product)}
            >
              ADD TO CART
            </button>

            <button
              className="detail-buy"
              onClick={() => buyNow(product)}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Cart({ cart, setPage, updateQty, removeItem }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main className="page cart-page">
      <h2>My Cart</h2>

      {!cart.length ? (
        <div className="empty-box">
          <div>🛒</div>
          <h3>Your cart is empty</h3>

          <button onClick={() => setPage("home")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.short}</p>
                  <strong>₹{item.price}</strong>

                  <div className="quantity">
                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Total Amount</span>
            <strong>₹{total}</strong>
          </div>

          <button className="full-action" onClick={() => setPage("checkout")}>
            PLACE ORDER
          </button>
        </>
      )}
    </main>
  );
}

function Checkout({ cart, setPage, setOrder }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const first = cart[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.pincode}`,
          product_name: first.name,
          quantity: cart.reduce((sum, item) => sum + item.qty, 0),
          total_amount: total,
          advance_amount: first.advance,
          cod_amount: first.cod,
          payment_method: "UPI",
          payment_status: "Pending",
          order_status: "Pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order failed");
      }

      setOrder({
        id: data.id,
        total,
        advance: first.advance,
        customer: form.name,
      });

      setPage("payment");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page checkout-page">
      <div className="form-card">
        <h2>Delivery Details</h2>

        <form onSubmit={submit}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Mobile Number"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            placeholder="Pincode"
            inputMode="numeric"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button className="full-action" disabled={loading}>
            {loading ? "PROCESSING..." : "CONTINUE TO PAYMENT"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Payment({ order, setPage }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!order?.id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/order-status?id=${order.id}`);
        const data = await response.json();

        if (
          data.payment_status === "Confirmed" ||
          data.order_status === "Confirmed"
        ) {
          setConfirmed(true);
          clearInterval(interval);
        }
      } catch {}
    }, 4000);

    return () => clearInterval(interval);
  }, [order]);

  if (confirmed) {
    return (
      <main className="page center-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Your payment has been verified.</p>
          <small>Order ID: {order.id}</small>

          <button className="full-action" onClick={() => setPage("track")}>
            TRACK ORDER
          </button>
        </div>
      </main>
    );
  }

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(STORE_NAME)}` +
    `&am=${encodeURIComponent(order.advance)}` +
    `&cu=INR`;

  return (
    <main className="page center-page">
      <div className="payment-card">
        <div className="payment-icon">💳</div>

        <h2>Complete Payment</h2>
        <p>Pay the advance amount to confirm your order.</p>

        <div className="payment-amount">₹{order.advance}</div>

        <div className="upi-box">
          <span>UPI ID</span>
          <strong>{UPI_ID}</strong>
        </div>

        <a className="pay-button" href={upiLink}>
          PAY ₹{order.advance} USING UPI
        </a>

        <div className="pending-status">
          <span></span>
          Waiting for payment verification...
        </div>
      </div>
    </main>
  );
}

function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);

  async function track(event) {
    event.preventDefault();

    if (!id.trim()) return;

    try {
      const response = await fetch(
        `/api/order-status?id=${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="page center-page">
      <div className="form-card track-card">
        <h2>Track Your Order</h2>
        <p>Enter your Order ID below.</p>

        <form onSubmit={track}>
          <input
            placeholder="Order ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <button className="full-action">TRACK ORDER</button>
        </form>

        {order && (
          <div className="track-result">
            <p>
              <b>Order ID:</b> {order.id}
            </p>
            <p>
              <b>Payment:</b> {order.payment_status}
            </p>
            <p>
              <b>Order:</b> {order.order_status}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Flikart</h3>
        <p>Premium fashion deals at special prices.</p>
      </div>

      <div>
        <b>Customer Support</b>
        <span>Track Order</span>
        <span>Payment Help</span>
        <span>Contact Us</span>
      </div>

      <div>
        <b>Shopping</b>
        <span>Fashion</span>
        <span>Accessories</span>
        <span>Best Deals</span>
      </div>
    </footer>
  );
}

function BottomNav({ page, setPage, cartCount }) {
  return (
    <nav className="bottom-nav">
      <button
        className={page === "home" ? "selected" : ""}
        onClick={() => setPage("home")}
      >
        <span>⌂</span>
        Home
      </button>

      <button
        className={page === "shop" ? "selected" : ""}
        onClick={() => setPage("shop")}
      >
        <span>▦</span>
        Shop
      </button>

      <button
        className={page === "track" ? "selected" : ""}
        onClick={() => setPage("track")}
      >
        <span>📦</span>
        Orders
      </button>

      <button
        className={page === "cart" ? "selected" : ""}
        onClick={() => setPage("cart")}
      >
        <span className="cart-icon">
          🛒
          {cartCount > 0 && <i>{cartCount}</i>}
        </span>
        Cart
      </button>
    </nav>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function openProduct(product) {
    setSelectedProduct(product);
    setPage("details");
    window.scrollTo(0, 0);
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });

    alert("Product added to cart.");
  }

  function buyNow(product) {
    setCart([{ ...product, qty: 1 }]);
    setPage("checkout");
    window.scrollTo(0, 0);
  }

  function updateQty(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="app">
      <Header
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        cartCount={cartCount}
      />

      {page === "home" && (
        <Home
          search={search}
          setPage={setPage}
          openProduct={openProduct}
        />
      )}

      {page === "shop" && (
        <Shop search={search} openProduct={openProduct} />
      )}

      {page === "details" && (
        <ProductDetails
          product={selectedProduct}
          setPage={setPage}
          addToCart={addToCart}
          buyNow={buyNow}
        />
      )}

      {page === "cart" && (
        <Cart
          cart={cart}
          setPage={setPage}
          updateQty={updateQty}
          removeItem={removeItem}
        />
      )}

      {page === "checkout" && (
        <Checkout
          cart={cart}
          setPage={setPage}
          setOrder={setOrder}
        />
      )}

      {page === "payment" && (
        <Payment order={order} setPage={setPage} />
      )}

      {page === "track" && <Track />}

      <Footer />

      <BottomNav
        page={page}
        setPage={setPage}
        cartCount={cartCount}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
