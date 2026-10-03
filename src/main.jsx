import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {products} from "./products";
import "./styles.css";

const money = n => `₹${n.toLocaleString("en-IN")}`;

function Header({cartCount, setPage}) {
  return <header className="header">
    <button className="logo" onClick={()=>setPage("home")}>
      <span>StyleHu</span><b>Zone</b>
      <small>STYLE • FASHION • YOU</small>
    </button>

    <nav>
      <button onClick={()=>setPage("home")}>Home</button>
      <button onClick={()=>setPage("shop")}>Shop</button>
      <button onClick={()=>setPage("track")}>Track Order</button>
      <button onClick={()=>setPage("contact")}>Contact</button>
    </nav>

    <button className="cartIcon" onClick={()=>setPage("cart")}>
      🛒 <i>{cartCount}</i>
    </button>
  </header>
}

function SaleBanner() {
  return <section className="saleBanner">
    <div>
      <strong>🔥 MEGA SALE — NAVRATRI SPECIAL 🔥</strong>
      <span>Limited-Time Fashion Offers • Premium Men's Collection</span>
    </div>
  </section>
}

function ProductCard({p, add, buy}) {
  return <article className="card">
    <div className="pic">
      <img src={p.image} alt={p.name}/>
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
        <b>Pay Advance: {money(p.advance)}</b>
        <span>COD: {money(p.cod)}</span>
      </div>

      <div className="actions">
        <button onClick={()=>add(p)}>Add to Cart</button>
        <button className="dark" onClick={()=>buy(p)}>Buy Now</button>
      </div>
    </div>
  </article>
}

function Home({add,buy,setPage}) {
  return <>
    <SaleBanner/>

    <section className="hero">
      <img src="/hero.jpg" alt="" />
      <div className="heroShade"/>

      <div className="heroText">
        <div className="eyebrow">🔥 NAVRATRI SPECIAL</div>

        <h1>
          MEGA SALE<br/>
          <em>STYLE COLLECTION</em>
        </h1>

        <p>Premium fashion combos • Accessories • Everyday style</p>

        <button onClick={()=>setPage("shop")}>
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

        <button onClick={()=>setPage("shop")}>
          View All →
        </button>
      </div>

      <div className="grid">
        {products.map(p=>
          <ProductCard
            key={p.id}
            p={p}
            add={add}
            buy={buy}
          />
        )}
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
}

function Shop({add,buy}) {
  return <section className="section shop">
    <div className="sectionHead">
      <div>
        <h1>Shop All Products</h1>
        <p>
          Navratri Special — limited-time fashion offers.
        </p>
      </div>
    </div>

    <div className="grid">
      {products.map(p=>
        <ProductCard
          key={p.id}
          p={p}
          add={add}
          buy={buy}
        />
      )}
    </div>
  </section>
}

