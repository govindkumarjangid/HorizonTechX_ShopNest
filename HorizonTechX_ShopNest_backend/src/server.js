import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.config.js';

process.on('uncaughtException', (err) => {
  console.error(`[Process] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`HorizonTechX ShopNest Backend Server`);
      console.log(`URL: http://localhost:${env.PORT}...`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Health Check: http://localhost:${env.PORT}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Process] Unhandled Rejection: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error(`[Server] Failed to initialize server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
