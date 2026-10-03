import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const id = String(req.query?.id || "").trim();
  if (!id) return res.status(400).json({ error: "Order ID is required." });

  const { data, error } = await supabase
    .from("orders")
    .select("id,customer_name,phone,product_name,quantity,total_amount,advance_amount,cod_amount,payment_method,payment_status,order_status,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ order: data || null });
}
