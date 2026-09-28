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

//  Security Headers (configured to allow cross-origin requests)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network'])
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://horizon-tech-x-shop-nest-nlgkuykvd-scan-and-print.vercel.app',
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/+$/, '');

  if (allowedOrigins.some((allowed) => allowed.replace(/\/+$/, '') === cleanOrigin))
    return true;

  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin))
    return true;

  if (/^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/.test(cleanOrigin))
    return true;

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin))
      callback(null, true);
    else
      callback(new ApiError(403, `CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Private-Network',
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Rate Limiter
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

// Request Body & Cookie Parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());
app.use(sanitize);

// HTTP Request Logging
if (env.NODE_ENV === 'development')
  app.use(morgan('dev'));
else
  app.use(morgan('combined'));


//  Mount API Routes
app.use('/api', routes);
app.use('/api/v1', routes);

//  Catch-all for unmatched routes
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found on this server`));
});

//  Global Error Handler
app.use(errorHandler);

export { app };
export default app;
