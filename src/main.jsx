function Payment({ order, setPage }) {
  const [paidClicked, setPaidClicked] = useState(false);
  const [copied, setCopied] = useState(false);

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
          <p>Please place the order again.</p>

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

  async function copyUPI() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(`UPI ID: ${UPI_ID}`);
    }
  }

  function markAsPaid() {
    setPaidClicked(true);

    alert(
      "Payment request received. Your order will remain pending until payment is manually verified."
    );
  }

  return (
    <main className="page center-page">
      <div className="payment-card">

        <div className="payment-icon">💳</div>

        <h2>Complete Payment</h2>

        <p className="payment-subtitle">
          Order place karne ke liye neeche diye gaye UPI ID par
          advance payment karein.
        </p>

        <div className="payment-amount">
          ₹{Number(order.advance || 0).toFixed(0)}
        </div>

        <div className="upi-payment-box">

          <span className="upi-label">
            Pay using any UPI app
          </span>

          <div className="upi-id-row">
            <strong>{UPI_ID}</strong>

            <button
              type="button"
              className="copy-upi-btn"
              onClick={copyUPI}
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>

        </div>

        <div className="payment-apps">
          <span>📱 PhonePe</span>
          <span>💙 Google Pay</span>
          <span>💚 Paytm</span>
          <span>💳 Any UPI App</span>
        </div>

        <div className="payment-instructions">

          <b>How to pay</b>

          <ol>
            <li>Upar diya gaya UPI ID copy karein.</li>
            <li>PhonePe, Google Pay, Paytm ya koi bhi UPI app open karein.</li>
            <li>UPI ID paste karke exactly ₹{Number(order.advance || 0).toFixed(0)} payment karein.</li>
            <li>Payment successful hone ke baad <b>I HAVE PAID</b> button dabayein.</li>
          </ol>

        </div>

        <button
          className="pay-button"
          type="button"
          onClick={markAsPaid}
        >
          {paidClicked ? "PAYMENT SUBMITTED ✓" : "I HAVE PAID"}
        </button>

        <div className="pending-status">
          <span />
          {paidClicked
            ? "Payment submitted — waiting for verification..."
            : "Waiting for payment verification..."}
        </div>

        <div className="payment-note">
          <b>Important:</b> Payment karte waqt amount exactly
          ₹{Number(order.advance || 0).toFixed(0)} hi enter karein.
        </div>

        <small>
          Order ID: {order.id}
          <br />
          Payment verification manually ki jayegi.
        </small>

      </div>
    </main>
  );
}
