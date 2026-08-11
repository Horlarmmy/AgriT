import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  xdr,
  rpc,
} from '@stellar/stellar-sdk';
import type { Account } from '@stellar/stellar-sdk';
import type { NetworkType } from '../config/stellar.config.js';
import { getStellarConfig } from '../config/stellar.config.js';
import type { ContractWriteResult, VycRecord, VycStatus } from '../types/vyc.types.js';
import { VYC_STATUSES } from '../types/vyc.types.js';
import { logger } from '../utils/logger.js';

const STATUS_TAGS: VycStatus[] = VYC_STATUSES;

function statusToScVal(status: VycStatus): xdr.ScVal {
  return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(status)]);
}

function decodeStatus(value: unknown): VycStatus | null {
  // Soroban unit-variant enums decode via scValToNative as a one-element tuple: ['Active']
  if (Array.isArray(value) && value.length === 1) {
    const tag = value[0];
    if ((STATUS_TAGS as string[]).includes(tag as string)) return tag as VycStatus;
  }
  if (value && typeof value === 'object' && 'tag' in (value as Record<string, unknown>)) {
    const tag = (value as { tag: unknown }).tag;
    if ((STATUS_TAGS as string[]).includes(tag as string)) return tag as VycStatus;
  }
  if (typeof value === 'string' && (STATUS_TAGS as string[]).includes(value)) {
    return value as VycStatus;
  }
  return null;
}

function normaliseVycRecord(decoded: unknown): VycRecord | null {
  if (!decoded || typeof decoded !== 'object') return null;
  const obj = decoded as Record<string, unknown>;

  const id = typeof obj.id === 'bigint' ? Number(obj.id) : (obj.id as number);
  const farmer = obj.farmer as string;
  const score = typeof obj.score === 'bigint' ? Number(obj.score) : (obj.score as number);
  const expectedYield =
    typeof obj.expected_yield === 'bigint'
      ? Number(obj.expected_yield)
      : typeof obj.expected_yield === 'number'
        ? obj.expected_yield
        : 0;
  const crop = obj.crop as string;
  const region = obj.region as string;
  const activityHash = obj.activity_hash as string;
  const status = decodeStatus(obj.status);
  const createdAt = typeof obj.created_at === 'bigint' ? Number(obj.created_at) : (obj.created_at as number);
  const updatedAt = typeof obj.updated_at === 'bigint' ? Number(obj.updated_at) : (obj.updated_at as number);

  if (farmer === undefined || typeof id !== 'number') return null;

  return {
    id,
    farmer,
    score,
    expectedYield,
    crop,
    region,
    activityHash,
    status: status ?? 'Active',
    createdAt,
    updatedAt,
  };
}

export interface MintVycInput {
  farmer: string;
  score: number;
  expectedYield: number;
  crop: string;
  region: string;
  activityHash: string;
}

/**
 * Thin Soroban client for the AgriTrust `volatility_shield` contract.
 *
 * Write privileges mirror the contract: `mint_vyc` and `update_status` are
 * admin-only on-chain and require the backend to hold the admin keypair, so
 * they can never run in the browser.
 */
export class AgriTrustContractService {
  private network: NetworkType;
  private networkPassphrase: string;
  private rpcUrl: string;
  private contractId?: string;
  private adminSecret?: string;

