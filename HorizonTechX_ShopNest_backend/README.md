# HorizonTechX ShopNest — Backend API

Express.js and MongoDB (Mongoose) REST API backend for the ShopNest e-commerce platform.

## Features

- RESTful API architected with the Controller-Service-Repository (CSR) pattern for clean separation of concerns
- Authentication using bcryptjs password hashing, JWT access tokens, and refresh token rotation
- Product catalog management with search, multi-criteria filtering (category, price, rating), and pagination
- Shopping cart synchronization persisted in MongoDB with automatic stock validation
- Order processing pipeline with status management (Pending, Processing, Shipped, Delivered, Cancelled)
- User profile, address book, and product wishlist management
- Cloudinary media asset management via Multer for product images
- Request validation using express-validator and input sanitization
- Security middleware suite including Helmet, CORS, and Express Rate Limit
- Centralized error handling with standardized operational error class (`ApiError`) and response wrapper (`ApiResponse`)

## Tech Stack & Dependencies

- Node.js (v18+) & Express (`^5.2.1`)
- MongoDB & Mongoose (`^9.10.2`)
- JSON Web Token (`^9.0.3`) & bcryptjs (`^3.0.3`)
- Cloudinary (`^2.11.0`) & Multer (`^2.4.0`)
- Express Validator (`^7.3.2`) & Express Rate Limit (`^8.7.0`)
- Helmet (`^8.3.0`), Compression (`^1.8.2`), Morgan (`^1.12.1`), Cookie Parser (`^1.4.7`), CORS (`^2.8.6`), Dotenv (`^18.0.4`)

## Environment Configuration

Create a `.env` file in this directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MONGO_URI=mongodb://localhost:27017/shopnest
JWT_SECRET=your_super_secret_jwt_access_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server (nodemon)
npm run dev

# 3. Or start production server
npm start
```

The API server runs on `http://localhost:5000`.

## API Routes Summary

Mounted under `/api` and `/api/v1`:

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/addresses`, `/api/auth/addresses/:addressId`, `/api/auth/addresses/:addressId/default`, `/api/auth/wishlist/:productId`
- **Products**: `/api/products`, `/api/products/featured`, `/api/products/categories`, `/api/products/slug/:slug`, `/api/products/:id`
- **Cart**: `/api/cart`, `/api/cart/items`, `/api/cart/items/:productId`
- **Orders**: `/api/orders`, `/api/orders/my-orders`, `/api/orders/:id`, `/api/orders/:id/status`
- **Health**: `/health`, `/api/health`
