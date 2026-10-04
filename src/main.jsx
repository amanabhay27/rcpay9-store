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

  async function copyUpi() {
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
      "Payment request received. Your order is pending until the payment is manually verified."
    );
  }

  return (
    <main className="page center-page">
      <div className="payment-card">
        <div className="payment-icon">📱</div>

        <h2>Pay Advance</h2>

        <p>
          Pay the advance amount using PhonePe, Google Pay,
          Paytm or any UPI app.
        </p>

        <div className="payment-amount">
          ₹{Number(order.advance || 0).toFixed(0)}
        </div>

        <div className="upi-box">
          <span>UPI ID</span>

          <strong>{UPI_ID}</strong>

          <button
            type="button"
            className="copy-upi-button"
            onClick={copyUpi}
          >
            {copied ? "COPIED ✓" : "COPY UPI ID"}
          </button>
        </div>

        <div className="payment-instructions">
          <b>How to pay</b>

          <ol>
            <li>Tap COPY UPI ID above.</li>

            <li>
              Open PhonePe, Google Pay, Paytm or any UPI app.
            </li>

            <li>
              Enter the UPI ID:
              <strong> {UPI_ID}</strong>
            </li>

            <li>
              Pay exactly ₹
              {Number(order.advance || 0).toFixed(0)}.
            </li>

            <li>
              After successful payment, tap "I HAVE PAID".
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
          Do not close this page until your payment is complete.
        </small>
      </div>
    </main>
  );
}
