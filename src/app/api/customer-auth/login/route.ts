import { NextResponse } from "next/server";
import {
  createCustomerLoginRedirect,
  getAppOrigin,
  getOAuthRedirectUri,
  isCustomerAccountConfigured,
  isInsecureOAuthRedirectUri,
} from "@/lib/shopify/customer-account";

export async function GET() {
  const origin = await getAppOrigin();

  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(new URL("/account", origin));
  }

  const redirectUri = getOAuthRedirectUri(origin);

  if (isInsecureOAuthRedirectUri(redirectUri)) {
    const accountUrl = new URL("/account", origin);
    accountUrl.searchParams.set("error", "auth_redirect");
    return NextResponse.redirect(accountUrl);
  }

  const authorizationUrl = await createCustomerLoginRedirect(origin);
  return NextResponse.redirect(authorizationUrl);
}
