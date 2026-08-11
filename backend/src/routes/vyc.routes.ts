import type { FastifyInstance } from 'fastify';
import { appConfig } from '../config/app.config.js';
import { createContractService } from '../services/contract.service.js';
import { EventIndexerService } from '../services/indexer.service.js';
import { logger } from '../utils/logger.js';
import { isAddress } from '../utils/validators.js';

/**
 * Read-side proxy over the Soroban contract. These endpoints only simulate the
 * contract's view functions, so they safely work with a public RPC — the admin
 * keypair is never needed here.
 */
export async function registerVycRoutes(fastify: FastifyInstance) {
  const contractService = createContractService(appConfig.stellarNetwork);
  const indexer = new EventIndexerService(appConfig.stellarNetwork);

  fastify.get<{ Querystring: { source?: string } }>('/vyc/count', async (request, reply) => {
    try {
      const count = await contractService.getVycCount(request.query.source);
      if (count === null) {
        return reply.code(502).send({ success: false, error: 'VYC count unavailable (simulation failed).' });
      }
      return { success: true, count };
    } catch (error) {
      const message = (error as Error).message;
      logger.warn({ error: message }, 'getVycCount failed');
      return reply.code(502).send({ success: false, error: message });
    }
  });

  fastify.get<{ Params: { id: string }; Querystring: { source?: string } }>('/vyc/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return reply.code(400).send({ success: false, error: 'Invalid VYC id — must be a positive integer.' });
    }
    try {
      const vyc = await contractService.getVyc(id, request.query.source);
      if (!vyc) {
        return reply.code(404).send({ success: false, error: `VYC ${id} not found.` });
      }
      return { success: true, data: vyc };
    } catch (error) {
      const message = (error as Error).message;
      logger.warn({ error: message, id }, 'getVyc failed');
      return reply.code(502).send({ success: false, error: message });
    }
  });

  fastify.get<{ Params: { account: string }; Querystring: { source?: string } }>(
    '/farmer/:account/vycs',
    async (request, reply) => {
      const account = request.params.account;
      if (!isAddress(account)) {
        return reply.code(400).send({ success: false, error: 'Invalid Stellar account address.' });
      }
      try {
        const ids = await contractService.getFarmerVycs(account, request.query.source);
        return { success: true, farmer: account, ids, count: ids.length };
      } catch (error) {
        const message = (error as Error).message;
        logger.warn({ error: message, account }, 'getFarmerVycs failed');
        return reply.code(502).send({ success: false, error: message });
      }
    }
  );

  fastify.get<{ Querystring: { startLedger?: string; cursor?: string; limit?: string } }>(
    '/vyc/events',
    async (request, reply) => {
      try {
        const events = await indexer.fetchEvents({
          startLedger: request.query.startLedger ? parseInt(request.query.startLedger, 10) : undefined,
          cursor: request.query.cursor,
          limit: request.query.limit ? Math.min(Math.max(Number(request.query.limit), 1), 100) : undefined,
        });
        return { success: true, count: events.length, events };
      } catch (error) {
        const message = (error as Error).message;
        logger.warn({ error: message }, 'getContractEvents failed');
        return reply.code(502).send({ success: false, error: `Could not fetch contract events: ${message}` });
      }
    }
  );
}