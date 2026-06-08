import { SHOPIFY_STORE_DOMAIN, isShopifyConfigured } from "@/lib/constants";

export const SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "";
export const SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET ?? "";
export const SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI =
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI ?? "";

export const CUSTOMER_SESSION_COOKIE = "customerSession";
export const CUSTOMER_OAUTH_STATE_COOKIE = "customerOAuthState";
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function isCustomerAccountConfigured() {
  return Boolean(
    isShopifyConfigured() &&
      SHOPIFY_STORE_DOMAIN &&
      SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
  );
}

export function isConfidentialCustomerAccountClient() {
  return Boolean(SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET);
}

export function getCustomerAccountLoginPath() {
  return "/api/customer-auth/login";
}

export function getOAuthRedirectUri(requestOrigin: string) {
  if (SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI) {
    return SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI.replace(/\/$/, "");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = siteUrl || requestOrigin;
  return `${origin}/api/customer-auth/callback`;
}

export function isInsecureOAuthRedirectUri(uri: string) {
  try {
    const { protocol, hostname } = new URL(uri);
    if (protocol !== "https:") {
      return true;
    }

    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return true;
  }
}
