/**
 * Hosted page URL builder.
 *
 * These pages are served by the generated app's backend, which forwards
 * requests to Vector's hosted pages with automatic authentication.
 * No tokens or env vars needed — just simple relative paths.
 *
 * Page structure:
 * - Pricing page: For new subscriptions (shows price + "Get started" button)
 * - Billing page: For managing existing subscriptions (shows details + cancel)
 *   - Usage-based apps: shows usage/credits tabs
 *   - Subscription apps: shows subscription management
 *   - Automatically redirects to pricing if no subscription exists
 */

type BillingTab = "usage" | "credits";

/**
 * Pricing page — public, no auth needed
 *
 * Use this for:
 * - New subscription sign-ups
 * - 402 subscription_required redirects
 */
export function getPricingPageUrl(): string {
  return "/api/hosted/pricing/";
}

/**
 * Billing page — requires authenticated user (auth handled by backend proxy)
 *
 * Use this for:
 * - Managing existing subscriptions (cancel, view details)
 * - Usage-based billing (view usage, manage credits)
 *
 * For subscription apps: automatically redirects to pricing if no subscription
 * For usage-based apps: pass tab to select usage or credits view
 */
export function getBillingPageUrl(tab: BillingTab = "usage"): string {
  return `/api/hosted/billing/?tab=${tab}`;
}

export function getUsagePageUrl(): string {
  return getBillingPageUrl("usage");
}

export function getCreditsPageUrl(): string {
  return getBillingPageUrl("credits");
}
