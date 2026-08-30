# Parametric Insurance Trigger for Drought Conditions in VYC Contract

Closes #<ISSUE_NUMBER>

## Description

Implemented the first on-chain parametric insurance trigger in the `agritrust_vyc` Soroban contract. When an authorized admin reports a season-level weather condition (e.g. drought), VYCs in the matching region automatically become eligible for a deterministic partial payout. This is the differentiator that makes AgriTrust more than a scoring app.

**Payout formula:** `expected_yield * severity / 100`

## What Changed

### Smart Contract (7 new functions, 3 new types, 2 new errors)

| Function | Auth | Description |
|---|---|---|
| `report_condition(condition, region, season, severity)` | Admin only | Report weather event, returns condition_id |
| `deactivate_condition(condition_id)` | Admin only | Deactivate a condition |
| `get_condition(condition_id)` | Public | Read condition by id |
| `get_region_conditions(region)` | Public | List condition ids for a region |
| `check_insurance_eligibility(vyc_id)` | Public | Deterministic payout eligibility check |
| `trigger_insurance_payout(vyc_id, condition_id)` | Admin only | Trigger payout, emit event |
| `get_vyc_payout(vyc_id)` | Public | Query stored payout |

**New types:** `ConditionType` (Drought/Flood/Heatwave/Frost), `SeasonCondition`, `InsurancePayout`
**New errors:** `InsuranceError` (7 variants: NotInitialized, Unauthorized, VycNotActive, NoActiveCondition, SeverityTooLow, AlreadyTriggered, ConditionNotFound)
**Events:** `condition_reported`, `insurance_triggered`

### Tests (10 new, 25 total — all passing)

- `test_report_condition` — admin reports drought, record stored correctly
- `test_report_condition_unauthorized` — non-admin rejected with `InsuranceError::Unauthorized`
- `test_trigger_payout_drought_season` — full flow: mint VYC, report drought, trigger payout (100 USDC * 60% = 60 USDC)
- `test_trigger_payout_no_condition` — trigger with non-existent condition rejected
- `test_trigger_payout_wrong_region` — region mismatch rejected
- `test_trigger_payout_inactive_vyc` — VYC already Redeemed rejected
- `test_deactivate_condition` — deactivation prevents future triggers
- `test_get_condition_query` — region condition queries work correctly
- `test_normal_season_no_payout` — no conditions reported returns None
- `test_severity_affects_payout` — higher severity conditions produce higher payouts

### Deployment (Makefile)

Added reproducible deploy targets:
- `make deploy-testnet` — build WASM + deploy to Stellar testnet
- `make init-contract` — initialize contract with admin
- `make verify-testnet` — verify contract responds (get_admin, get_vyc_count)

### Backend Integration

- Added `ConditionType`, `SeasonCondition`, `InsurancePayout` TypeScript types
- Added 7 contract service methods: `reportCondition`, `deactivateCondition`, `getCondition`, `getRegionConditions`, `checkInsuranceEligibility`, `triggerInsurancePayout`, `getVycPayout`

### Frontend Integration

- Added `checkInsuranceEligibility` and `getVycPayout` query functions to `soroban.ts`
- Added `InsurancePayout` and `InsuranceQueryResult` TypeScript interfaces

### Documentation

- Added Section 9 to `docs/FRONTEND_GUIDE.md`: Parametric Insurance with contract function table, payout formula, and frontend code examples

## Build Verification

```
# Smart contract
cd smartcontract && cargo test --all          # 25/25 pass
cd smartcontract && cargo fmt --check         # clean
cd smartcontract && cargo clippy -- -D warnings -A unexpected_cfgs  # clean
cd smartcontract && cargo build --target wasm32-unknown-unknown --release  # success

# Backend
cd backend && npm run build                   # tsc exits 0

# Frontend
cd frontend && npm install --legacy-peer-deps && npm run build  # webpack compilation succeeds
```

**Note:** Frontend TypeScript check has a pre-existing error in `lucide-react` type definitions (unrelated to this PR).

## Acceptance Criteria

- [x] Contract function to report a season-level condition (drought) that triggers the insurance path
- [x] Only authorized roles can report the condition (require_auth)
- [x] Payout eligibility is computed deterministically from the condition + certificate data
- [x] Event emitted on trigger for off-chain tracking
- [x] Unit tests: normal season (no payout), drought season (payout eligible), unauthorized reporter rejected
- [x] Reproducible deploy Makefile target
- [x] Backend types and contract service methods for insurance operations
- [x] Frontend service functions for querying insurance eligibility and payouts
- [x] Documentation updated with insurance trigger usage

## Deployment (Pending — requires testnet keypair)

After merging, deploy with:
```bash
cd smartcontract
make build
make deploy-testnet ADMIN_SECRET=<YOUR_TESTNET_SECRET>
make init-contract CONTRACT_ID=<DEPLOYED_ID> ADMIN_ADDRESS=<YOUR_PUBLIC_KEY> ADMIN_SECRET=<YOUR_TESTNET_SECRET>
make verify-testnet CONTRACT_ID=<DEPLOYED_ID> ADMIN_SECRET=<YOUR_TESTNET_SECRET>
```

Then update `TESTNET_CONTRACT_ID` in `backend/.env.example` and `NEXT_PUBLIC_VYC_CONTRACT_ID` in `frontend/.env.local.example`.
