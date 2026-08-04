import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';
import { createSocketServer } from './config/socket';
import { orderRealtimeService } from './services/order-realtime.service';
import { orderStatusSchedulerService } from './services/order-status-scheduler.service';

const app = createApp();
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);
orderRealtimeService.attach(io);

io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Socket connected');
  orderRealtimeService.registerSocket(socket);

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Socket disconnected');
  });
});

httpServer.listen(env.PORT, () => {
  logger.info(`API server listening on port ${env.PORT}`);
});

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info({ signal }, 'Shutting down server');
  orderStatusSchedulerService.stopAll();
  io.close();

  httpServer.close(async (error) => {
    if (error) {
      logger.error({ error }, 'Error while closing HTTP server');
      process.exitCode = 1;
    }

    await prisma.$disconnect();
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
