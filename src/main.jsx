import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { products } from "./products";
import "./styles.css";

const UPI_ID = "bharatsingh6688@axl";
const STORE_NAME = "Flipkart";

function SaleTimer() {
  const [time, setTime] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((old) => (old <= 0 ? 600 : old - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="sale-timer">
      <span>Live Sale :</span>
      <b>{minutes}min {seconds}sec</b>
    </div>
  );
}

function TopHeader({ search, setSearch, setPage, cartCount }) {
  return (
    <>
      <div className="mobile-top">
        <div className="brand-tabs">
          <button className="brand-tab active">
            <span className="brand-symbol">f</span>
            <strong>Flipkart</strong>
          </button>

          <button className="brand-tab travel">
            ✈️
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
      </div>

      <div className="desktop-header">
        <div className="desktop-logo" onClick={() => setPage("home")}>
          Flipkart
        </div>

        <div className="desktop-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Products, Brands and More"
          />
        </div>

        <button onClick={() => setPage("cart")}>
          🛒 Cart {cartCount > 0 && `(${cartCount})`}
        </button>
      </div>
    </>
  );
}

function Categories({ setPage }) {
  const categories = [
    ["🛍️", "For You"],
    ["👕", "Fashion"],
    ["📱", "Mobiles"],
    ["💄", "Beauty"],
    ["💻", "Electronics"],
    ["⌚", "Watches"],
  ];

  return (
    <div className="categories">
      {categories.map(([icon, name], index) => (
        <button
          key={name}
          className={index === 0 ? "category active" : "category"}
          onClick={() => setPage("shop")}
        >
          <span>{icon}</span>
          <b>{name}</b>
        </button>
      ))}
    </div>
  );
}

function SaleBanner() {
  return (
    <div className="sale-banner">
      <img
        src="/hero.png"
        alt="Mega Sale"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="sale-banner-fallback">
        <small>OMG! FASHION SALE</small>
        <strong>SALE IS LIVE</strong>
        <span>Premium Men's Fashion Deals</span>
      </div>
    </div>
  );
}

function ProductCard({ product, addToCart, buyNow }) {
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <article className="sale-product">

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-content">

        <h3>{product.name}</h3>

        <div className="discount-line">
          <span>{discount}% Off</span>
          <del>₹{product.mrp}.00</del>
        </div>

        <div className="sale-price">
          ₹{product.price}.00
          <span className="assured">
            ✓ Assured
          </span>
        </div>

        <div className="rating-line">
          <span className="rating">4.5 ★</span>
          <span> {Math.floor(3000 + product.id * 827)} Ratings</span>
        </div>

        <p className="delivery-text">
          Free Delivery in Two Days
        </p>

        <div className="product-buttons">
          <button
            className="cart-small"
            onClick={() => addToCart(product)}
          >
            ADD
          </button>

          <button
            className="buy-small"
            onClick={() => buyNow(product)}
          >
            BUY NOW
          </button>
        </div>

      </div>
    </article>
  );
}

function Home({
  search,
  products,
  addToCart,
  buyNow,
  setPage,
}) {
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      `${product.name} ${product.short}`
        .toLowerCase()
        .includes(query)
    );
  }, [search, products]);

  return (
    <main>

      <Categories setPage={setPage} />

      <SaleBanner />

      <section className="live-sale">
        <SaleTimer />

        <div className="watching">
          <span></span>
          14,352 People watching this sale
        </div>
      </section>

      <section className="products-section">

        <div className="section-title">
          <h2>Best Deals For You</h2>
          <button onClick={() => setPage("shop")}>
            View All
          </button>
        </div>

        <div className="products-grid">

          {filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                buyNow={buyNow}
              />
            ))
          ) : (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try another search.</p>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}

function Shop({
  products,
  search,
  addToCart,
  buyNow,
}) {
  const filtered = products.filter((product) =>
    `${product.name} ${product.short}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="shop-page">

      <div className="shop-heading">
        <h2>All Products</h2>
        <span>{filtered.length} items</span>
      </div>

      <div className="products-grid">
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

function Cart({
  cart,
  setPage,
  updateQty,
  removeItem,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main className="cart-page">

      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
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

                <div>
                  <h3>{item.name}</h3>
                  <p>{item.short}</p>

                  <strong>
                    ₹{item.price}
                  </strong>

                  <div className="quantity">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove"
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

          <button
            className="checkout-button"
            onClick={() => setPage("checkout")}
          >
            PLACE ORDER
          </button>
        </>
      )}

    </main>
  );
}

function Checkout({
  cart,
  setPage,
  setOrder,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const product = cart[0];

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
      const response = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: form.name,
            phone: form.phone,
            address: `${form.address}, ${form.pincode}`,
            product_name: product.name,
            quantity: cart.reduce(
              (sum, item) => sum + item.qty,
              0
            ),
            total_amount: total,
            advance_amount: product.advance,
            cod_amount: product.cod,
            payment_method: "UPI",
            payment_status: "Pending",
            order_status: "Pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Order could not be created"
        );
      }

      setOrder({
        id: data.id,
        total,
        advance: product.advance,
        customer: form.name,
      });

      setPage("payment");

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  return (
    <main className="checkout-page">

      <div className="checkout-card">

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

          <div className="checkout-price">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            type="submit"
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

function Payment({
  order,
  setPage,
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!order?.id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/order-status?id=${order.id}`
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
      <main className="success-page">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>Order Confirmed!</h1>

          <p>
            Your payment has been verified successfully.
          </p>

          <small>
            Order ID: {order.id}
          </small>

          <button onClick={() => setPage("track")}>
            Track Order
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
    <main className="payment-page">

      <div className="payment-card">

        <div className="payment-icon">
          💳
        </div>

        <h2>Complete Your Payment</h2>

        <p>Pay the advance amount to confirm your order.</p>

        <div className="payment-amount">
          ₹{order.advance}
        </div>

        <div className="upi-details">
          <span>UPI ID</span>
          <strong>{UPI_ID}</strong>
        </div>

        <a
          href={upiLink}
          className="pay-upi"
        >
          PAY ₹{order.advance} USING UPI
        </a>

        <div className="pending">
          <span></span>
          Waiting for payment verification...
        </div>

        <p className="payment-note">
          After payment, your order will remain pending
          until the payment is verified.
        </p>

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

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="track-page">

      <div className="track-card">

        <h2>Track Your Order</h2>

        <p>Enter your Order ID below.</p>

        <form onSubmit={track}>
          <input
            placeholder="Order ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <button>
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
        Categories
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
        <span>
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
        <h3>Flipkart</h3>
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
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...old,
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
    setCart((old) =>
      old
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty + amount,
              }
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

  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="app">

      <TopHeader
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        cartCount={cartCount}
      />

      {page === "home" && (
        <Home
          search={search}
          products={products}
          addToCart={addToCart}
          buyNow={buyNow}
          setPage={setPage}
        />
      )}

      {page === "shop" && (
        <Shop
          products={products}
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
