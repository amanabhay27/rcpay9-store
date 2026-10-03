import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const UPI_ID = "bharatsingh6688@axl";
const STORE_NAME = "StyleHu Zone";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function OfferTimer() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 600 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="offerTimer">
      <div className="offerTimerTitle">🔥 NAVRATRI SPECIAL OFFER</div>
      <div className="offerTimerText">
        Limited-Time Fashion Offers
      </div>

      <div className="offerTimerClock">
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
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
          <button onClick={() => add(p)}>Add to Cart</button>
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
          <div className="eyebrow">🔥 NAVRATRI SPECIAL</div>

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
          🔥 <b>NAVRATRI OFFERS</b>
          <small>Limited-time fashion offers</small>
        </div>

        <div>
          🔒 <b>SECURE CHECKOUT</b>
          <small>Protected order flow</small>
        </div>

        <div>
          🚚 <b>FAST DELIVERY</b>
          <small>Across India</small>
        </div>

        <div>
          ☎ <b>SUPPORT</b>
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

  const cod = total - advance;

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
                  {money(x.price)} • Advance{" "}
                  {money(x.advance)} • COD{" "}
                  {money(x.cod)}
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
            Total <b>{money(total)}</b>
          </p>

          <p>
            Advance <b>{money(advance)}</b>
          </p>

          <p>
            Remaining COD <b>{money(cod)}</b>
          </p>

          <hr />

          <button
            onClick={() => setPage("checkout")}
          >
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
  const [busy, setBusy] = useState(false);

  const total = cart.reduce(
    (s, x) => s + x.price * x.qty,
    0
  );

  const advance = cart.reduce(
    (s, x) => s + x.advance * x.qty,
    0
  );

  const cod = total - advance;

  const submit = async (e) => {
    e.preventDefault();

    setError("");

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
      setError(
        "Enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    setBusy(true);

    try {
      await placeOrder(form, {
        total,
        advance,
        cod,
        items: cart,
      });
    } catch (err) {
      setError(
        err?.message || "Unable to create order."
      );
      setBusy(false);
    }
  };

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(STORE_NAME)}` +
    `&am=${encodeURIComponent(advance)}` +
    `&cu=INR`;

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
            <div className="error">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Creating Order..."
              : "Continue to UPI Payment"}
          </button>
        </form>

        <aside className="summary">
          <h2>Payment</h2>

          <p>
            Total <b>{money(total)}</b>
          </p>

          <p>
            Advance to Pay <b>{money(advance)}</b>
          </p>

          <p>
            Remaining COD <b>{money(cod)}</b>
          </p>

          <div className="upiBox">
            <strong>Pay Advance by UPI</strong>

            <div className="upiId">
              {UPI_ID}
            </div>

            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  UPI_ID
                )
              }
            >
              Copy UPI ID
            </button>

            <a
              className="upiPayButton"
              href={upiLink}
            >
              Open UPI App →
            </a>

            <small>
              After paying the exact advance amount,
              tap “I Have Paid”. Your order stays
              pending until payment is manually
              verified.
            </small>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PaymentPending({ order, setPage }) {
  const [current, setCurrent] = useState(order);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const data = await api(
          `/api/order-status?id=${encodeURIComponent(
            order.id
          )}`
        );

        if (active && data.order) {
          setCurrent(data.order);

          if (
            [
              "Confirmed",
              "Shipped",
              "Delivered",
            ].includes(data.order.order_status)
          ) {
            setTimeout(
              () => setPage("success"),
              250
            );
          }
        }
      } catch (e) {
        if (active) {
          setError(
            e?.message ||
              "Unable to check order status."
          );
        }
      }
    };

    check();

    const timer = setInterval(check, 4000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [order.id, setPage]);

  return (
    <section className="success">
      <div className="check">✓</div>

      <h1>Payment Submitted</h1>

      <p>
        Your order is{" "}
        <b>
          {current?.order_status || "Pending"}
        </b>
        . We will confirm it after checking the
        UPI payment.
      </p>

      <div className="orderBox">
        <span>
          Order ID <b>{order.id}</b>
        </span>

        <span>
          UPI <b>{UPI_ID}</b>
        </span>

        <span>
          Payment{" "}
          <b>
            {current?.payment_status ||
              "Pending"}
          </b>
        </span>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      <p className="smallNote">
        Keep this Order ID. This page checks for
        confirmation automatically.
      </p>

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

function Success({ order, setPage }) {
  return (
    <section className="success">
      <div className="check">✓</div>

      <h1>Order Confirmed</h1>

      <p>
        Your payment has been verified and your
        order is confirmed.
      </p>

      <div className="orderBox">
        <span>
          Order ID <b>{order.id}</b>
        </span>

        <span>
          Advance{" "}
          <b>
            {money(
              order.advance_amount ||
                order.advance
            )}
          </b>
        </span>

        <span>
          COD{" "}
          <b>
            {money(
              order.cod_amount || order.cod
            )}
          </b>
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = async () => {
    setError("");
    setFound(null);

    if (!id.trim()) {
      setError("Enter your Order ID.");
      return;
    }

    setLoading(true);

    try {
      const data = await api(
        `/api/order-status?id=${encodeURIComponent(
          id.trim()
        )}`
      );

      setFound(data.order || null);

      if (!data.order) {
        setError("Order not found.");
      }
    } catch (e) {
      setError(
        e?.message || "Unable to find order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="track">
      <h1>Track Your Order</h1>

      <p>
        Enter your Order ID to check the latest
        order status.
      </p>

      <div className="trackBox">
        <input
          value={id}
          onChange={(e) =>
            setId(e.target.value)
          }
          placeholder="Paste your Order ID"
        />

        <button
          onClick={track}
          disabled={loading}
        >
          {loading ? "Checking..." : "Track"}
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {found && (
        <div className="timeline">
          <h2>{found.id}</h2>

          <div>
            ● Order Placed
            <small>Order received</small>
          </div>

          <div>
            {found.payment_status === "Paid"
              ? "●"
              : "○"}{" "}
            Payment Verified
            <small>
              {found.payment_status ||
                "Pending"}
            </small>
          </div>

          <div>
            {found.order_status === "Shipped" ||
            found.order_status === "Delivered"
              ? "●"
              : "○"}{" "}
            Shipped
            <small>
              {found.order_status === "Shipped" ||
              found.order_status === "Delivered"
                ? "Shipped"
                : "Pending"}
            </small>
          </div>

          <div>
            {found.order_status === "Delivered"
              ? "●"
              : "○"}{" "}
            Delivered
            <small>
              {found.order_status === "Delivered"
                ? "Delivered"
                : "Pending"}
            </small>
          </div>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footLogo">
        StyleHu <b>Zone</b>
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
    setCart((c) => {
      const old = c.find(
        (x) => x.id === p.id
      );

      if (old) {
        return c.map((x) =>
          x.id === p.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [...c, { ...p, qty: 1 }];
    });
  };

  const buy = (p) => {
    setCart((c) => {
      const old = c.find(
        (x) => x.id === p.id
      );

      if (old) {
        return c.map((x) =>
          x.id === p.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [...c, { ...p, qty: 1 }];
    });

    setPage("cart");
  };

  const remove = (id) => {
    setCart((c) =>
      c.filter((x) => x.id !== id)
    );
  };

  const changeQty = (id, d) => {
    setCart((c) =>
      c.map((x) =>
        x.id === id
          ? {
              ...x,
              qty: Math.max(
                1,
                x.qty + d
              ),
            }
          : x
      )
    );
  };

  const placeOrder = async (
    customer,
    summary
  ) => {
    const itemNames = summary.items
      .map(
        (x) => `${x.name} x${x.qty}`
      )
      .join(" | ");

    const quantity = summary.items.reduce(
      (s, x) => s + x.qty,
      0
    );

    const data = await api(
      "/api/create-order",
      {
        method: "POST",
        body: JSON.stringify({
          customer_name: customer.name,
          phone: customer.phone,

          address:
            `${customer.address}, ` +
            `${customer.city}, ` +
            `${customer.state} - ` +
            `${customer.pincode}`,

          product_name: itemNames,
          quantity,

          total_amount: summary.total,
          advance_amount: summary.advance,
          cod_amount: summary.cod,

          payment_method: "UPI",
          payment_status: "Pending",
          order_status: "Pending",
        }),
      }
    );

    const saved = data.order;

    localStorage.setItem(
      "stylehuzone_last_order_id",
      saved.id
    );

    setOrder(saved);
    setCart([]);
    setPage("paymentPending");
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
  } else if (page === "paymentPending") {
    content = (
      <PaymentPending
        order={order}
        setPage={setPage}
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
          (s, x) => s + x.qty,
          0
        )}
        setPage={setPage}
      />

      {content}

      <Footer />
    </>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
