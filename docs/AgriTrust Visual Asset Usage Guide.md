# AgriTrust Visual Asset Usage Guide

## Brand direction

Use the AgriTrust assets with primary green `#3A8C3F`, accent lime `#84E03D`, cream-white surfaces, and green-tinted neutral shadows. Reserve `#DC2626` for destructive or failed states only. The PNG assets are intended to be composited over both light and dark themes; do not place them inside an additional baked-in background.

## Approved asset groups

### Hero slideshow

Use `hero_protocol_primary.png` as the strongest general-purpose opening frame. Use `hero_vyc_certificate.png` for the certificate-focused story and `hero_liquidity_bridge.png` for the “soil to stablecoin” or liquidity narrative. A three-slide hero can rotate between these images with a soft crossfade or horizontal transition. Keep the copy in HTML outside the image so it remains responsive and accessible.

### Authentication visuals

Use `auth_login_verified_seedling.png` beside the login form, `auth_register_identity.png` beside registration and onboarding, and `auth_secure_certificate.png` for shared login, OTP, wallet-connection, or verification states. On mobile, place the image above the form at reduced size or hide it if it compromises form completion.

### Abstract patterns

Use `pattern_organic_growth.png` behind onboarding and empty states, `pattern_connected_field_grid.png` behind protocol or liquidity pages, `pattern_certificate_particles.png` behind certificate creation and verification views, and `pattern_bridge_network.png` behind soil-to-stablecoin marketing sections. Apply low opacity, typically between 0.08 and 0.20, and never let the pattern reduce text contrast.

### Feature illustrations

Use `feature_vyc_certificate.png` for the VYC section, `feature_instant_settlement.png` for fast payout and Stellar settlement, `feature_parametric_insurance.png` for climate-triggered protection, `feature_credit_scoring.png` for behavioral credit scoring, `feature_stellar_liquidity.png` for investor and liquidity-pool explanations, and `feature_universal_access.png` for farmer mobile, cooperative, and USSD access.

### Reusable UI and modal icons

Use `icon_planting_seed.png` for planting or input activity, `icon_harvest_crate.png` for harvest completion, `icon_verified_certificate.png` for verified VYC status, `icon_insurance_shield.png` for active insurance coverage, `icon_liquidity_pool.png` for matched liquidity, `icon_wallet_stablecoin.png` for wallet and settlement balances, `icon_transaction_transfer.png` for transfer previews, `icon_success_verified.png` for successful completion, `icon_failure_alert.png` for failed or blocked actions, and `icon_weather_alert.png` for weather-triggered notifications or risk warnings.

## Frontend implementation guidance

Keep the large feature illustrations between approximately 180px and 420px wide depending on the section. Use reusable icons between 32px and 96px in dashboard cards and between 64px and 160px in modals or empty states. Apply `object-contain`, preserve the original aspect ratio, and avoid aggressive cropping. A gentle hover translation of 2–4px or a slow floating animation is sufficient; do not continuously animate transaction or failure icons because those states should feel trustworthy and clear.

For dark mode, place assets over deep green-tinted surfaces and reduce lime glow intensity if the foreground becomes visually loud. For light mode, use cream or white surfaces and preserve the green shadows. Do not rely on the transparency checkerboard visible in some previews; that checker pattern is a preview representation of alpha, not part of the intended design.

## Suggested motion behavior

The hero slideshow should crossfade over approximately 500–700ms and pause when the user focuses the hero region. Feature illustrations can enter with a small opacity and vertical translation as they become visible. Modal icons should use a short scale-and-opacity entrance. The success icon may use a single checkmark reveal, while failure and weather alerts should use a restrained pulse only when new information arrives.

## Accessibility and content rules

Do not use any image as the sole carrier of essential information. Keep feature titles, certificate values, status labels, and action text in real HTML. Add descriptive alt text for meaningful illustrations and empty alt text for purely decorative patterns. Ensure the danger icon is paired with a textual error message and never communicate failure through red color alone.

## Asset inventory