  constructor(network: NetworkType = 'testnet') {
    const config = getStellarConfig(network);
    this.network = network;
    this.networkPassphrase = config.networkPassphrase;
    this.rpcUrl = config.rpcUrl;
    this.contractId = config.contractId;
    const secretRaw = process.env.ADMIN_SECRET_KEY;
    this.adminSecret = secretRaw ? secretRaw.trim().replace(/['"]/g, '') : undefined;
  }

  private isConfigured(): boolean {
    return Boolean(this.contractId && this.adminSecret);
  }

  private canRead(): boolean {
    return Boolean(this.contractId);
  }

  private getServer(): rpc.Server {
    return new rpc.Server(this.rpcUrl, { allowHttp: this.rpcUrl.startsWith('http://') });
  }

  private sourcePublicKey(): string | null {
    return this.adminSecret ? Keypair.fromSecret(this.adminSecret).publicKey() : null;
  }

  private async getSourceAccount(server: rpc.Server, source?: string): Promise<Account> {
    const pk = source || this.sourcePublicKey();
    if (!pk) {
      throw new Error(
        `No source account available — configure ADMIN_SECRET_KEY or pass ?source=<existing G... testnet account>.`
      );
    }
    return server.getAccount(pk);
  }

  private async simulateRead(fnName: string, args: xdr.ScVal[], source?: string): Promise<unknown | null> {
    if (!this.canRead()) {
      throw new Error('Contract not configured — set TESTNET_CONTRACT_ID or MAINNET_CONTRACT_ID.');
    }
    const server = this.getServer();
    const account = await this.getSourceAccount(server, source);
    const contract = new Contract(this.contractId as string);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(contract.call(fnName, ...args))
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(sim)) {
      logger.warn({ fn: fnName, error: sim.error }, 'Contract simulation errored');
      return null;
    }

    if (!('result' in sim) || !sim.result || !sim.result.retval) {
      return null;
    }

    return scValToNative(sim.result.retval);
  }

  async getVyc(id: number, source?: string): Promise<VycRecord | null> {
    try {
      const decoded = await this.simulateRead('get_vyc', [nativeToScVal(id, { type: 'u64' })], source);
      if (decoded === null || decoded === undefined) return null;
      return normaliseVycRecord(decoded);
    } catch (error) {
      const err = error as Error;
      logger.error({ error: err.message, id }, 'getVyc failed');
      throw error;
    }
  }

  async getFarmerVycs(farmer: string, source?: string): Promise<number[]> {
    const decoded = await this.simulateRead('get_farmer_vycs', [new Address(farmer).toScVal()], source);
    if (!Array.isArray(decoded)) return [];
    return decoded.map((value) => (typeof value === 'bigint' ? Number(value) : Number(value)));
  }

  async getVycCount(source?: string): Promise<number | null> {
    const decoded = await this.simulateRead('get_vyc_count', [], source);
    if (decoded === null || decoded === undefined) return null;
    return typeof decoded === 'bigint' ? Number(decoded) : (decoded as number);
  }

  async getAdmin(source?: string): Promise<string | null> {
    const decoded = await this.simulateRead('get_admin', [], source);
    return typeof decoded === 'string' ? decoded : null;
  }

  async mintVyc(input: MintVycInput, opts: { dryRun?: boolean } = {}): Promise<ContractWriteResult> {
    if (!this.isConfigured()) {
      return this.notConfigured();
    }
    const adminKey = Keypair.fromSecret(this.adminSecret as string);
    const args: xdr.ScVal[] = [
      new Address(adminKey.publicKey()).toScVal(),
      new Address(input.farmer).toScVal(),
      nativeToScVal(input.score, { type: 'u32' }),
      nativeToScVal(BigInt(input.expectedYield), { type: 'i128' }),
      xdr.ScVal.scvSymbol(input.crop),
      xdr.ScVal.scvSymbol(input.region),
      xdr.ScVal.scvString(input.activityHash),
    ];
    return this.submitWrite((contract) => contract.call('mint_vyc', ...args), opts);
  }

  async updateStatus(
    id: number,
    status: VycStatus,
    opts: { dryRun?: boolean } = {}
  ): Promise<ContractWriteResult> {
    if (!this.isConfigured()) {
      return this.notConfigured();
    }
    const adminKey = Keypair.fromSecret(this.adminSecret as string);
    const args: xdr.ScVal[] = [
      new Address(adminKey.publicKey()).toScVal(),
      nativeToScVal(id, { type: 'u64' }),
      statusToScVal(status),
    ];
    return this.submitWrite((contract) => contract.call('update_status', ...args), opts);
  }

  private notConfigured(): ContractWriteResult {
    logger.info({}, 'Contract write skipped (contractId or ADMIN_SECRET_KEY not configured)');
    return {
      success: false,
      error: 'Contract not configured — set TESTNET/MAINNET_CONTRACT_ID and ADMIN_SECRET_KEY.',
    };
  }

  private async submitWrite(
    buildOperation: (contract: Contract) => ReturnType<Contract['call']>,
    opts: { dryRun?: boolean } = {}
  ): Promise<ContractWriteResult> {
    if (!this.isConfigured()) {
      return this.notConfigured();
    }

    const server = this.getServer();
    const admin = Keypair.fromSecret(this.adminSecret as string);
    const contract = new Contract(this.contractId as string);

    try {
      const account = await server.getAccount(admin.publicKey());

      const baseTx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(buildOperation(contract))
        .setTimeout(60)
        .build();

      const prepared = await server.prepareTransaction(baseTx);

      if (opts.dryRun) {
        logger.info({ fyCall: 'dryRun' }, 'Contract write dry-run simulated successfully');
        return { success: true, dryRun: true, txHash: Buffer.from(prepared.hash()).toString('hex') };
      }

      prepared.sign(admin);

      const sendResult = await server.sendTransaction(prepared);

      if (sendResult.status === 'ERROR') {
        const errMsg = JSON.stringify(sendResult.errorResult ?? sendResult);
        logger.error({ errMsg }, 'Contract write send failed');
        return { success: false, error: `Send failed: ${errMsg}` };
      }

      let status = sendResult.status as string;
      let attempts = 0;
      let getResult: Awaited<ReturnType<typeof server.getTransaction>> | null = null;
      while (status === 'PENDING' && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        getResult = await server.getTransaction(sendResult.hash);
        status = getResult.status;
        attempts += 1;
      }

      if (status === 'SUCCESS') {
        logger.info({ txHash: sendResult.hash }, 'Contract write confirmed');
        return { success: true, txHash: Buffer.from(sendResult.hash).toString('hex') };
      }

      logger.warn({ status, txHash: sendResult.hash }, 'Contract write did not confirm');
      return { success: false, txHash: Buffer.from(sendResult.hash).toString('hex'), error: `Final status: ${status}` };
    } catch (error) {
      const err = error as Error;
      logger.error({ error: err.message }, 'Contract write threw');
      return { success: false, error: err.message };
    }
  }
}

export function createContractService(network: NetworkType = 'testnet'): AgriTrustContractService {
  return new AgriTrustContractService(network);
}