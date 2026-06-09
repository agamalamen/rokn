import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountProfile } from "@/components/account/account-profile";
import { AccountSignIn } from "@/components/account/account-sign-in";
import {
  getCustomerAccountProfile,
  isCustomerAccountConfigured,
  readCustomerSession,
} from "@/lib/shopify/customer-account";

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
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const session = await readCustomerSession();

  if (session && session.expiresAt <= Date.now()) {
    redirect("/api/customer-auth/refresh");
  }

  const customer = await getCustomerAccountProfile();

  return (
    <div className="py-6">
      {customer ? (
        <AccountProfile customer={customer} />
      ) : (
        <AccountSignIn error={error ?? null} />
      )}
    </div>
  );
}