| Group | Files |
|---|---|
| Hero | `hero_protocol_primary.png`, `hero_vyc_certificate.png`, `hero_liquidity_bridge.png` |
| Authentication | `auth_login_verified_seedling.png`, `auth_register_identity.png`, `auth_secure_certificate.png` |
| Patterns | `pattern_organic_growth.png`, `pattern_connected_field_grid.png`, `pattern_certificate_particles.png`, `pattern_bridge_network.png` |
| Features | `feature_vyc_certificate.png`, `feature_instant_settlement.png`, `feature_parametric_insurance.png`, `feature_credit_scoring.png`, `feature_stellar_liquidity.png`, `feature_universal_access.png` |
| UI icons | `icon_planting_seed.png`, `icon_harvest_crate.png`, `icon_verified_certificate.png`, `icon_insurance_shield.png`, `icon_liquidity_pool.png`, `icon_wallet_stablecoin.png`, `icon_transaction_transfer.png`, `icon_success_verified.png`, `icon_failure_alert.png`, `icon_weather_alert.png` |

The attached `agrit-logo.png` remains the source of truth for the official brand mark. If a generated asset contains a small seal or embossed mark, the frontend should still use the source logo file for the primary navigation logo, favicon, header, and any place where exact brand fidelity is critical.

## Implementation note

The generated images are visual assets, not product logic. Certificate status, weather triggers, wallet balances, liquidity figures, and transaction outcomes must continue to come from the application state and backend data. Use the assets to explain or reinforce those states, not to create false data.


===============

# Recommended five-page sample set
Sample page

Purpose
1. Public Landing Page
Farmers, cooperatives, lenders, investors
Explain “soil to stablecoin,” the VYC trust loop, Stellar infrastructure, and the appropriate entry path.
2. Farmer Dashboard
Farmers and field agents
Show trust score, activity timeline, VYC status, insurance, financing eligibility, and the next action. It should feel simple, warm, and mobile-first.
3. Investor/Lender Dashboard
Lenders, insurers, liquidity providers
Show connected wallet, KYC status, available VYCs, expected yield, risk, funding opportunities, portfolio, liquidity, and settlement history. It should feel more analytical and capital-oriented.
4. Farmer Login/Register
Farmers
Use phone/Google/USSD-oriented onboarding. No seed phrase, gas, or Freighter-first language. The visual should be welcoming, low-friction, and confidence-building.
5. Admin/Operations Console
AgriTrust operators
Show review queues, farmer activity evidence, VYC registry, KYC states, insurance triggers, payout exceptions, audit logs, and system health. It should use the same brand but be denser and more operational.

## Why the two dashboards are necessary
A farmer wants to know: “What is my trust status, what activity have I recorded, and what can I do next?” The farmer dashboard should prioritize the score, activity, certificate, insurance, and financing eligibility. Wallet details should be secondary because the onboarding decision says the farmer should not need to understand Web3 infrastructure.
An investor or lender wants to know: “What opportunities can I fund, what risk am I taking, what is my expected return, and what is the settlement status?” Their dashboard needs VYC discovery, yield and risk comparison, KYC state, wallet connection, liquidity positions, funding actions, and transaction history. Combining both audiences would create a confusing dashboard with too many unrelated modules.
The admin console is not a third dashboard variant. It is an operations workspace with a more compact table-and-review interface. It should be visually consistent with AgriTrust but not use the same friendly bento composition as the farmer experience.

## How I would visually sample the five pages
The landing page would use the approved three-image hero slideshow, a clear hero headline, “Explore the Dashboard” as the primary CTA, and “Connect Wallet” as a secondary capital-provider path. The visual language would be minimalist editorial layout plus soft 3D agriculture-and-trust imagery.
The farmer dashboard would use a warm bento layout with the trust score as the main card, a vertical activity timeline, a VYC certificate card, an insurance status card, and one prominent “Log activity” or “View certificate” action. It would use the 3D assets sparingly so the data remains easy to understand.
The investor dashboard would use a more structured analytical layout: portfolio value, deployable liquidity, active VYCs, average expected yield, risk distribution, and a table of funding opportunities. It can use selective glass surfaces for certificate previews, but it should not look like a high-frequency crypto trading terminal.
The login/register page would show the approved authentication illustration beside a simple form. Farmer authentication should foreground “Continue with Google,” “Continue with phone,” or the relevant USSD/mobile path. A separate lender entry should say “I’m a lender or investor” and lead to Freighter connection plus KYC.
The admin console would use a persistent sidebar, compact tables, review drawers, status filters, evidence previews, and audit history. It should prioritize operational clarity over decorative 3D imagery.
Recommendation
I recommend generating these five samples in this order: landing page, farmer dashboard, investor/lender dashboard, farmer login/register, and admin console. This gives your frontend designer a complete visual reference for the public experience, both user roles, authentication, and internal operations.
If you approve this five-page set, I will generate the samples as a coherent design system rather than five unrelated screens.
okay proceed,...
