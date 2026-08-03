import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { allowedOrigins } from './cors';

export function createSocketServer(httpServer: HttpServer) {
  return new Server(httpServer, {
    cors: {
      // CORS restricts which browser origins may connect, but it does not prove
      // user identity or order ownership. Auth belongs in the socket handshake.
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });
}