function Cart({cart,setPage,remove,changeQty}) {
  const total = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const advance = cart.reduce((s,x)=>s+x.advance*x.qty,0);
  const cod = total-advance;

  if(!cart.length)
    return <section className="empty">
      <h1>Your cart is empty</h1>
      <p>Add a combo to get started.</p>
      <button onClick={()=>setPage("shop")}>
        Shop Products
      </button>
    </section>;

  return <section className="section">
    <h1>Your Cart</h1>

    <div className="cartLayout">
      <div>
        {cart.map(x=>
          <div className="cartItem" key={x.id}>
            <img src={x.image}/>

            <div>
              <h3>{x.name}</h3>

              <p>
                {money(x.price)} • Advance {money(x.advance)}
                • COD {money(x.cod)}
              </p>

              <div className="qty">
                <button onClick={()=>changeQty(x.id,-1)}>-</button>
                <b>{x.qty}</b>
                <button onClick={()=>changeQty(x.id,1)}>+</button>

                <button
                  className="remove"
                  onClick={()=>remove(x.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
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

        <hr/>

        <button onClick={()=>setPage("checkout")}>
          Proceed to Checkout
        </button>
      </aside>
    </div>
  </section>
}

function Checkout({cart,placeOrder,setPage}) {
  const [form,setForm]=useState({
    name:"",
    phone:"",
    email:"",
    address:"",
    city:"",
    state:"",
    pincode:""
  });

  const [error,setError]=useState("");

  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const advance=cart.reduce((s,x)=>s+x.advance*x.qty,0);
  const cod=total-advance;

  const submit=e=>{
    e.preventDefault();

    if(Object.values(form).some(v=>!v.trim()))
      return setError("Please fill all required fields.");

    if(!/^\d{10}$/.test(form.phone))
      return setError("Enter a valid 10-digit mobile number.");

    if(!/^\d{6}$/.test(form.pincode))
      return setError("Enter a valid 6-digit pincode.");

    placeOrder(form,{
      total,
      advance,
      cod,
      items:cart
    });
  };

  return <section className="section">
    <h1>Checkout</h1>

    <div className="checkout">
      <form onSubmit={submit}>
        <h2>Shipping Details</h2>

        {[
          "name",
          "phone",
          "email",
          "address",
          "city",
          "state",
          "pincode"
        ].map(k=>
          <input
            key={k}
            placeholder={
              k==="name"
                ? "Full Name"
                : k==="phone"
                ? "Mobile Number"
                : k==="pincode"
                ? "Pincode"
                : k[0].toUpperCase()+k.slice(1)
            }
            value={form[k]}
            onChange={e=>
              setForm({
                ...form,
                [k]:e.target.value
              })
            }
            required={k!=="email"}
          />
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit">
          Place Order
        </button>
      </form>

      <aside className="summary">
        <h2>Order Summary</h2>

        {cart.map(x=>
          <p key={x.id}>
            {x.name} × {x.qty}
            <b>{money(x.price*x.qty)}</b>
          </p>
        )}

        <hr/>

        <p>
          Total <b>{money(total)}</b>
        </p>

        <p>
          Advance to Pay <b>{money(advance)}</b>
        </p>

        <p>
          Remaining COD <b>{money(cod)}</b>
        </p>

        <small>
          Payment gateway will be connected in the next phase.
          This version records the order locally for testing.
        </small>
      </aside>
    </div>
  </section>
}

function Success({order,setPage}) {
  return <section className="success">
    <div className="check">✓</div>

    <h1>Order Placed</h1>

    <p>
      Your test order has been recorded successfully.
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
      <button onClick={()=>setPage("track")}>
        Track Order
      </button>

      <button
        className="outline"
        onClick={()=>setPage("home")}
      >
        Continue Shopping
      </button>
    </div>
  </section>
}

function Track({setPage}) {
  const [id,setId]=useState("");
  const [found,setFound]=useState(null);

  const track=()=>{
    setFound(
      JSON.parse(
        localStorage.getItem("rcpay9_last_order") || "null"
      )
    );
  };

  return <section className="track">
    <h1>Track Your Order</h1>

    <p>
      Enter your Order ID. During testing, the latest locally
      saved order can be retrieved.
    </p>

    <div className="trackBox">
      <input
        value={id}
        onChange={e=>setId(e.target.value)}
        placeholder="e.g. SHZ123456"
      />

      <button onClick={track}>
        Track
      </button>
    </div>

    {found &&
      <div className="timeline">
        <h2>{found.id}</h2>

        <div>
          ● Order Placed
          <small>Order received</small>
        </div>

        <div>
          ● Advance Pending/Received
          <small>Payment gateway will be connected next</small>
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
    }
  </section>
}

function Footer(){
  return <footer>
    <div className="footLogo">
      StyleHu<b>Zone</b>
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
}

function App(){
  const [page,setPage]=useState("home");
  const [cart,setCart]=useState([]);
  const [order,setOrder]=useState(null);

  const add=p=>
    setCart(c=>{
      const old=c.find(x=>x.id===p.id);

      return old
        ? c.map(x=>
            x.id===p.id
              ? {...x,qty:x.qty+1}
              : x
          )
        : [...c,{...p,qty:1}]
    });

  const buy=p=>{
    add(p);
    setPage("cart");
  };

  const remove=id=>
    setCart(c=>c.filter(x=>x.id!==id));

  const changeQty=(id,d)=>
    setCart(c=>
      c.map(x=>
        x.id===id
          ? {...x,qty:Math.max(1,x.qty+d)}
          : x
      )
    );

  const placeOrder=(customer,summary)=>{
    const o={
      id:"SHZ"+Math.floor(100000+Math.random()*900000),
      ...summary,
      customer,
      createdAt:new Date().toISOString()
    };

    localStorage.setItem(
      "stylehuzone_last_order",
      JSON.stringify(o)
    );

    setOrder(o);
    setCart([]);
    setPage("success");
  };

  const content =
    page==="home"
      ? <Home add={add} buy={buy} setPage={setPage}/>
      : page==="shop"
      ? <Shop add={add} buy={buy}/>
      : page==="cart"
      ? <Cart
          cart={cart}
          setPage={setPage}
          remove={remove}
          changeQty={changeQty}
        />
      : page==="checkout"
      ? <Checkout
          cart={cart}
          placeOrder={placeOrder}
          setPage={setPage}
        />
      : page==="success"
      ? <Success order={order} setPage={setPage}/>
      : page==="track"
      ? <Track setPage={setPage}/>
      : <section className="contact">
          <h1>Contact StyleHu Zone</h1>
          <p>
            For support, contact us at{" "}
            <b>support@rcpay9.online</b>.
          </p>
        </section>;

  return <>
    <Header
      cartCount={cart.reduce((s,x)=>s+x.qty,0)}
      setPage={setPage}
    />

    {content}

    <Footer/>
  </>
}

createRoot(document.getElementById("root")).render(<App/>);
