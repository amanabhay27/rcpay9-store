import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function OfferTimer() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 600 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="offerTimer">
      <div className="offerTimerTitle">
        🔥 NAVRATRI SPECIAL OFFER
      </div>

      <div className="offerTimerText">
        Limited-Time Fashion Offers
      </div>

      <div className="offerTimerClock">
        {String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </div>

      <div className="offerTimerSmall">
        Offer refreshes every 10 minutes
      </div>
    </div>
  );
}

function Header({ cartCount, setPage }) {
  return (
    <header className="header">
      <button className="logo" onClick={() => setPage("home")}>
        <span>StyleHu</span>
        <b>Zone</b>
        <small>STYLE • FASHION • YOU</small>
      </button>

      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("shop")}>Shop</button>
        <button onClick={() => setPage("track")}>Track Order</button>
        <button onClick={() => setPage("contact")}>Contact</button>
      </nav>

      <button className="cartIcon" onClick={() => setPage("cart")}>
        🛒 <i>{cartCount}</i>
      </button>
    </header>
  );
}

function SaleBanner() {
  return (
    <section className="saleBanner">
      <div>
        <strong>🔥 MEGA SALE — NAVRATRI SPECIAL 🔥</strong>
        <span>Limited-Time Fashion Offers</span>
      </div>
    </section>
  );
}

function ProductCard({ p, add, buy }) {
  return (
    <article className="card">
      <div className="pic">
        <img src={p.image} alt={p.name} />
        <span>{p.badge}</span>
      </div>

      <div className="cardBody">
        <h3>{p.name}</h3>

        <p>{p.short}</p>

        <div className="prices">
          <del>{money(p.mrp)}</del>
          <strong>{money(p.price)}</strong>
        </div>

        <div className="payline">
          <b>Advance: {money(p.advance)}</b>
          <span>COD: {money(p.cod)}</span>
        </div>

        <div className="actions">
          <button onClick={() => add(p)}>
            Add to Cart
          </button>

          <button className="dark" onClick={() => buy(p)}>
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({ add, buy, setPage }) {
  return (
    <>
      <SaleBanner />

      <OfferTimer />

      <section className="hero">
        <img
          src="/hero.png"
          alt="StyleHu Zone Navratri Mega Sale"
        />

        <div className="heroShade" />

        <div className="heroText">
          <div className="eyebrow">
            🔥 NAVRATRI SPECIAL
          </div>

          <h1>
            MEGA SALE
            <br />
            <em>STYLE COLLECTION</em>
          </h1>

          <p>
            Premium fashion combos • Accessories • Everyday style
          </p>

          <button onClick={() => setPage("shop")}>
            SHOP NOW →
          </button>
        </div>

        <div className="trust">
          <div>
            ✓ <b>Premium Quality</b>
            <small>Trusted products</small>
          </div>

          <div>
            ✓ <b>Cash on Delivery</b>
            <small>Pay remaining after delivery</small>
          </div>

          <div>
            ✓ <b>Fast Delivery</b>
            <small>Across India</small>
          </div>

          <div>
            ✓ <b>Easy Returns</b>
            <small>7-day policy</small>
          </div>
        </div>
      </section>

      <section className="strip">
        <div>
          🔥
          <b>NAVRATRI OFFERS</b>
          <small>Limited-time fashion offers</small>
        </div>

        <div>
          🔒
          <b>SECURE CHECKOUT</b>
          <small>Protected checkout</small>
        </div>

        <div>
          🚚
          <b>FAST DELIVERY</b>
          <small>Across India</small>
        </div>

        <div>
          ☎
          <b>SUPPORT</b>
          <small>We're here to help</small>
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <div>
            <h2>Featured Products</h2>
            <p>Six curated combos — choose your style.</p>
          </div>

          <button onClick={() => setPage("shop")}>
            View All →
          </button>
        </div>

        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              add={add}
              buy={buy}
            />
          ))}
        </div>
      </section>

      <section className="why">
        <h2>Why Choose StyleHu Zone?</h2>

        <div className="whyGrid">
          <div>
            ★
            <b>Curated Combos</b>
            <span>Convenient value sets</span>
          </div>

          <div>
            🚚
            <b>Fast Delivery</b>
            <span>Service across India</span>
          </div>

          <div>
            🔐
            <b>Secure Payments</b>
            <span>Protected checkout</span>
          </div>

          <div>
            ♡
            <b>Customer Support</b>
            <span>We're here to help</span>
          </div>
        </div>
      </section>
    </>
  );
}

