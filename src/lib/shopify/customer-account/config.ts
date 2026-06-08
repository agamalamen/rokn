import { SHOPIFY_STORE_DOMAIN, isShopifyConfigured } from "@/lib/constants";
import { getSiteUrl, normalizeSiteOrigin } from "@/lib/site-url";

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

export function getOAuthRedirectUri(requestOrigin?: string) {
  if (SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI) {
    return normalizeSiteOrigin(SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI);
  }

  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    getSiteUrl(),
    requestOrigin,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const uri = `${normalizeSiteOrigin(candidate)}/api/customer-auth/callback`;
    if (!isInsecureOAuthRedirectUri(uri)) {
      return uri;
    }
  }

  return `${getSiteUrl()}/api/customer-auth/callback`;
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
