import 'dotenv/config';
import process from 'node:process';
import http from 'node:http';
import { Server } from 'socket.io';
import consola from 'consola';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { mw as requestIp } from 'request-ip';
import { logger } from './utils/logger';
import { errorHandler, handle404Error } from '@/utils/errors';
import routes from '@/routes/routes';
import './utils/env.ts';

const { PORT } = process.env;

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
});

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests in a short time. Please try in a minute.',
      });
    },
  }),
);

app.use(logger);

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API!',
  });
});

app.get('/healthcheck', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/api', routes);

app.all('*', handle404Error);

app.use(errorHandler);

io.on('connection', (socket) => {
  consola.log('A user connected with socket ID:', socket.id);

  socket.on('join-alert-room', (alertId) => {
    socket.join(alertId);
    consola.log(`Socket ${socket.id} joined room ${alertId}`);

    io.to(alertId).emit('guardian-joined', { socketId: socket.id });
  });

  socket.on('location-update', (data) => {
    io.to(data.alertId).emit('new-location', {
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  socket.on('stop-tracking', (data) => {
    if (data && data.alertId) {
      consola.log(`Server: Broadcasting 'alert-resolved' to room: ${data.alertId}`);
      io.in(data.alertId).emit('alert-resolved');
      io.in(data.alertId).disconnectSockets(true);
    }
  });

  socket.on('disconnect', () => {
    consola.log('User disconnected:', socket.id);
  });
});

if (process.env.RENDER) {
  consola.success('--- SERVER IS RUNNING ON THE RENDER PLATFORM ---');
  consola.info(`--- Instance ID: ${process.env.RENDER_INSTANCE_ID} ---`);
  consola.info(`--- Service Name: ${process.env.RENDER_SERVICE_NAME} ---`);
}
else {
  consola.warn('--- SERVER IS RUNNING ON A LOCAL MACHINE ---');
}

httpServer.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
