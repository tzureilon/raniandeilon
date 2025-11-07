/**
 * Propel.AI - Main Server Entry Point
 * מערכת אוטונומית לשיווק נדל״ן בפייסבוק
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { log } from './utils/logger';
import pool from './config/database';

// Import modules
import scheduler from './modules/scheduler';
import fbPublisher from './modules/fb_publisher';
import alertSystem from './modules/alert_system';

// Import routes
import propertiesRoutes from './routes/properties';
import dashboardRoutes from './routes/dashboard';
import leadsRoutes from './routes/leads';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for uploaded images, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/properties', propertiesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Propel.AI',
    description: 'מערכת אוטונומית לשיווק נדל״ן בפייסבוק',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      properties: '/api/properties',
      dashboard: '/api/dashboard',
      leads: '/api/leads',
    },
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log.error('express', 'Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    log.info('server', 'Database connection successful');

    // Start scheduler
    if (process.env.ENABLE_AUTO_POSTING === 'true') {
      scheduler.start();
      log.info('server', 'Scheduler started');

      // Start Facebook publisher processing
      setInterval(async () => {
        try {
          await fbPublisher.processPendingPosts();
        } catch (error) {
          log.error('server', 'Error processing pending posts', { error });
        }
      }, 5 * 60 * 1000); // Every 5 minutes

      log.info('server', 'Facebook publisher started');
    } else {
      log.info('server', 'Auto-posting is disabled');
    }

    // Start Express server
    app.listen(PORT, () => {
      log.info('server', `Server started successfully on port ${PORT}`);
      console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║              🚀 Propel.AI 🚀                  ║
║                                                ║
║   מערכת אוטונומית לשיווק נדל״ן בפייסבוק      ║
║                                                ║
║   Server: http://localhost:${PORT}            ║
║   Status: ✅ Running                           ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);

      // Send startup alert
      alertSystem.sendAlert(
        '✅ המערכת התחילה לפעול',
        `Propel.AI פועלת בהצלחה על פורט ${PORT}`
      );
    });

    // Graceful shutdown
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    log.critical('server', 'Failed to start server', { error });
    alertSystem.sendErrorAlert('server', (error as Error).message);
    process.exit(1);
  }
}

// Shutdown handler
async function shutdown() {
  log.info('server', 'Shutting down gracefully...');

  // Stop scheduler
  scheduler.stop();

  // Close Facebook publisher browser
  await fbPublisher.close();

  // Close database pool
  await pool.end();

  log.info('server', 'Shutdown complete');
  process.exit(0);
}

// Start the server
startServer();
