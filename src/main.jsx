import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const UPI_ID = "bharatsingh6688@axl";
const STORE_NAME = "Flipkart";

function OfferTimer() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 600 : s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  return (
    <div className="offer-timer">
      <span>⚡ Limited Time Offer</span>
      <strong>{min}:{sec}</strong>
    </div>
  );
}

function Header({ cartCount, setPage, search, setSearch }) {
  return (
    <>
      <header className="fk-header">
        <div className="fk-header-inner">

          <button className="fk-logo" onClick={() => setPage("home")}>
            <span>Flipkart</span>
            <small>Explore Plus ✨</small>
          </button>

          <div className="fk-search">
            <span>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products, brands and more"
            />
          </div>

          <button className="login-btn" onClick={() => setPage("home")}>
            Login
          </button>

          <button className="header-link" onClick={() => setPage("track")}>
            Track Order
          </button>

          <button className="cart-btn" onClick={() => setPage("cart")}>
            🛒 Cart
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
      </header>

      <div className="category-bar">
        <div onClick={() => setPage("shop")}>🛍️ Fashion</div>
        <div onClick={() => setPage("shop")}>👕 Men</div>
        <div onClick={() => setPage("shop")}>⌚ Watches</div>
        <div onClick={() => setPage("shop")}>🕶️ Accessories</div>
        <div onClick={() => setPage("shop")}>👟 Shoes</div>
        <div onClick={() => setPage("shop")}>🔥 Top Deals</div>
      </div>
    </>
  );
}

