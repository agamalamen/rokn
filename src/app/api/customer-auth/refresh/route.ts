import { NextResponse } from "next/server";
import {
  clearCustomerSession,
  getAppOrigin,
  refreshCustomerSessionFromCookie,
} from "@/lib/shopify/customer-account";

export async function GET() {
  const origin = await getAppOrigin();
  const accountUrl = new URL("/account", origin);

  try {
    await refreshCustomerSessionFromCookie();
    return NextResponse.redirect(accountUrl);
  } catch {
    await clearCustomerSession();
    accountUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(accountUrl);
  }
}
