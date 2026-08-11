import type { FastifyInstance } from 'fastify';
import { computeAgriTrustScore } from '../services/scoring.service.js';
import type { ActivityEntry } from '../types/vyc.types.js';

interface ScoreBody {
  farmer?: string;
  activities?: ActivityEntry[];
}

export async function registerScoreRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ScoreBody }>('/score', async (request, reply) => {
    const activities = request.body?.activities;
    if (!Array.isArray(activities)) {
      return reply.code(400).send({ success: false, error: 'activities must be an array of ActivityEntry.' });
    }
    for (const activity of activities) {
      if (
        typeof activity?.type !== 'string' ||
        typeof activity?.amount !== 'number' ||
        !Number.isFinite(activity.amount) ||
        typeof activity?.timestamp !== 'number' ||
        typeof activity?.region !== 'string'
      ) {
        return reply.code(400).send({
          success: false,
          error: 'Each activity needs type, amount, timestamp, and region.',
        });
      }
    }
    const result = computeAgriTrustScore(activities as ActivityEntry[]);
    return { success: true, data: result };
  });
}