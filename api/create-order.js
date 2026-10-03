export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check server environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables", {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY
      });

      return res.status(500).json({
        success: false,
        error:
          "Server configuration missing. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
      });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const {
      customer_name,
      phone,
      address,
      product_name,
      quantity,
      total_amount,
      advance_amount,
      cod_amount,
      payment_method
    } = body;

    // Validate required fields
    if (
      !customer_name ||
      !phone ||
      !address ||
      !product_name ||
      quantity === undefined ||
      total_amount === undefined ||
      advance_amount === undefined ||
      cod_amount === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Please fill all delivery details."
      });
    }

    const order = {
      customer_name: String(customer_name).trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      product_name: String(product_name).trim(),
      quantity: Number(quantity),
      total_amount: Number(total_amount),
      advance_amount: Number(advance_amount),
      cod_amount: Number(cod_amount),
      payment_method: payment_method || "UPI",
      payment_status: "Pending",
      order_status: "Pending"
    };

    // Validate numbers
    if (
      !Number.isFinite(order.quantity) ||
      !Number.isFinite(order.total_amount) ||
      !Number.isFinite(order.advance_amount) ||
      !Number.isFinite(order.cod_amount)
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid order amount or quantity."
      });
    }

    const supabaseUrl = SUPABASE_URL.replace(/\/$/, "");

    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(order)
      }
    );

    const responseText = await response.text();

    let data = null;

    try {
      data = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      data = {
        raw: responseText
      };
    }

    if (!response.ok) {
      console.error("Supabase order error:", data);

      return res.status(response.status || 500).json({
        success: false,
        error:
          data?.message ||
          data?.error_description ||
          data?.hint ||
          data?.raw ||
          "Unable to create order."
      });
    }

    const createdOrder =
      Array.isArray(data) ? data[0] : data;

    return res.status(200).json({
      success: true,
      message: "Order created successfully.",
      order: createdOrder
    });

  } catch (error) {
    console.error("Create order server error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Server error while creating order."
    });
  }
}
