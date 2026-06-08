import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function verifyShopifyWebhook(
  body: string,
  hmacHeader: string | null,
  secret: string,
): boolean {
  if (!hmacHeader) {
    return false;
  }

  const digest = createHmac("sha256", secret).update(body, "utf8").digest("base64");
  const digestBuffer = Buffer.from(digest);
  const hmacBuffer = Buffer.from(hmacHeader);

  if (digestBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return timingSafeEqual(digestBuffer, hmacBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const topic = request.headers.get("x-shopify-topic");
  const body = await request.text();

  if (secret) {
    const hmac = request.headers.get("x-shopify-hmac-sha256");

    if (!verifyShopifyWebhook(body, hmac, secret)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  if (topic?.includes("products")) {
    revalidateTag("products", "max");
  }

  if (topic?.includes("collections")) {
    revalidateTag("collections", "max");
  }

  return NextResponse.json({ ok: true });
}
