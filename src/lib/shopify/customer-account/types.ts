export type CustomerAccountMoney = {
  amount: string;
  currencyCode: string;
};

export type CustomerAccountOrderLineItem = {
  title: string;
  quantity: number;
  image: {
    url: string;
    altText: string | null;
  } | null;
};

export type CustomerAccountOrder = {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: CustomerAccountMoney;
  lineItems: {
    edges: { node: CustomerAccountOrderLineItem }[];
  };
};

export type CustomerAccountProfile = {
  displayName: string;
  emailAddress: {
    emailAddress: string;
  } | null;
  orders: {
    edges: { node: CustomerAccountOrder }[];
  };
};

export type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  idToken?: string;
};

export type OpenIdConfiguration = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
};

export type CustomerAccountApiConfiguration = {
  graphql_api: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
};
