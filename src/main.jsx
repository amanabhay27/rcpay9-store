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
  const slides = [
    "/hero-1.png",
    "/hero-2.png",
    "/hero-3.png",
    "/hero-4.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="sale-banner"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1536 / 235",
        height: "auto",
        minHeight: 0,
        maxHeight: "235px",
        overflow: "hidden",
        background: "#fff",
        padding: 0,
        margin: 0,
        lineHeight: 0,
      }}
    >
      <img
        src={slides[current]}
        alt="Flikart Mega Sale"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: "center",
          margin: 0,
          padding: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "10px",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show sale banner ${index + 1}`}
            onClick={() => setCurrent(index)}
            style={{
              width: index === current ? "20px" : "7px",
              height: "7px",
              padding: 0,
              border: "none",
              borderRadius: "20px",
              background:
                index === current ? "#ffffff" : "rgba(255,255,255,0.55)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, setSelectedProduct, setPage }) {
  const discount = Math.max(
    0,
    Math.round(((product.mrp - product.price) / product.mrp) * 100)
  );

  const ratings = 3200 + product.id * 827;

  function openProduct() {
    setSelectedProduct(product);
    setPage("product");
  }

  return (
    <article
      className="product-card"
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProduct();
        }
      }}
      style={{ cursor: "pointer" }}
    >
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
      </div>
    </article>
  );
}

function Home({ search, setPage, setSelectedProduct }) {
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
                setSelectedProduct={setSelectedProduct}
                setPage={setPage}
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

function Shop({ search, setSelectedProduct, setPage }) {
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
            setSelectedProduct={setSelectedProduct}
            setPage={setPage}
          />
        ))}
      </div>
    </main>
  );
}

function ProductDetails({
  product,
  setPage,
  addToCart,
  buyNow,
}) {
  if (!product) {
    return (
      <main className="page center-page">
        <div className="form-card">
          <h2>Product Not Found</h2>
          <p>Please select a product again.</p>
          <button
            className="full-action"
            onClick={() => setPage("home")}
          >
            GO TO SHOP
          </button>
        </div>
      </main>
    );
  }

  const discount = Math.max(
    0,
    Math.round(((product.mrp - product.price) / product.mrp) * 100)
  );

  const ratings = 3200 + product.id * 827;

  return (
    <main className="page">
      <style>{`
        .flikart-product-detail {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 10px;
          padding: 16px;
          box-sizing: border-box;
        }

        .flikart-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .flikart-detail-image {
          width: 100%;
          background: #f7f7f7;
          border-radius: 10px;
          overflow: hidden;
        }

        .flikart-detail-image img {
          width: 100%;
          max-height: 520px;
          object-fit: contain;
          display: block;
        }

        .flikart-detail-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 700px) {
          .flikart-product-detail {
            padding: 10px;
          }

          .flikart-detail-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .flikart-detail-image img {
            max-height: 430px;
          }

          .flikart-detail-buttons {
            position: sticky;
            bottom: 58px;
            background: #fff;
            padding: 8px 0;
            z-index: 5;
          }
        }
      `}</style>

      <div className="flikart-product-detail">
        <button
          type="button"
          onClick={() => setPage("home")}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            padding: "6px 0 14px",
          }}
        >
          ← Back to Shopping
        </button>

        <div className="flikart-detail-layout">
          <div className="flikart-detail-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div style={{ padding: "4px" }}>
            <div
              style={{
                display: "inline-block",
                background: "#2874f0",
                color: "#fff",
                borderRadius: "4px",
                padding: "5px 9px",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              {product.badge || "BEST DEAL"}
            </div>

            <h1
              style={{
                fontSize: "28px",
                lineHeight: 1.25,
                margin: "4px 0 12px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                margin: "0 0 14px",
                color: "#666",
                fontSize: "15px",
              }}
            >
              {product.short}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  background: "#0a8f3d",
                  color: "#fff",
                  borderRadius: "4px",
                  padding: "4px 7px",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                4.5 ★
              </span>
              <span style={{ color: "#666", fontSize: "14px" }}>
                {ratings} Ratings
              </span>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <span
                style={{
                  color: "#0a8f3d",
                  fontWeight: 800,
                  marginRight: "10px",
                }}
              >
                {discount}% Off
              </span>
              <del style={{ color: "#777" }}>
                ₹{product.mrp}.00
              </del>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <strong style={{ fontSize: "32px" }}>
                ₹{product.price}.00
              </strong>
              <span className="assured">✓ Assured</span>
            </div>

            <p
              style={{
                color: "#0a8f3d",
                fontWeight: 700,
                margin: "8px 0 18px",
              }}
            >
              Free Delivery in Two Days
            </p>

            <div
              style={{
                background: "#f5f7f9",
                borderRadius: "8px",
                padding: "14px",
                marginBottom: "16px",
              }}
            >
              <b>Payment & Delivery</b>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                Pay the advance amount by UPI. The remaining balance
                is collected by COD on delivery.
              </p>
            </div>

            <div className="flikart-detail-buttons">
              <button
                type="button"
                className="add-btn"
                onClick={() => {
                  addToCart(product);
                  setPage("cart");
                }}
              >
                ADD TO CART
              </button>

              <button
                type="button"
                className="buy-btn"
                onClick={() => buyNow(product)}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
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

    if (!first) {
      alert("Your cart is empty.");
      setPage("home");
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Order failed"
        );
      }

      const createdOrder = data.order || data;

      if (!createdOrder?.id) {
        throw new Error(
          "Order was created but Order ID was not received."
        );
      }

      setOrder({
        id: createdOrder.id,
        total,
        advance: first.advance,
        customer: form.name,
      });

      setPage("payment");
    } catch (err) {
      alert(
        err?.message ||
          "Unable to create order. Please try again."
      );
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
  const [paidClicked, setPaidClicked] = useState(false);

  useEffect(() => {
    if (!order?.id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/order-status?id=${encodeURIComponent(
            order.id
          )}`
        );

        const data = await response.json();

        if (
          data.payment_status === "Confirmed" ||
          data.order_status === "Confirmed" ||
          data.order_status === "Shipped" ||
          data.order_status === "Delivered"
        ) {
          setPage("track");
          clearInterval(interval);
        }
      } catch {}
    }, 4000);

    return () => clearInterval(interval);
  }, [order, setPage]);

  if (!order?.id) {
    return (
      <main className="page center-page">
        <div className="form-card">
          <h2>Payment Session Expired</h2>

          <p>
            Please place the order again.
          </p>

          <button
            className="full-action"
            onClick={() => setPage("home")}
          >
            GO TO SHOP
          </button>
        </div>
      </main>
    );
  }

  function markAsPaid() {
    setPaidClicked(true);

    alert(
      "Payment request received. Your order is pending until the payment is manually verified."
    );
  }

  return (
    <main className="page center-page">
      <div className="payment-card">
        <div className="payment-icon">📱</div>

        <h2>Pay Advance</h2>

        <p>
          Scan the QR code with PhonePe, Google Pay,
          Paytm or any UPI app.
        </p>

        <div className="payment-amount">
          ₹{Number(order.advance || 0).toFixed(0)}
        </div>

        <div className="qr-wrap">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
              `upi://pay?pa=${UPI_ID}&pn=${STORE_NAME}&am=${Number(order.advance || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Flikart Order ${order.id}`)}`
            )}`}
            alt={`Flikart UPI QR for ₹${Number(order.advance || 0).toFixed(0)}`}
            className="payment-qr"
          />
        </div>

        <div className="upi-box">
          <span>UPI ID</span>

          <strong>{UPI_ID}</strong>
        </div>

        <div className="payment-instructions">
          <b>How to pay</b>

          <ol>
            <li>
              Open any UPI app.
            </li>

            <li>
              Scan the QR code above.
            </li>

            <li>
              The amount ₹{Number(order.advance || 0).toFixed(0)} is already set in the QR.
            </li>

            <li>
              After successful payment, tap
              “I Have Paid”.
            </li>
          </ol>
        </div>

        <button
          className="pay-button"
          type="button"
          onClick={markAsPaid}
        >
          {paidClicked
            ? "PAYMENT SUBMITTED ✓"
            : "I HAVE PAID"}
        </button>

        <div className="pending-status">
          <span />

          {paidClicked
            ? "Payment submitted — waiting for verification..."
            : "Waiting for payment verification..."}
        </div>

        <small>
          Order ID: {order.id}
          <br />
          Do not close this page until your payment
          is complete.
        </small>
      </div>
    </main>
  );
}

