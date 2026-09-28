import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from './config/env.config.js';
import routes from './routes/index.js';
import sanitize from './middlewares/sanitize.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        callback(null, true);
      else
        callback(new ApiError(403, `CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'production' ? 1000 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// 4. Request Body & Cookie Parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());
app.use(sanitize);

// 5. HTTP Request Logging
if (env.NODE_ENV === 'development')
  app.use(morgan('dev'));
else
  app.use(morgan('combined'));


// 6. Mount API Routes
app.use('/api', routes);
app.use('/api/v1', routes);

// 7. Catch-all for unmatched routes
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found on this server`));
});

// 8. Global Error Handler
app.use(errorHandler);

export { app };
export default app;
