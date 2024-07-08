import type { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

let fastify: FastifyInstance;

export const websocket = {
  init: (app: FastifyInstance): void => {
    fastify = app;
  },
  broadcast: (data: Record<string, unknown>): void => {
    fastify.websocketServer.clients.forEach((Socket) => {
      if (Socket.readyState !== WebSocket.OPEN) return;

      Socket.send(JSON.stringify(data));
    });
  },
};
