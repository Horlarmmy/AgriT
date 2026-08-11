#![cfg(test)]
use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, String};

fn setup() -> (Env, Address, Address) {
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, AgriTrust);
    (env, admin, contract_id)
}

fn dummy_hash(env: &Env) -> String {
    String::from_str(
        env,
        "a3f8b1e2d4c7f9a0b2e5d8c1f4a7b0e3d6c9f2a5b8e1d4c7f0a3b6e9d2c5f8a1",
    )
}

#[test]
fn test_init() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let stored_admin = client.get_admin();
    assert_eq!(stored_admin, admin);

    let count = client.get_vyc_count();
    assert_eq!(count, 0);
}

#[test]
fn test_mint_vyc_basic() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let farmer = Address::generate(&env);
    let id = client.mint_vyc(
        &admin,
        &farmer,
        &75,
        &50_000_000i128, // 50 USDC in micro-USDC
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );

    assert_eq!(id, 1);
    assert_eq!(client.get_vyc_count(), 1);
}

#[test]
fn test_get_vyc_record() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let farmer = Address::generate(&env);
    let hash = dummy_hash(&env);
    let id = client.mint_vyc(
        &admin,
        &farmer,
        &80,
        &100_000_000i128, // 100 USDC
        &symbol_short!("COCOA"),
        &symbol_short!("GHAA"),
        &hash,
    );

    let vyc = client.get_vyc(&id);
    assert!(vyc.is_some());

    let record = vyc.unwrap();
    assert_eq!(record.id, 1);
    assert_eq!(record.farmer, farmer);
    assert_eq!(record.score, 80);
    assert_eq!(record.expected_yield, 100_000_000);
    assert_eq!(record.status, VycStatus::Active);
}

#[test]
fn test_farmer_vyc_list() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let farmer = Address::generate(&env);

    // Mint 3 VYCs for the same farmer
    client.mint_vyc(
        &admin,
        &farmer,
        &70,
        &30_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );
    client.mint_vyc(
        &admin,
        &farmer,
        &75,
        &50_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );
    client.mint_vyc(
        &admin,
        &farmer,
        &80,
        &80_000_000,
        &symbol_short!("COCOA"),
        &symbol_short!("GHAA"),
        &dummy_hash(&env),
    );

    let farmer_ids = client.get_farmer_vycs(&farmer);
    assert_eq!(farmer_ids.len(), 3);
    assert_eq!(farmer_ids.get(0).unwrap(), 1u64);
    assert_eq!(farmer_ids.get(1).unwrap(), 2u64);
    assert_eq!(farmer_ids.get(2).unwrap(), 3u64);
}

#[test]
fn test_multiple_farmers_isolated() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let farmer_a = Address::generate(&env);
    let farmer_b = Address::generate(&env);

    client.mint_vyc(
        &admin,
        &farmer_a,
        &70,
        &40_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );
    client.mint_vyc(
        &admin,
        &farmer_b,
        &85,
        &70_000_000,
        &symbol_short!("SOYA"),
        &symbol_short!("NGKN"),
        &dummy_hash(&env),
    );

    let a_ids = client.get_farmer_vycs(&farmer_a);
    let b_ids = client.get_farmer_vycs(&farmer_b);

    assert_eq!(a_ids.len(), 1);
    assert_eq!(b_ids.len(), 1);
    // IDs are globally unique even across farmers
    assert_eq!(a_ids.get(0).unwrap(), 1u64);
    assert_eq!(b_ids.get(0).unwrap(), 2u64);
}

#[test]
fn test_update_status_redeem() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let farmer = Address::generate(&env);
    let id = client.mint_vyc(
        &admin,
        &farmer,
        &72,
        &60_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );

    // Simulate successful harvest — mark as Redeemed
    client.update_status(&admin, &id, &VycStatus::Redeemed);

    let vyc = client.get_vyc(&id).unwrap();
    assert_eq!(vyc.status, VycStatus::Redeemed);
}

#[test]
fn test_get_nonexistent_vyc() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let vyc = client.get_vyc(&999u64);
    assert!(vyc.is_none());
}

#[test]
fn test_get_vyc_count_increments() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    assert_eq!(client.get_vyc_count(), 0);

    let farmer = Address::generate(&env);
    client.mint_vyc(
        &admin,
        &farmer,
        &65,
        &25_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );
    assert_eq!(client.get_vyc_count(), 1);

    client.mint_vyc(
        &admin,
        &farmer,
        &70,
        &35_000_000,
        &symbol_short!("MAIZE"),
        &symbol_short!("NGLA"),
        &dummy_hash(&env),
    );
    assert_eq!(client.get_vyc_count(), 2);
}

#[test]
fn test_transfer_admin() {
    let (env, admin, contract_id) = setup();
    env.mock_all_auths();

    let client = AgriTrustClient::new(&env, &contract_id);
    client.init(&admin);

    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin);

    let stored = client.get_admin();
    assert_eq!(stored, new_admin);
}
