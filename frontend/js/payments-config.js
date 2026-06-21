/* ============================================================
 *  LinguoBound — Payments configuration (Asaas)
 *
 *  Strategic pivot: Asaas is our billing engine — a Brazilian platform
 *  specialised in recurring SaaS subscriptions (PIX, card, boleto) with
 *  strong institutional trust.
 *
 *  SAFE TO COMMIT: this file holds only PUBLIC config — the URL of your
 *  serverless endpoints and the display catalog. The Asaas **API key**
 *  is a SECRET and lives ONLY on the server (functions/asaas-*.js).
 *  Never put the API key in the browser.
 *
 *  WHY a server endpoint? Creating an Asaas customer + subscription
 *  requires the secret API key, which cannot reach the browser. So the
 *  in-app checkout collects the order and calls our `asaas-create-
 *  subscription` endpoint, which creates the subscription and returns
 *  the hosted `invoiceUrl` (Asaas's PCI-compliant payment page,
 *  supporting PIX + card + boleto). The 'pro' tier is granted only by
 *  the Asaas webhook after payment is confirmed/received.
 * ============================================================ */

export const PAYMENTS_CONFIG = {
  provider: "asaas",
  currency: "BRL",
  locale: "pt-BR",

  // Base URL of your deployed serverless functions (Cloud Run / Render /
  // Cloud Functions). Endpoints expected under this base:
  //   POST {FUNCTIONS_BASE}/asaas-create-subscription
  //   POST {FUNCTIONS_BASE}/asaas-webhook   (configured in Asaas dashboard)
  FUNCTIONS_BASE: "https://REPLACE-with-your-functions-host",

  // Where Asaas returns the buyer after payment (callback.successUrl).
  RETURN_PATH: "pricing.html",

  isConfigured() {
    return this.FUNCTIONS_BASE && this.FUNCTIONS_BASE.indexOf("REPLACE") === -1;
  },
};

/* --------------------------------------------------------------
 * PLAN CATALOG (value-based pricing — see strategy memo).
 *  - `tier`      : what the webhook writes to users/{uid}.plan
 *  - `cycle`     : Asaas subscription cycle (MONTHLY | YEARLY)
 *  - `valueReais`: the charge amount sent to Asaas (BRL)
 *  - display fields are for the UI only
 * -------------------------------------------------------------- */
export const PLANS = {
  resident_monthly: {
    id: "resident_monthly",
    tier: "pro",
    nameKey: "lp.planResName",
    taglineKey: "lp.planResTagline",
    billing: "monthly",
    cycle: "MONTHLY",
    valueReais: 49.90,
    priceCents: 4990,
    displayPrice: "R$ 49,90",
    perKey: "lp.perMonth",
    features: ["lp.featAllModules", "lp.featVisa", "lp.featRadar", "lp.featCert"],
  },
  citizen_annual: {
    id: "citizen_annual",
    tier: "pro",
    nameKey: "lp.planCitName",
    taglineKey: "lp.planCitTagline",
    billing: "annual",
    cycle: "YEARLY",
    recommended: true,
    valueReais: 397.00,
    priceCents: 39700,
    displayPrice: "R$ 397",
    perKey: "lp.perYear",
    equivPerMonth: "R$ 33,08",
    features: ["lp.featAllModules", "lp.featVisa", "lp.featRadar", "lp.featCert", "lp.featPriority"],
  },
  global_annual: {
    id: "global_annual",
    tier: "pro_global",
    nameKey: "lp.planGloName",
    taglineKey: "lp.planGloTagline",
    billing: "annual",
    cycle: "YEARLY",
    valueReais: 597.00,
    priceCents: 59700,
    displayPrice: "R$ 597",
    perKey: "lp.perYear",
    equivPerMonth: "R$ 49,75",
    features: ["lp.featTwoCities", "lp.featVisa", "lp.featRadar", "lp.featCert", "lp.featPriority", "lp.featConcierge"],
  },
};

// Map our UI method selector -> Asaas billingType.
export const BILLING_TYPES = { pix: "PIX", card: "CREDIT_CARD" };

export const DEFAULT_PLAN_ID = "citizen_annual";
