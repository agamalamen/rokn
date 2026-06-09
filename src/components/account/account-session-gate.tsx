"use client";

import { useEffect } from "react";
import { AccountProfile } from "@/components/account/account-profile";
import { AccountSignIn } from "@/components/account/account-sign-in";
import type { CustomerAccountProfile } from "@/lib/shopify/customer-account/types";

type AccountSessionGateProps = {
  customer: CustomerAccountProfile | null;
  needsRefresh: boolean;
  error?: string | null;
};

export function AccountSessionGate({
  customer,
  needsRefresh,
  error,
}: AccountSessionGateProps) {
  useEffect(() => {
    if (needsRefresh) {
      window.location.replace("/api/customer-auth/refresh");
    }
  }, [needsRefresh]);

  if (needsRefresh) {
    return (
      <div className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center sm:mx-6 lg:mx-8">
        <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
        <p className="mt-2 text-sm text-muted">Signing you in...</p>
      </div>
    );
  }

  if (customer) {
    return <AccountProfile customer={customer} />;
  }

  return <AccountSignIn error={error} />;
}
