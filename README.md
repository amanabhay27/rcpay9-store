# RCPAY9 Store

## Run locally
1. Install Node.js LTS.
2. Open this folder in a terminal.
3. Run:
   npm install
   npm run dev
4. Open the localhost URL shown by Vite.

## Deploy to Vercel
Push the folder to GitHub, import the repository into Vercel, and use:
- Build command: `npm run build`
- Output directory: `dist`

## Current phase
This version includes the storefront, cart, checkout form, local order confirmation, and local order tracking.
The payment gateway and real server/database are intentionally NOT connected yet. They should be added after the UI/order flow is tested.
