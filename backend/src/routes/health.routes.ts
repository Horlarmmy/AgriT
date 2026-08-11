import type { FastifyReply, FastifyRequest } from 'fastify';

export async function healthRoute(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}