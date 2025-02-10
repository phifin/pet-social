// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// @ts-ignore
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Hardcode API key & secret để test (cần thay bằng giá trị thật)
const apiKey = "6sbx56gjdm56";
const apiSecret = "x6vc3gg2mry8d4mq4pr6gzwsz2hnz5mrx4wxxe3g6ewym6vgy5at83krrynagejc";

// ✅ Hàm tạo CryptoKey từ API secret
async function createCryptoKey(secret: string) {
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const { user_id } = JSON.parse(body);

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Chuyển secret thành CryptoKey
    const secretKey = await createCryptoKey(apiSecret);

    // ✅ Tạo token bằng JWT
    const payload = {
      user_id,
      iat: getNumericDate(0),  // Thời gian phát hành (Issued At)
      exp: getNumericDate(60 * 60 * 24),  // Hết hạn sau 1 ngày
    };

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, secretKey);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Lỗi xảy ra:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
