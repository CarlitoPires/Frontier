# Mercado Pago — Setup & Go-Live Guide (LinguoBound "Pro" upgrade)

This wires the LinguoBound checkout (`pricing.html`) to Mercado Pago and the
`users/{uid}.plan = "pro"` tier in Firestore.

## The security model (why it's built this way)

Firestore Security Rules **forbid** any client from changing its own
`plan` or `subscription` (see `firestore.rules` → `match /users/{uid}`).
That is deliberate: a browser must never be able to promote itself to Pro.

So the upgrade is a three-actor flow:

1. **Browser (`checkout.js`)** — records a purchase *intent* in
   `orders/{orderId}` (status `initiated`) and redirects to Mercado Pago's
   hosted checkout (PIX + credit card). This grants **no** access.
2. **Mercado Pago** — collects payment securely (PCI-compliant, hosted) and
   sends a webhook notification to your server.
3. **Webhook (`functions/mercadopago-webhook.js`)** — verifies the payment
   with the **secret access token**, then uses the Firebase **Admin SDK**
   (which bypasses rules) to set `users/{uid}.plan` and mark the order paid.
   This is the *only* component that grants Pro.

On return to `pricing.html`, the browser simply polls `users/{uid}` until the
webhook has flipped the tier, then shows the success state.

> Without the webhook deployed, payments still process, but the tier will not
> upgrade automatically. The webhook is required for production.

## 1. Dashboard configuration (one-time)

1. Create a Mercado Pago application → get your **Public Key** and
   **Access Token** (use TEST credentials first).
2. Create a **subscription plan** (Assinaturas) *or* a **payment link** for
   each plan in `frontend/js/payments-config.js`:
   - Resident (monthly) · Citizen (annual) · Global Citizen (annual)
3. Set each link's **back/return URL** to your deployed
   `https://<your-site>/pricing.html`.
4. Paste each hosted checkout URL into `payments-config.js → PLANS[*].checkoutUrl`
   and your public key into `MP_PUBLIC_KEY`.

## 2. Deploy the webhook

Pick one (the project is on Firebase Spark, which has **no** runtime backend —
so you need either Blaze or any external Node host):

### Option A — Firebase Cloud Functions (requires Blaze)
```bash
cd functions
npm init -y && npm i firebase-admin firebase-functions
# uncomment the functions export at the bottom of mercadopago-webhook.js
firebase deploy --only functions:mercadopago
```

### Option B — Any Node host (Cloud Run / Render / Railway / VPS)
```js
const express = require("express");
const { handler } = require("./mercadopago-webhook");
const app = express();
app.use(express.json());
app.post("/webhooks/mercadopago", handler);
app.listen(process.env.PORT || 8080);
```

Set environment variables on the host (never commit them):

| Variable | Purpose |
|---|---|
| `MP_ACCESS_TOKEN` | Mercado Pago **secret** access token (`APP_USR-…`) |
| `MP_WEBHOOK_SECRET` | (optional) to verify the `x-signature` header |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service-account JSON for the Admin SDK |

## 3. Point Mercado Pago at the webhook

In the Mercado Pago application → **Webhooks/IPN**, set the notification URL to
your deployed endpoint and subscribe to **payment** events.

## 4. Deploy the Firestore rules

```bash
firebase deploy --only firestore:rules
```

## 5. Test (sandbox)

1. Use TEST credentials and a [test card / test user](https://www.mercadopago.com.br/developers).
2. Buy a plan from `pricing.html` → complete payment → confirm:
   - `orders/{orderId}.status` becomes `paid`
   - `users/{uid}.plan` becomes `pro` (or `pro_global`)
   - the success state appears on return.

## Compliance checklist (BR)

- **CDC Art. 49** — 7-day right of regret: honour refunds within 7 days
  (surfaced in the guarantee + FAQ).
- **LGPD (Law 13.709/2018)** — publish a Privacy Policy and honour access /
  deletion requests; collect only what's needed.
- **Transparent pricing** — show currency (BRL), taxes-included, recurring
  renewal and cancellation terms (in the footer + checkout recurring notice).
- Replace the placeholder **CNPJ** and contact email in `i18n.js`
  (`lp.footCompany`, `lp.footContact`) with the real entity details.
