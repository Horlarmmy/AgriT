# AgriTrust — Onboarding & Identity Decision

> Status: **Proposed / Draft** — captured for the team before implementation.
> Scope: how farmers, lenders, and operators onboard onto AgriTrust, and where data lives.

---

## 1. The Core Problem

Farmers don't know Web3. If AgriTrust makes them install Freighter, manage a seed phrase, and fund
gas fees, the product is dead on arrival. So **"connect wallet" cannot be the farmer's entry point.**

---

## 2. Recommendation: Two Separate Onboarding Paths

### Path A — Farmers & cooperative field agents → custodial "smart wallet"

Google/phone sign-in, no Web3 knowledge required.

Flow:

1. Farmer taps **"Sign up with Google"** (or phone number / USSD).
2. Backend stores their identity (name, region, crop, etc.) — **not on-chain**, in the DB.
3. On successful registration, the backend **generates a Stellar keypair for them** (custodial),
   funded/sponsored so they never see a seed phrase or pay gas.
4. The wallet address is linked to their profile. Their activity events and VYCs flow through that
   wallet without them ever touching a "wallet" UI.

This is the Web2-style UX farmers need. Web3 happens under the hood.

### Path B — Lenders, insurers & investors → real wallet (Freighter) + KYC

These are the sophisticated parties with the money. They **connect a self-custody wallet** and **do
KYC**. That's normal and expected on the capital side.

---

## 3. Do We Need KYC At All?

**Not for farmers — at least not now.**

- KYC is heavy, expensive, and drop-off-creating — and smallholder farmers are *hardest* to KYC
  (no formal IDs, no utility bills). Requiring KYC contradicts the pitch ("borrow against behavior
  instead of paperwork").
- **But** lenders/insurers absolutely need KYC/AML — they're moving regulated capital. Compliance
  belongs on them, not the farmer.

> **Rule:** farmers = frictionless sign-up, no KYC. Lenders/investors = KYC + self-custody.
> (The M-Pesa pattern: M-Pesa users vs. the banks behind them.)

---

## 4. On-Chain vs Off-Chain (strict rule)

| Layer | What lives here |
|---|---|
| **On-chain** | VYC, `activity_hash`, scores, status, events — the tamper-evident proof (the whole value prop) |
| **Off-chain (DB)** | name, phone, Google account, national ID (if ever), geolocation, photos — **never put PII on-chain** |

The link: **wallet address (on-chain) ↔ farmer profile (off-chain)**, held in the backend.

---

## 5. Bottom Line

- ✅ Smart/custodial wallets for farmers (Google/phone → auto-created keypair, no seed phrase, gas sponsored).
- ❌ No KYC for farmers now — save it for the lender/investor side.
- ✅ Keep PII off-chain, VYC + hash on-chain.
- ✅ Offer **both** sign-in methods — but for different audiences: register = farmers, connect wallet = lenders/devs.

### ⚠️ Risk to Think Through

Custodial wallets mean **we hold farmers' keys** — a security and trust responsibility (and eventually
regulatory in some jurisdictions). Fine for testnet/demo, but before real mainnet money, look at
non-custodial **embedded wallets** (account abstraction / smart-contract wallets on Soroban, or a
key-custody service with proper security) so we're not manually managing private keys.

---

## 6. Proposed Sign-Up / Login / Register Flow + Data Model

### 6.1 Farmer sign-up (custodial smart wallet)

```
1. Farmer opens app → "Sign up with Google" (OAuth) or "Continue with phone" (OTP)
2. Backend:
   a. Verifies the OAuth/OTP identity
   b. Looks up existing profile by provider + subject id
   c. If new: generates a Stellar keypair (ed25519)
   d. Stores (encrypted) key material in the DB, keyed by farmer id
   e. Funds the new account on testnet (friendbot / sponsorship)
3. Farmer lands on a simple dashboard — never sees a seed phrase or gas fees
```

### 6.2 Lender/investor onboarding (self-custody + KYC)

```
1. Connect Freighter wallet
2. Submit KYC (via provider) — status: pending → approved/rejected
3. Once approved, can fund VYCs / underwrite / provide liquidity
```

### 6.3 Data model (proposed)

**`farmers` (off-chain DB)**
| field | type | notes |
|---|---|---|
| id | uuid | internal |
| provider | enum | `google` \| `phone` \| `ussd` |
| provider_subject | string | OAuth `sub` / phone hash |
| name | string | PII — off-chain only |
| region | string | ISO 3166-2 |
| crop | string | primary crop |
| wallet_address | string | generated Stellar G… address (on-chain link) |
| wallet_encrypted_seed | blob | encrypted; never plaintext |
| created_at | timestamp | |

**`lenders` (off-chain DB)**
| field | type | notes |
|---|---|---|
| id | uuid | internal |
| wallet_address | string | self-custody |
| kyc_status | enum | `pending` \| `approved` \| `rejected` |
| created_at | timestamp | |

**On-chain (Soroban) — already exists via VYC contract**
- `VycRecord` (farmer address, score, expected_yield, activity_hash, status)
- The farmer `wallet_address` above is what the VYC references.

### 6.4 Open questions (decide before build)

- [ ] Custodial vs non-custodial embedded wallet — pick a provider (Soroban AA / third-party custody)
- [ ] Key encryption at rest (which KMS / envelope encryption)
- [ ] Gas sponsorship mechanism (friendbot on testnet, sponsored ops on mainnet)
- [ ] KYC provider for lenders (which vendor)
- [ ] Phone/USSD vs Google-first — which is the primary farmer channel
