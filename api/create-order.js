import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const required = ["customer_name","phone","address","product_name","quantity","total_amount","advance_amount","cod_amount"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === "") {
        return res.status(400).json({ error: `Missing ${key}` });
      }
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: String(body.customer_name).trim(),
        phone: String(body.phone).trim(),
        address: String(body.address).trim(),
        product_name: String(body.product_name).trim(),
        quantity: Number(body.quantity),
        total_amount: Number(body.total_amount),
        advance_amount: Number(body.advance_amount),
        cod_amount: Number(body.cod_amount),
        payment_method: "UPI",
        payment_status: "Pending",
        order_status: "Pending"
      })
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ order: data });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