function Shop({ add, buy }) {
  return (
    <>
      <OfferTimer />

      <section className="section shop">
        <div className="sectionHead">
          <div>
            <h1>Shop All Products</h1>
            <p>
              Navratri Special — limited-time fashion offers.
            </p>
          </div>
        </div>

        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              add={add}
              buy={buy}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function Cart({
  cart,
  setPage,
  remove,
  changeQty,
}) {
  const total = cart.reduce(
    (s, x) => s + x.price * x.qty,
    0
  );

  const advance = cart.reduce(
    (s, x) => s + x.advance * x.qty,
    0
  );

  const cod = cart.reduce(
    (s, x) => s + x.cod * x.qty,
    0
  );

  if (!cart.length) {
    return (
      <section className="empty">
        <h1>Your cart is empty</h1>

        <p>Add a combo to get started.</p>

        <button onClick={() => setPage("shop")}>
          Shop Products
        </button>
      </section>
    );
  }

  return (
    <section className="section">
      <h1>Your Cart</h1>

      <div className="cartLayout">
        <div>
          {cart.map((x) => (
            <div className="cartItem" key={x.id}>
              <img src={x.image} alt={x.name} />

              <div>
                <h3>{x.name}</h3>

                <p>
                  {money(x.price)}
                  {" • "}
                  Advance {money(x.advance)}
                  {" • "}
                  COD {money(x.cod)}
                </p>

                <div className="qty">
                  <button
                    onClick={() =>
                      changeQty(x.id, -1)
                    }
                  >
                    -
                  </button>

                  <b>{x.qty}</b>

                  <button
                    onClick={() =>
                      changeQty(x.id, 1)
                    }
                  >
                    +
                  </button>

                  <button
                    className="remove"
                    onClick={() => remove(x.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h2>Order Summary</h2>

          <p>
            Total
            <b>{money(total)}</b>
          </p>

          <p>
            Advance
            <b>{money(advance)}</b>
          </p>

          <p>
            Remaining COD
            <b>{money(cod)}</b>
          </p>

          <hr />

          <button onClick={() => setPage("checkout")}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}

function Checkout({ cart, placeOrder }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const total = cart.reduce(
    (s, x) => s + x.price * x.qty,
    0
  );

  const advance = cart.reduce(
    (s, x) => s + x.advance * x.qty,
    0
  );

  const cod = cart.reduce(
    (s, x) => s + x.cod * x.qty,
    0
  );

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    setError("");

    placeOrder(form, {
      total,
      advance,
      cod,
      items: cart,
    });
  };

  return (
    <section className="section">
      <h1>Checkout</h1>

      <div className="checkout">
        <form onSubmit={submit}>
          <h2>Shipping Details</h2>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Full Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) =>
              setForm({
                ...form,
                pincode: e.target.value,
              })
            }
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button type="submit">
            Place Order
          </button>
        </form>

        <aside className="summary">
          <h2>Order Summary</h2>

          {cart.map((x) => (
            <p key={x.id}>
              {x.name} × {x.qty}
              <b>{money(x.price * x.qty)}</b>
            </p>
          ))}

          <hr />

          <p>
            Total
            <b>{money(total)}</b>
          </p>

          <p>
            Advance to Pay
            <b>{money(advance)}</b>
          </p>

          <p>
            Remaining COD
            <b>{money(cod)}</b>
          </p>

          <small>
            Payment gateway will be connected in the next phase.
          </small>
        </aside>
      </div>
    </section>
  );
}

function Success({ order, setPage }) {
  return (
    <section className="success">
      <div className="check">✓</div>

      <h1>Order Placed</h1>

      <p>
        Your order has been recorded successfully.
      </p>

      <div className="orderBox">
        <span>
          Order ID
          <b>{order.id}</b>
        </span>

        <span>
          Advance
          <b>{money(order.advance)}</b>
        </span>

        <span>
          COD
          <b>{money(order.cod)}</b>
        </span>
      </div>

      <div>
        <button onClick={() => setPage("track")}>
          Track Order
        </button>

        <button
          className="outline"
          onClick={() => setPage("home")}
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
}

function Track() {
  const [id, setId] = useState("");
  const [found, setFound] = useState(null);

  const track = () => {
    const saved = localStorage.getItem(
      "stylehuzone_last_order"
    );

    if (!saved) {
      setFound(null);
      return;
    }

    const order = JSON.parse(saved);

    if (!id.trim() || id.trim() === order.id) {
      setFound(order);
    } else {
      setFound(null);
    }
  };

  return (
    <section className="track">
      <h1>Track Your Order</h1>

      <p>
        Enter your Order ID to check the latest order status.
      </p>

      <div className="trackBox">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. SHZ123456"
        />

        <button onClick={track}>
          Track
        </button>
      </div>

      {found && (
        <div className="timeline">
          <h2>{found.id}</h2>

          <div>
            ● Order Placed
            <small>Order received</small>
          </div>

          <div>
            ● Advance
            <small>Order is being processed</small>
          </div>

          <div>
            ○ Shipped
            <small>Awaiting fulfilment</small>
          </div>

          <div>
            ○ Delivered
            <small>Pending</small>
          </div>
        </div>
      )}

      {!found && id && (
        <div className="error">
          Order not found.
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footLogo">
        StyleHu
        <b>Zone</b>
        <small>STYLE • FASHION • YOU</small>
      </div>

      <div>
        <b>Quick Links</b>
        <span>Home</span>
        <span>Shop</span>
        <span>Track Order</span>
      </div>

      <div>
        <b>Customer Support</b>
        <span>Help Center</span>
        <span>Return Policy</span>
        <span>Terms & Conditions</span>
      </div>

      <div>
        <b>Contact</b>
        <span>support@rcpay9.online</span>
        <span>India</span>
      </div>

      <p>
        © 2026 StyleHu Zone. All rights reserved.
      </p>
    </footer>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  const add = (p) => {
    setCart((current) => {
      const existing = current.find(
        (x) => x.id === p.id
      );

      if (existing) {
        return current.map((x) =>
          x.id === p.id
            ? {
                ...x,
                qty: x.qty + 1,
              }
            : x
        );
      }

      return [
        ...current,
        {
          ...p,
          qty: 1,
        },
      ];
    });
  };

  const buy = (p) => {
    setCart((current) => {
      const existing = current.find(
        (x) => x.id === p.id
      );

      if (existing) {
        return current.map((x) =>
          x.id === p.id
            ? {
                ...x,
                qty: x.qty + 1,
              }
            : x
        );
      }

      return [
        ...current,
        {
          ...p,
          qty: 1,
        },
      ];
    });

    setPage("cart");
  };

  const remove = (id) => {
    setCart((current) =>
      current.filter((x) => x.id !== id)
    );
  };

  const changeQty = (id, difference) => {
    setCart((current) =>
      current.map((x) =>
        x.id === id
          ? {
              ...x,
              qty: Math.max(
                1,
                x.qty + difference
              ),
            }
          : x
      )
    );
  };

  const placeOrder = (customer, summary) => {
    const newOrder = {
      id:
        "SHZ" +
        Math.floor(
          100000 +
            Math.random() * 900000
        ),

      customer,
      ...summary,

      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "stylehuzone_last_order",
      JSON.stringify(newOrder)
    );

    setOrder(newOrder);
    setCart([]);
    setPage("success");
  };

  let content;

  if (page === "home") {
    content = (
      <Home
        add={add}
        buy={buy}
        setPage={setPage}
      />
    );
  } else if (page === "shop") {
    content = (
      <Shop
        add={add}
        buy={buy}
      />
    );
  } else if (page === "cart") {
    content = (
      <Cart
        cart={cart}
        setPage={setPage}
        remove={remove}
        changeQty={changeQty}
      />
    );
  } else if (page === "checkout") {
    content = (
      <Checkout
        cart={cart}
        placeOrder={placeOrder}
      />
    );
  } else if (page === "success") {
    content = (
      <Success
        order={order}
        setPage={setPage}
      />
    );
  } else if (page === "track") {
    content = <Track />;
  } else {
    content = (
      <section className="contact">
        <h1>Contact StyleHu Zone</h1>

        <p>
          For support, contact us at{" "}
          <b>support@rcpay9.online</b>.
        </p>
      </section>
    );
  }

  return (
    <>
      <Header
        cartCount={cart.reduce(
          (sum, item) =>
            sum + item.qty,
          0
        )}
        setPage={setPage}
      />

      {content}

      <Footer />
    </>
  );
}

const rootElement =
  document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <App />
  );
}
