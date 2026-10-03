# StyleHu Zone Store

Customer store with manual UPI payment verification.

## UPI
UPI ID: bharatsingh6688@axl

## Vercel environment variables
- SUPABASE_URL = Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY = Supabase service-role key (server-side only; never put it in VITE_ variables or frontend code)

The browser creates a pending order through `/api/create-order`. The admin verifies the UPI payment. The browser polls `/api/order-status` and shows Order Confirmed after the admin changes the order to Confirmed/Shipped/Delivered.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit it to GitHub.
