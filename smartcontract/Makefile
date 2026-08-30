build:
	cargo build --target wasm32-unknown-unknown --release

test:
	cargo test

fmt:
	cargo fmt

clean:
	cargo clean

# ── Deployment (Stellar Testnet) ──────────────────────────────────────────────
# Prerequisites:
#   1. Install Stellar CLI:  curl -sSL https://soroban.stellar.org/install.sh | bash
#   2. Fund your deployer:   soroban keys generate --network testnet --overwrite admin
#      Then:                 soroban keys fund <PUBLIC_KEY> --network testnet
#
# Usage:
#   make build
#   make deploy-testnet ADMIN_SECRET=<SSECRET...>
#   make init-contract CONTRACT_ID=<C...> ADMIN_ADDRESS=<G...> ADMIN_SECRET=<SSECRET...>

NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"
SOROBAN_RPC_URL = https://soroban-testnet.stellar.org

WASM_PATH = target/wasm32-unknown-unknown/release/agritrust_vyc.wasm

deploy-testnet:
	@test -n "$(ADMIN_SECRET)" || (echo "Error: set ADMIN_SECRET=<SSECRET...>" && exit 1)
	@test -f $(WASM_PATH) || (echo "Error: run 'make build' first" && exit 1)
	soroban contract deploy \
		--wasm $(WASM_PATH) \
		--network testnet \
		--source "$(ADMIN_SECRET)"

init-contract:
	@test -n "$(CONTRACT_ID)" || (echo "Error: set CONTRACT_ID=<C...>" && exit 1)
	@test -n "$(ADMIN_ADDRESS)" || (echo "Error: set ADMIN_ADDRESS=<G...>" && exit 1)
	@test -n "$(ADMIN_SECRET)" || (echo "Error: set ADMIN_SECRET=<SSECRET...>" && exit 1)
	soroban contract invoke \
		--id $(CONTRACT_ID) \
		--network testnet \
		--source "$(ADMIN_SECRET)" \
		-- init --admin $(ADMIN_ADDRESS)

verify-testnet:
	@test -n "$(CONTRACT_ID)" || (echo "Error: set CONTRACT_ID=<C...>" && exit 1)
	@test -n "$(ADMIN_SECRET)" || (echo "Error: set ADMIN_SECRET=<SSECRET...>" && exit 1)
	@echo "── get_admin ──"
	soroban contract invoke \
		--id $(CONTRACT_ID) \
		--network testnet \
		--source "$(ADMIN_SECRET)" \
		-- get_admin
	@echo "── get_vyc_count ──"
	soroban contract invoke \
		--id $(CONTRACT_ID) \
		--network testnet \
		--source "$(ADMIN_SECRET)" \
		-- get_vyc_count
