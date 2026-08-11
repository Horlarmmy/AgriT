import { rpc, scValToNative } from '@stellar/stellar-sdk';
import type { NetworkType } from '../config/stellar.config.js';
import { getStellarConfig } from '../config/stellar.config.js';
import type { DecodedContractEvent } from '../types/vyc.types.js';

function toJsonSafe(value: unknown): unknown {
  if (typeof value === 'bigint') return Number(value);
  if (value instanceof Uint8Array) return Buffer.from(value).toString('hex');
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      out[key] = toJsonSafe(entry);
    }
    return out;
  }
  return value;
}

/**
 * Off-chain event indexer for the `volatility_shield` contract. Consumes the
 * `vyc_minted` and `vyc_status` events the contract publishes for liquidity
 * providers and insurance oracles, translating them into JSON-safe records the
 * frontend can render (dashboards, payout tracking, weather forecasts).
 */
export class EventIndexerService {
  private contractId?: string;
  private rpcUrl: string;

  constructor(network: NetworkType = 'testnet') {
    const config = getStellarConfig(network);
    this.contractId = config.contractId;
    this.rpcUrl = config.rpcUrl;
  }

  async fetchEvents(opts: { startLedger?: number; cursor?: string; limit?: number } = {}): Promise<DecodedContractEvent[]> {
    if (!this.contractId) return [];

    const server = new rpc.Server(this.rpcUrl, { allowHttp: this.rpcUrl.startsWith('http://') });

    const response = await server.getEvents({
      startLedger: opts.startLedger,
      cursor: opts.cursor,
      limit: opts.limit,
      filters: [
        {
          type: 'contract',
          contractIds: [this.contractId],
        },
      ],
    });

    return response.events.map((event) => ({
      id: event.id,
      type: event.type,
      ledger: event.ledger,
      ledgerClosedAt: event.ledgerClosedAt,
      pagingToken: event.pagingToken,
      txHash: event.txHash,
      successful: event.inSuccessfulContractCall,
      topic: event.topic.map((scv) => toJsonSafe(scValToNative(scv))),
      value: toJsonSafe(scValToNative(event.value)),
    }));
  }
}