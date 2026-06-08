import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { SHOPIFY_STORE_DOMAIN } from "@/lib/constants";
import {
  SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
  SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET,
  CUSTOMER_OAUTH_STATE_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  getOAuthRedirectUri,
  isCustomerAccountConfigured,
} from "@/lib/shopify/customer-account/config";
import { customerAccountProfileQuery } from "@/lib/shopify/customer-account/queries";
import type {
  CustomerAccountApiConfiguration,
  CustomerAccountProfile,
  CustomerSession,
  OpenIdConfiguration,
  TokenResponse,
} from "@/lib/shopify/customer-account/types";

export {
  getCustomerAccountLoginPath,
  getOAuthRedirectUri,
  isCustomerAccountConfigured,
  isInsecureOAuthRedirectUri,
} from "@/lib/shopify/customer-account/config";

type DiscoveryConfig = {
  openId: OpenIdConfiguration;
  customerAccountApi: CustomerAccountApiConfiguration;
};

let cachedDiscovery: Promise<DiscoveryConfig> | null = null;

function getShopDomain() {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not configured");
  }

  return SHOPIFY_STORE_DOMAIN;
}

async function fetchDiscoveryConfig(): Promise<DiscoveryConfig> {
  const shopDomain = getShopDomain();
  const [openIdResponse, customerAccountResponse] = await Promise.all([
    fetch(`https://${shopDomain}/.well-known/openid-configuration`, {
      next: { revalidate: 3600 },
    }),
    fetch(`https://${shopDomain}/.well-known/customer-account-api`, {
      next: { revalidate: 3600 },
    }),
  ]);

  if (!openIdResponse.ok || !customerAccountResponse.ok) {
    throw new Error("Failed to load Shopify customer account discovery config");
  }

  return {
    openId: (await openIdResponse.json()) as OpenIdConfiguration,
    customerAccountApi:
      (await customerAccountResponse.json()) as CustomerAccountApiConfiguration,
  };
}

async function getDiscoveryConfig() {
  if (!cachedDiscovery) {
    cachedDiscovery = fetchDiscoveryConfig();
  }

  return cachedDiscovery;
}

export async function getAppOrigin() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function createOAuthValue() {
  return randomBytes(32).toString("base64url");
}

function createCodeChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

export async function createCustomerLoginRedirect(origin: string) {
  const { openId } = await getDiscoveryConfig();
  const state = createOAuthValue();
  const nonce = createOAuthValue();
  const codeVerifier = createOAuthValue();
  const codeChallenge = createCodeChallenge(codeVerifier);
  const redirectUri = getOAuthRedirectUri(origin);
  const authorizationUrl = new URL(openId.authorization_endpoint);

  authorizationUrl.searchParams.set(
    "scope",
    "openid email customer-account-api:full",
  );
  authorizationUrl.searchParams.set(
    "client_id",
    SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
  );
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("nonce", nonce);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  const cookieStore = await cookies();
  cookieStore.set(
    CUSTOMER_OAUTH_STATE_COOKIE,
    JSON.stringify({ state, nonce, codeVerifier, redirectUri }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    },
  );

  return authorizationUrl.toString();
}

async function exchangeToken(body: URLSearchParams) {
  const { openId } = await getDiscoveryConfig();
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Rokn/1.0",
  };

  if (SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET) {
    const credentials = Buffer.from(
      `${SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID}:${SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET}`,
    ).toString("base64");
    requestHeaders.Authorization = `Basic ${credentials}`;
  }

  const response = await fetch(openId.token_endpoint, {
    method: "POST",
    headers: requestHeaders,
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Customer account token exchange failed: ${errorBody}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function completeCustomerLogin(code: string, state: string) {
  const cookieStore = await cookies();
  const oauthStateRaw = cookieStore.get(CUSTOMER_OAUTH_STATE_COOKIE)?.value;

  if (!oauthStateRaw) {
    throw new Error("Missing OAuth state");
  }

  const oauthState = JSON.parse(oauthStateRaw) as {
    state: string;
    nonce: string;
    codeVerifier: string;
    redirectUri: string;
  };

  if (oauthState.state !== state) {
    throw new Error("Invalid OAuth state");
  }

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID);
  body.set("redirect_uri", oauthState.redirectUri);
  body.set("code", code);
  body.set("code_verifier", oauthState.codeVerifier);

  const tokenResponse = await exchangeToken(body);
  await saveCustomerSession(tokenResponse);
  cookieStore.delete(CUSTOMER_OAUTH_STATE_COOKIE);
}

async function refreshCustomerSession(refreshToken: string) {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("client_id", SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID);
  body.set("refresh_token", refreshToken);

  const tokenResponse = await exchangeToken(body);
  await saveCustomerSession(tokenResponse);
  return tokenResponse.access_token;
}

async function saveCustomerSession(tokenResponse: TokenResponse) {
  const cookieStore = await cookies();
  const session: CustomerSession = {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    idToken: tokenResponse.id_token,
  };

  cookieStore.set(CUSTOMER_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CUSTOMER_SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  cookieStore.delete(CUSTOMER_OAUTH_STATE_COOKIE);
}

async function getValidAccessToken() {
  const cookieStore = await cookies();
  const sessionRaw = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

  if (!sessionRaw) {
    return null;
  }

  const session = JSON.parse(sessionRaw) as CustomerSession;
  const expiresSoon = session.expiresAt - Date.now() < 60_000;

  if (!expiresSoon) {
    return session.accessToken;
  }

  try {
    return await refreshCustomerSession(session.refreshToken);
  } catch {
    await clearCustomerSession();
    return null;
  }
}

export async function getCustomerAccountProfile() {
  if (!isCustomerAccountConfigured()) {
    return null;
  }

  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    return null;
  }

  const { customerAccountApi } = await getDiscoveryConfig();
  const response = await fetch(customerAccountApi.graphql_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      "User-Agent": "Rokn/1.0",
    },
    body: JSON.stringify({
      query: customerAccountProfileQuery,
    }),
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearCustomerSession();
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load customer account profile");
  }

  const json = (await response.json()) as {
    data?: { customer: CustomerAccountProfile | null };
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data?.customer ?? null;
}

export async function isCustomerLoggedIn() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
}
