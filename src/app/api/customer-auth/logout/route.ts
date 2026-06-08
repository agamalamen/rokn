import { NextResponse } from "next/server";
import {
  clearCustomerSession,
  getAppOrigin,
} from "@/lib/shopify/customer-account";

export async function POST() {
  await clearCustomerSession();
  return NextResponse.redirect(new URL("/account", await getAppOrigin()));
}
