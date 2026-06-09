import type { Metadata } from "next";
import Link from "next/link";
import { AccountSessionGate } from "@/components/account/account-session-gate";
import {
  getCustomerAccountProfile,
  isCustomerAccountConfigured,
  readCustomerSession,
} from "@/lib/shopify/customer-account";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
};

type AccountPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { error } = await searchParams;

  if (!isCustomerAccountConfigured()) {
    return (
      <div className="py-6">
        <div className="mx-4 rounded-2xl bg-surface px-6 py-16 text-center sm:mx-6 lg:mx-8">
          <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
          <p className="mt-2 text-sm text-muted">
            Add your Shopify Customer Account API client ID to enable sign in.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const session = await readCustomerSession();
  const needsRefresh = Boolean(session && session.expiresAt <= Date.now());
  const customer = needsRefresh ? null : await getCustomerAccountProfile();

  return (
    <div className="py-6">
      <AccountSessionGate
        customer={customer}
        needsRefresh={needsRefresh}
        error={error ?? null}
      />
    </div>
  );
}
