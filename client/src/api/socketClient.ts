import { io } from 'socket.io-client';
import { env } from '../config/env';

export const socketClient = io(env.socketUrl, {
  autoConnect: false,
  transports: ['websocket']
});