function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  async function track(e) {
    e.preventDefault();

    if (!id.trim()) {
      alert("Please enter Order ID.");
      return;
    }

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
      alert(
        err?.message || "Unable to find order."
      );
    }
  }

  return (
    <main className="page center-page">
      <div className="form-card track-card">
        <h2>Track Your Order</h2>

        <p>
          Enter your Order ID below.
        </p>

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
          page === "home"
            ? "selected"
            : ""
        }
        onClick={() => setPage("home")}
      >
        <span>⌂</span>
        Home
      </button>

      <button
        className={
          page === "shop"
            ? "selected"
            : ""
        }
        onClick={() => setPage("shop")}
      >
        <span>▦</span>
        Categories
      </button>

      <button
        className={
          page === "track"
            ? "selected"
            : ""
        }
        onClick={() => setPage("track")}
      >
        <span>📦</span>
        Orders
      </button>

      <button
        className={
          page === "cart"
            ? "selected"
            : ""
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

  const [selectedProduct, setSelectedProduct] = useState(null);

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
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {page === "shop" && (
        <Shop
          search={search}
          setSelectedProduct={setSelectedProduct}
          setPage={setPage}
        />
      )}

      {page === "product" && (
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
        <Payment
          order={order}
          setPage={setPage}
        />
      )}

      {page === "track" && (
        <Track />
      )}

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