function Hero({ setPage }) {
  return (
    <section className="fk-hero">
      <div className="hero-content">
        <div>
          <span className="hero-small">BIG SAVINGS DAYS</span>
          <h1>MEGA SALE</h1>
          <h2>Fashion Deals Starting ₹499</h2>
          <p>Premium fashion & accessories at special prices.</p>

          <button onClick={() => setPage("shop")}>
            Shop Now →
          </button>
        </div>

        <img src="/hero.png" alt="Fashion Sale" />
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart, buyNow }) {
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <div className="fk-product-card">

      <div className="product-badge">
        {product.badge}
      </div>

      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-short">
          {product.short}
        </p>

        <div className="rating">
          <span>4.2 ★</span>
          <small> 1,248 Ratings</small>
        </div>

        <div className="price-row">
          <strong>₹{product.price}</strong>
          <del>₹{product.mrp}</del>
          <em>{discount}% off</em>
        </div>

        <p className="delivery">
          🚚 Free Delivery
        </p>

        <div className="product-actions">
          <button
            className="add-cart"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>

          <button
            className="buy-now"
            onClick={() => buyNow(product)}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

function Home({ products, addToCart, buyNow, setPage, search }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return products;

    return products.filter((p) =>
      `${p.name} ${p.short}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <main>

      <Hero setPage={setPage} />

      <div className="offer-strip">
        <div>
          <strong>🔥 MEGA SALE</strong>
          <span>Limited-Time Fashion Offers</span>
        </div>
        <OfferTimer />
      </div>

      <section className="deal-section">

        <div className="section-heading">
          <div>
            <h2>Deals of the Day</h2>
            <p>Grab the best fashion deals before they end</p>
          </div>

          <button onClick={() => setPage("shop")}>
            VIEW ALL
          </button>
        </div>

        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              buyNow={buyNow}
            />
          ))}
        </div>

      </section>

      <section className="benefits">
        <div>
          <span>🚚</span>
          <strong>Fast Delivery</strong>
          <small>Get your order quickly</small>
        </div>

        <div>
          <span>💳</span>
          <strong>Secure Payment</strong>
          <small>Safe & simple checkout</small>
        </div>

        <div>
          <span>💰</span>
          <strong>Best Prices</strong>
          <small>Special sale prices</small>
        </div>

        <div>
          <span>🔒</span>
          <strong>Secure Shopping</strong>
          <small>Your details stay protected</small>
        </div>
      </section>

    </main>
  );
}

function Shop({ products, addToCart, buyNow, search }) {
  const filtered = products.filter((p) =>
    `${p.name} ${p.short}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="shop-page">

      <div className="shop-heading">
        <h1>All Products</h1>
        <span>{filtered.length} Products</span>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
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
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (!cart.length) {
    return (
      <main className="empty-page">
        <div className="empty-box">
          <div>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to continue shopping.</p>
          <button onClick={() => setPage("shop")}>
            Shop Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-items">

        <h2>My Cart</h2>

        {cart.map((item) => (
          <div className="cart-item" key={item.id}>

            <img src={item.image} alt={item.name} />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.short}</p>

              <strong>₹{item.price}</strong>

              <div className="qty">
                <button onClick={() => updateQty(item.id, -1)}>
                  −
                </button>

                <span>{item.qty}</span>

                <button onClick={() => updateQty(item.id, 1)}>
                  +
                </button>
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

      <div className="price-box">
        <h3>PRICE DETAILS</h3>

        <div>
          <span>Price</span>
          <strong>₹{total}</strong>
        </div>

        <div>
          <span>Delivery</span>
          <strong className="green">FREE</strong>
        </div>

        <hr />

        <div className="total-row">
          <span>Total Amount</span>
          <strong>₹{total}</strong>
        </div>

        <button onClick={() => setPage("checkout")}>
          PLACE ORDER
        </button>
      </div>

    </main>
  );
}

function Checkout({ cart, setPage, setOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);

  async function submitOrder(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all details.");
      return;
    }

    setLoading(true);

    try {
      const product = cart[0];

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.pincode}`,
          product_name: product.name,
          quantity: cart.reduce((s, p) => s + p.qty, 0),
          total_amount: total,
          advance_amount: product.advance,
          cod_amount: product.cod,
          payment_method: "UPI",
          payment_status: "Pending",
          order_status: "Pending"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

      setOrder({
        id: data.id,
        total,
        advance: product.advance,
        customer: form.name
      });

      setPage("payment");

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <main className="checkout-page">

      <div className="checkout-form">

        <h2>Delivery Address</h2>

        <form onSubmit={submitOrder}>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
          />

          <button disabled={loading}>
            {loading ? "PROCESSING..." : "CONTINUE TO PAYMENT"}
          </button>

        </form>

      </div>

      <div className="checkout-summary">

        <h3>ORDER SUMMARY</h3>

        {cart.map((item) => (
          <div key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <strong>₹{item.price * item.qty}</strong>
          </div>
        ))}

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>

      </div>

    </main>
  );
}

function Payment({ order, setPage }) {
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (!order?.id) return;

    const timer = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/order-status?id=${order.id}`
        );

        const data = await res.json();

        if (
          data.payment_status === "Confirmed" ||
          data.order_status === "Confirmed"
        ) {
          setStatus("Confirmed");
          clearInterval(timer);
        }
      } catch {}
    }, 4000);

    return () => clearInterval(timer);
  }, [order]);

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(STORE_NAME)}` +
    `&am=${encodeURIComponent(order.advance)}` +
    `&cu=INR`;

  if (status === "Confirmed") {
    return (
      <main className="success-page">
        <div className="success-box">
          <div>✓</div>
          <h1>Order Confirmed!</h1>
          <p>Your payment has been verified.</p>
          <strong>Order ID: {order.id}</strong>

          <button onClick={() => setPage("track")}>
            Track Order
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-page">

      <div className="payment-box">

        <div className="payment-icon">💳</div>

        <h2>Complete Payment</h2>

        <p>Pay advance amount to confirm your order.</p>

        <div className="pay-amount">
          ₹{order.advance}
        </div>

        <div className="upi-box">
          <span>UPI ID</span>
          <strong>{UPI_ID}</strong>
        </div>

        <a
          href={upiLink}
          className="upi-button"
        >
          PAY ₹{order.advance} USING UPI
        </a>

        <div className="payment-status">
          <span className="loader"></span>
          Payment verification pending...
        </div>

        <small>
          After payment, our team will verify the transaction.
          Your order will be confirmed after verification.
        </small>

      </div>

    </main>
  );
}

function Track() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  async function trackOrder(e) {
    e.preventDefault();

    if (!id.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/order-status?id=${encodeURIComponent(id)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data);

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <main className="track-page">

      <div className="track-box">

        <h1>Track Your Order</h1>

        <p>Enter your order ID to check status.</p>

        <form onSubmit={trackOrder}>
          <input
            placeholder="Enter Order ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <button>
            {loading ? "SEARCHING..." : "TRACK ORDER"}
          </button>
        </form>

        {order && (
          <div className="order-result">

            <h3>Order Details</h3>

            <p>
              <strong>Order ID:</strong> {order.id}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.payment_status}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {order.order_status}
            </p>

          </div>
        )}

      </div>

    </main>
  );
}

function Footer() {
  return (
    <footer className="fk-footer">

      <div>
        <h3>Flipkart</h3>
        <p>Premium fashion at special prices.</p>
      </div>

      <div>
        <h4>Quick Links</h4>
        <p>About Us</p>
        <p>Contact</p>
        <p>Privacy Policy</p>
      </div>

      <div>
        <h4>Customer Care</h4>
        <p>Track Order</p>
        <p>Payment Help</p>
        <p>Support</p>
      </div>

      <div>
        <h4>Secure Shopping</h4>
        <p>🔒 Safe Payments</p>
        <p>🚚 Fast Delivery</p>
        <p>✓ Verified Orders</p>
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
    setCart((old) => {
      const existing = old.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return old.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...old, { ...product, qty: 1 }];
    });
  }

  function buyNow(product) {
    setCart([{ ...product, qty: 1 }]);
    setPage("checkout");
  }

  function updateQty(id, amount) {
    setCart((old) =>
      old
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((old) =>
      old.filter((item) => item.id !== id)
    );
  }

  return (
    <>
      <Header
        cartCount={cart.reduce((s, p) => s + p.qty, 0)}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />

      {page === "home" && (
        <Home
          products={products}
          addToCart={addToCart}
          buyNow={buyNow}
          setPage={setPage}
          search={search}
        />
      )}

      {page === "shop" && (
        <Shop
          products={products}
          addToCart={addToCart}
          buyNow={buyNow}
          search={search}
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
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);
