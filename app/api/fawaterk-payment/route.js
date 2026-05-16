export async function POST(req) {
  const body = await req.json();

  const response = await fetch(
    "https://app.fawaterk.com/api/v2/createInvoiceLink",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAWATERK_API_KEY}`,
      },

      body: JSON.stringify({
        cartTotal: body.amount,

        currency: "EGP",

        customer: {
          first_name: "Test",
          last_name: "User",
          email: "test@test.com",
          phone: "01000000000",
        },

        redirectionUrls: {
          successUrl: "process.env.NEXT_PUBLIC_BASE_URL}/success",
          failUrl: "process.env.NEXT_PUBLIC_BASE_URL}/failed",
          pendingUrl: "process.env.NEXT_PUBLIC_BASE_URL}/pending",
        },

        cartItems: [
          {
            name: "Test Product",
            price: body.amount,
            quantity: 1,
          },
        ],
      }),
    },
  );

  const data = await response.json();

  return Response.json(data);
}
