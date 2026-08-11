import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { appConfig } from '../config/app.config.js';
import type { VycRecord, VycStatus } from '../types/vyc.types.js';
import { logger } from '../utils/logger.js';

const MINT_LOG = 'vyc_mints.jsonl';
const STATUS_LOG = 'vyc_status.jsonl';

function ensureDir(): void {
  mkdirSync(appConfig.dataDir, { recursive: true });
}

function logFile(name: string): string {
  return join(appConfig.dataDir, name);
}

/**
 * Best-effort JSONL persistence for on-chain writes, so the UI can show
 * mint/redeem history without re-indexing the ledger. Never throws — history
 * must not break the API.
 */
export const historyService = {
  recordMint(
    record: Partial<VycRecord> & { txHash?: string; dryRun?: boolean }
  ): void {
    try {
      ensureDir();
      appendFileSync(logFile(MINT_LOG), JSON.stringify({ ...record, loggedAt: Date.now() }) + '\n');
    } catch (error) {
      logger.warn({ error: (error as Error).message }, 'Failed to record mint');
    }
  },

  recordStatus(id: number, status: VycStatus, txHash?: string, dryRun?: boolean): void {
    try {
      ensureDir();
      appendFileSync(logFile(STATUS_LOG), JSON.stringify({ id, status, txHash, dryRun, loggedAt: Date.now() }) + '\n');
    } catch (error) {
      logger.warn({ error: (error as Error).message }, 'Failed to record status update');
    }
  },
};