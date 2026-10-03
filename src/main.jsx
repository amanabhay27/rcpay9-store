import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import './styles.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);

      if (data.session) {
        loadOrders();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);

        if (nextSession) {
          loadOrders();
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();

    setLoginError('');
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setLoginError(error.message);
      return;
    }

    setSession(data.session);
  }

  async function sendResetEmail(e) {
    e.preventDefault();

    setLoginError('');
    setMessage('');

    if (!email.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }

    const redirectTo = `${window.location.origin}/`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo
      }
    );

    if (error) {
      setLoginError(error.message);
      return;
    }

    setMessage(
      'Password reset email sent. Open the email and use the link to create a new password.'
    );
  }

  async function updatePassword(e) {
    e.preventDefault();

    setLoginError('');
    setMessage('');

    if (newPassword.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setLoginError(error.message);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setMessage('Password changed successfully. You can now login.');

    await supabase.auth.signOut();

    setSession(null);
    setMode('login');
  }

  async function logout() {
    await supabase.auth.signOut();
    setOrders([]);
    setSession(null);
  }

  async function loadOrders() {
    setDataLoading(true);
    setActionError('');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setActionError(error.message);
    } else {
      setOrders(data || []);
    }

    setDataLoading(false);
  }

  async function updateOrder(id, status) {
    setActionError('');

    const update = { order_status: status };

    if (status === 'Confirmed' || status === 'Shipped' || status === 'Delivered') {
      update.payment_status = 'Paid';
    }

    if (status === 'Cancelled') {
      update.payment_status = 'Rejected';
    }

    const { error } = await supabase
      .from('orders')
      .update(update)
      .eq('id', id);

    if (error) {
      setActionError(error.message);
      return;
    }

    setOrders((old) =>
      old.map((o) =>
        o.id === id
          ? { ...o, ...update }
          : o
      )
    );
  }

  const filtered = useMemo(
    () =>
      orders.filter((o) =>
        Object.values(o)
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [orders, q]
  );

  const sales = orders.reduce(
    (a, o) => a + Number(o.total_amount || 0),
    0
  );

  const paid = orders.reduce(
    (a, o) =>
      a +
      (String(o.payment_status)
        .toLowerCase()
        .includes('paid')
        ? Number(o.advance_amount || 0)
        : 0),
    0
  );

  const pending = orders.filter(
    (o) => (o.order_status || 'Pending') === 'Pending'
  ).length;

  if (loading) {
    return (
      <div className="login">
        <div className="box">
          <div className="logo">RCPAY9</div>
          <p>Checking admin session...</p>
        </div>
      </div>
    );
  }

  /*
    PASSWORD RESET SCREEN
  */
  if (!session && mode === 'reset') {
    return (
      <div className="login">
        <form className="box" onSubmit={updatePassword}>
          <div className="logo">RCPAY9</div>

          <h1>Set New Password</h1>

          <p>Create a new password for your admin account.</p>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            minLength={6}
            required
          />

          {loginError && (
            <div className="error">{loginError}</div>
          )}

          {message && (
            <div className="success">{message}</div>
          )}

          <button type="submit">
            Change Password
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setMessage('');
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  /*
    FORGOT PASSWORD SCREEN
  */
  if (!session && mode === 'forgot') {
    return (
      <div className="login">
        <form className="box" onSubmit={sendResetEmail}>
          <div className="logo">RCPAY9</div>

          <h1>Forgot Password?</h1>

          <p>
            Enter your admin email and we will send you a
            password reset link.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="email"
            required
          />

          {loginError && (
            <div className="error">{loginError}</div>
          )}

          {message && (
            <div className="success">{message}</div>
          )}

          <button type="submit">
            Send Reset Link
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setMessage('');
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  /*
    LOGIN SCREEN
  */
  if (!session) {
    return (
      <div className="login">
        <form className="box" onSubmit={login}>
          <div className="logo">RCPAY9</div>

          <h1>Admin Panel</h1>

          <p>Secure store management</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          {loginError && (
            <div className="error">{loginError}</div>
          )}

          {message && (
            <div className="success">{message}</div>
          )}

          <button type="submit">
            Login
          </button>

          <button
            type="button"
            className="forgot"
            onClick={() => {
              setMode('forgot');
              setLoginError('');
              setMessage('');
            }}
          >
            Forgot Password?
          </button>

          <small>
            Use your existing Supabase admin account.
          </small>
        </form>
      </div>
    );
  }

  /*
    ADMIN DASHBOARD
  */
  return (
    <div className="app">
      <aside>
        <div className="brand">
          RCPAY9 <span>ADMIN</span>
        </div>

        {[
          'Dashboard',
          'Orders',
          'Payments',
          'Customers'
        ].map((x) => (
          <button
            className={tab === x ? 'active' : ''}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main>
        <header>
          <div>
            <h1>{tab}</h1>
            <p>RCPAY9 store management</p>
          </div>

          <div className="live">● Live</div>
        </header>

        {actionError && (
          <div className="error top">
            {actionError}
          </div>
        )}

        {tab === 'Dashboard' && (
          <>
            <section className="cards">
              <div>
                <b>Total Orders</b>
                <strong>{orders.length}</strong>
              </div>

              <div>
                <b>Total Sales</b>
                <strong>
                  ₹{sales.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <b>Advance Collected</b>
                <strong>
                  ₹{paid.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <b>Pending</b>
                <strong>{pending}</strong>
              </div>
            </section>

            <section className="panel">
              <div className="toolbar">
                <h2>Recent Orders</h2>

                <button onClick={loadOrders}>
                  Refresh
                </button>
              </div>

              <Orders
                rows={filtered.slice(0, 5)}
                update={updateOrder}
                loading={dataLoading}
              />
            </section>
          </>
        )}

        {tab === 'Orders' && (
          <section className="panel">
            <div className="toolbar">
              <h2>All Orders</h2>

              <div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search order/customer/product"
                />

                <button onClick={loadOrders}>
                  Refresh
                </button>
              </div>
            </div>

            <Orders
              rows={filtered}
              update={updateOrder}
              loading={dataLoading}
            />
          </section>
        )}

        {tab === 'Payments' && (
          <section className="panel">
            <h2>Payments</h2>

            <Orders
              rows={filtered.filter((o) =>
                String(o.payment_status)
                  .toLowerCase()
                  .includes('paid')
              )}
              update={updateOrder}
              loading={dataLoading}
            />
          </section>
        )}

        {tab === 'Customers' && (
          <section className="panel">
            <h2>Customers</h2>

            <Orders
              rows={filtered}
              update={updateOrder}
              loading={dataLoading}
            />
          </section>
        )}
      </main>
    </div>
  );
}

function Orders({ rows, update, loading }) {
  return (
    <div className="tablewrap">
      {loading ? (
        <p>Loading orders...</p>
      ) : rows.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>{String(o.id).slice(0, 8)}</b>
                  <br />
                  <small>
                    {o.created_at
                      ? new Date(
                          o.created_at
                        ).toLocaleString('en-IN')
                      : ''}
                  </small>
                </td>

                <td>
                  {o.customer_name}
                  <br />
                  <small>{o.phone}</small>
                </td>

                <td>{o.product_name}</td>

                <td>
                  ₹
                  {Number(
                    o.total_amount || 0
                  ).toLocaleString('en-IN')}
                </td>

                <td>
                  ₹
                  {Number(
                    o.advance_amount || 0
                  ).toLocaleString('en-IN')}
                  <br />
                  <small>
                    COD ₹
                    {Number(
                      o.cod_amount || 0
                    ).toLocaleString('en-IN')}
                  </small>
                </td>

                <td>
                  <span
                    className={
                      String(o.payment_status)
                        .toLowerCase()
                        .includes('paid')
                        ? 'paid'
                        : 'pending'
                    }
                  >
                    {o.payment_status || 'Pending'}
                  </span>
                </td>

                <td>
                  <select
                    value={o.order_status || 'Pending'}
                    onChange={(e) => update(o.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                  {(o.payment_status || 'Pending') !== 'Paid' &&
                    (o.order_status || 'Pending') !== 'Cancelled' && (
                      <div className="orderActions">
                        <button onClick={() => update(o.id, 'Confirmed')}>
                          ✓ Verify Payment
                        </button>
                        <button
                          className="danger"
                          onClick={() => update(o.id, 'Cancelled')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

createRoot(
  document.getElementById('root')
).render(<App />);
