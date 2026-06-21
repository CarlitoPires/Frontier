# Asaas — Setup & Go-Live Guide (LinguoBound "Pro" subscriptions)

Asaas is our billing engine — a Brazilian platform specialised in recurring
SaaS subscriptions (PIX, credit card, boleto). This wires the LinguoBound
checkout (`pricing.html`) to Asaas and the `users/{uid}.plan = "pro"` tier.

## The security model (why it's built this way)

Firestore Security Rules **forbid** any client from changing its own `plan`
or `subscription` (see `firestore.rules` → `match /users/{uid}`). A browser
must never be able to promote itself to Pro. So the upgrade is a three-actor
flow:

1. **Browser (`checkout.js`)** — records a purchase *intent* in
   `orders/{orderId}` (status `initiated`) and calls our server endpoint.
2. **`asaas-create-subscription` (server)** — using the **secret API key**,
   creates the Asaas customer + subscription with `externalReference = orderId`
   and returns the first payment's hosted `invoiceUrl`. The browser redirects
   there (Asaas hosted page: PIX + card + boleto). *Grants no access.*
3. **`asaas-webhook` (server)** — Asaas notifies it on `PAYMENT_CONFIRMED` /
   `PAYMENT_RECEIVED`; using the Admin SDK it sets `users/{uid}.plan`. This is
   the **only** component that grants Pro. It also revokes on refund /
   subscription cancellation, and marks `past_due` on overdue.

On return, the browser watches `users/{uid}` in real time (`onSnapshot`) and
flips to the success state the instant the webhook grants the tier.

> Without the functions deployed, the checkout cannot create a subscription
> and the tier will not upgrade. Both endpoints are required for production.

## 1. Dashboard configuration (one-time)

1. Create an Asaas account → **Settings → API Keys** → copy your key
   (use the **sandbox** key first: keys and base URL differ).
2. **Settings → Webhooks → New webhook**:
   - URL: `https://<your-functions-host>/asaas-webhook`
   - Auth token: choose a strong secret → this is `ASAAS_WEBHOOK_TOKEN`
     (Asaas sends it in the `asaas-access-token` header on every call).
   - Subscribe to **Payment** and **Subscription** events.

## 2. Deploy the two functions

The project is on Firebase Spark (no runtime backend), so host the functions
on Blaze Cloud Functions **or** any Node host (Cloud Run / Render / Railway).

### Option A — Firebase Cloud Functions (Blaze)
```bash
cd functions
npm init -y && npm i firebase-admin firebase-functions
# uncomment the functions exports at the bottom of each file
firebase deploy --only functions:asaasCreateSubscription,functions:asaasWebhook
```

### Option B — Any Node host (Express)
```js
const express = require("express");
const app = express();
app.use(express.json());
app.post("/asaas-create-subscription", require("./asaas-create-subscription").handler);
app.post("/asaas-webhook", require("./asaas-webhook").handler);
app.listen(process.env.PORT || 8080);
```

Set environment variables on the host (never commit them):

| Variable | Purpose |
|---|---|
| `ASAAS_API_KEY` | Asaas **secret** API key (`$aact_…`) |
| `ASAAS_API_BASE` | `https://api.asaas.com/v3` (prod) or `https://api-sandbox.asaas.com/v3` |
| `ASAAS_WEBHOOK_TOKEN` | the token you set on the Asaas webhook |
| `GOOGLE_APPLICATION_CREDENTIALS` | service-account JSON for the Admin SDK |

## 3. Point the frontend at your functions

In `frontend/js/payments-config.js`, set `FUNCTIONS_BASE` to your deployed
host (the base under which `/asaas-create-subscription` is reachable).

## 4. Deploy the Firestore rules

```bash
firebase deploy --only firestore:rules
```

## 5. Test (sandbox)

1. Use the sandbox key + base URL and an Asaas sandbox payer.
2. Buy a plan from `pricing.html` → pay on the Asaas page → confirm:
   - `orders/{orderId}.status` → `awaiting_payment` → `paid`
   - `users/{uid}.plan` → `pro` (or `pro_global`), `subscription.status` → `active`
   - the success state appears and auto-redirects into the dashboard.
3. Test refund / cancel in Asaas → confirm the webhook revokes to `free`.

## Compliance checklist (BR)

- **CDC Art. 49** — 7-day right of regret: honour refunds within 7 days
  (surfaced in the guarantee + FAQ). A refund in Asaas fires
  `PAYMENT_REFUNDED`, which the webhook uses to revoke access.
- **LGPD (Law 13.709/2018)** — the CPF collected at checkout is used solely
  to issue the Asaas charge; publish a Privacy Policy and honour
  access/deletion requests; collect only what's needed.
- **Transparent pricing** — currency (BRL), taxes-included, recurring renewal
  and cancellation terms shown in the footer + checkout recurring notice.
- Replace the placeholder **CNPJ** and contact email in `i18n.js`
  (`lp.footCompany`, `lp.footContact`) with the real entity details.
