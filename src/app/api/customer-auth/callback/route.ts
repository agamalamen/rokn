import { NextResponse } from "next/server";
import {
  completeCustomerLogin,
  getAppOrigin,
  isCustomerAccountConfigured,
} from "@/lib/shopify/customer-account";

export async function GET(request: Request) {
  const origin = await getAppOrigin();
  const accountUrl = new URL("/account", origin);

  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(accountUrl);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    accountUrl.searchParams.set("error", error);
    return NextResponse.redirect(accountUrl);
  }

  if (!code || !state) {
    accountUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(accountUrl);
  }

  try {
    await completeCustomerLogin(code, state);
    return NextResponse.redirect(accountUrl);
  } catch {
    accountUrl.searchParams.set("error", "login_failed");
    return NextResponse.redirect(accountUrl);
  }
}
