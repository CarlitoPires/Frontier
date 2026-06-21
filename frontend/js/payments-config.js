/* ============================================================
 *  LinguoBound — Payments configuration (Mercado Pago)
 *
 *  SAFE TO COMMIT: this file holds only PUBLIC identifiers and the
 *  hosted-checkout links you generate in your Mercado Pago dashboard.
 *  The Mercado Pago **Access Token** is a SECRET and must live ONLY on
 *  the server (see functions/mercadopago-webhook.js). Never put it here.
 *
 *  WHY hosted checkout links (Checkout Pro / Assinaturas)?
 *  The project runs on Firebase Spark (no backend at runtime). Creating
 *  card payments requires the secret access token, which cannot be
 *  exposed in the browser. So the in-app checkout collects the order,
 *  then hands off to Mercado Pago's PCI-compliant hosted page (which
 *  supports BOTH PIX and credit card). The tier is granted only by the
 *  server webhook after Mercado Pago confirms payment.
 *
 *  HOW TO WIRE (one-time, in the Mercado Pago dashboard):
 *   1. Create a subscription plan (Assinaturas) OR a payment link for
 *      each PLAN + BILLING below, and paste its checkout URL into
 *      `checkoutUrl`.
 *   2. In each link's settings, set the back/return URL to:
 *         https://<your-site>/pricing.html   (RETURN_PATH below)
 *      Mercado Pago appends ?status=approved|pending|failure &
 *      external_reference=<orderId> on return.
 *   3. Paste your PUBLIC key into MP_PUBLIC_KEY (used only if you later
 *      upgrade to embedded Bricks; not required for hosted checkout).
 * ============================================================ */

export const PAYMENTS_CONFIG = {
  provider: "mercadopago",
  currency: "BRL",
  locale: "pt-BR",

  // Public, publishable key (NOT the secret access token). Optional for
  // hosted checkout. Replace with your real APP_USR-/TEST- public key.
  MP_PUBLIC_KEY: "APP_USR-PUBLIC-KEY-REPLACE-ME",

  // Where Mercado Pago returns the buyer after payment.
  RETURN_PATH: "pricing.html",

  // True once you've pasted real checkout links below.
  isConfigured() {
    return Object.values(this.plans).some(
      (p) => p.checkoutUrl && p.checkoutUrl.indexOf("REPLACE") === -1
    );
  },
};

/* --------------------------------------------------------------
 * PLAN CATALOG (value-based pricing — see strategy memo).
 * `tier` is what the webhook writes to users/{uid}.plan.
 * `priceCents` is for display + analytics only; the real charge is
 * defined by the Mercado Pago link/plan you create.
 * -------------------------------------------------------------- */
export const PLANS = {
  resident_monthly: {
    id: "resident_monthly",
    tier: "pro",
    nameKey: "lp.planResName",
    taglineKey: "lp.planResTagline",
    billing: "monthly",
    priceCents: 4990,            // R$ 49,90 / month
    displayPrice: "R$ 49,90",
    perKey: "lp.perMonth",
    features: ["lp.featAllModules", "lp.featVisa", "lp.featRadar", "lp.featCert"],
    checkoutUrl: "https://www.mercadopago.com.br/REPLACE-resident-monthly",
  },
  citizen_annual: {
    id: "citizen_annual",
    tier: "pro",
    nameKey: "lp.planCitName",
    taglineKey: "lp.planCitTagline",
    billing: "annual",
    recommended: true,
    priceCents: 39700,           // R$ 397/yr  (≈ R$ 33,08/mo — 34% off)
    displayPrice: "R$ 397",
    perKey: "lp.perYear",
    equivPerMonth: "R$ 33,08",
    features: ["lp.featAllModules", "lp.featVisa", "lp.featRadar", "lp.featCert", "lp.featPriority"],
    checkoutUrl: "https://www.mercadopago.com.br/REPLACE-citizen-annual",
  },
  global_annual: {
    id: "global_annual",
    tier: "pro_global",
    nameKey: "lp.planGloName",
    taglineKey: "lp.planGloTagline",
    billing: "annual",
    priceCents: 59700,           // R$ 597/yr  (≈ R$ 49,75/mo)
    displayPrice: "R$ 597",
    perKey: "lp.perYear",
    equivPerMonth: "R$ 49,75",
    features: ["lp.featTwoCities", "lp.featVisa", "lp.featRadar", "lp.featCert", "lp.featPriority", "lp.featConcierge"],
    checkoutUrl: "https://www.mercadopago.com.br/REPLACE-global-annual",
  },
};

// Default plan highlighted on load.
export const DEFAULT_PLAN_ID = "citizen_annual";
