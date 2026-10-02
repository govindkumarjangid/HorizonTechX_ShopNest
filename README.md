# HorizonTechX ShopNest

ShopNest is a full-stack e-commerce web application built on the MERN stack (MongoDB, Express, React 19, Node.js). It provides end-to-end shopping workflows including user authentication, product catalog discovery with multi-parameter filtering, persistent cart synchronization, address management, order placement and tracking, wishlist management, and a responsive interface styled with Tailwind CSS v4.

## Features

### Authentication & Security
- User registration requiring name, email, and password with express-validator validation
- User login accepting email and password credentials
- Dual-token session strategy: signed JWT access token and refresh token rotation (`/api/auth/refresh`)
- Current user profile endpoint (`/api/auth/me`) with automatic store hydration on application mount
- Protected client-side routes redirecting unauthenticated users to `/auth`
- Password hashing with bcryptjs (salt rounds: 10)
- HTTP security headers via Helmet and IP-based rate limiting via Express Rate Limit
- Input sanitization middleware to prevent NoSQL injection and XSS

### Product Catalog & Discovery
- Dynamic product browsing with live keyword search and autocomplete suggestions
- Multi-faceted filtering by category, price range, and minimum customer rating
- Product sorting options: newest arrivals, price (low to high), price (high to low), and rating
- Server-side pagination with page and limit parameters
- Dedicated featured products endpoint (`/api/products/featured`) and category taxonomy (`/api/products/categories`)
- Product details view with slug/ID resolution, real-time stock indicators, and specifications
- Cloudinary media asset hosting with responsive image delivery
- Related products recommendation widget based on shared category

### Shopping Cart & Inventory
- Authenticated shopping cart persisted in MongoDB
- Optimistic UI updates with real-time subtotal, shipping fee, tax, and item count calculations
- Slide-over cart drawer accessible from the navbar with quantity increment, decrement, and item removal
- Real-time stock availability check preventing order placement for out-of-stock items
- Automatic cart cleanup upon successful order completion

### Checkout & Orders
- Multi-step checkout flow supporting delivery address selection or new address entry
- Multiple payment options including Cash on Delivery (COD), UPI, and Debit/Credit Cards
- Order creation pipeline: cart validation, total re-computation, stock deduction, and order persistence
- Order history page (`/orders`) displaying past purchases with status badges (Pending, Processing, Shipped, Delivered, Cancelled)
- Detailed order tracking view (`/orders/:id`) featuring an interactive visual status stepper

### Wishlist & User Account
- Wishlist toggle on all product cards and product detail views with immediate heart state updates
- Wishlist persistence in the MongoDB User document synchronized with Zustand store
- Profile management allowing updates to user display name and contact details
- Address book management: add new addresses, remove addresses, and set a default shipping address
- Account dashboard (`/dashboard`) summarizing recent orders, saved addresses, and wishlist items

### UI & Styling
- Responsive, modern interface built with Tailwind CSS v4 and Lucide React icons
- Smooth inertial scrolling powered by Lenis (`SmoothScrollProvider`)
- Component micro-animations and route transitions using Motion
- Interactive hero banners and product carousels powered by Swiper
- Mobile-optimized navigation with sticky category bar, collapsible search, and bottom tab bar
- Action feedback notifications using React Hot Toast
- Single Page Application (SPA) routing with 404 fallback and `vercel.json` rewrite configuration

## Tech Stack

### Backend
- Node.js & Express 5.2.1
- MongoDB & Mongoose 9.10.2
- JSON Web Token (jsonwebtoken 9.0.3) & bcryptjs 3.0.3
- Cloudinary 2.11.0 & Multer 2.4.0
- Helmet 8.3.0, Compression 1.8.2, Express Rate Limit 8.7.0
- Express Validator 7.3.2
- Cookie Parser 1.4.7, CORS 2.8.6, Morgan 1.12.1, Dotenv 18.0.4

### Frontend
- React 19.2.8 & React DOM 19.2.8
- Vite 8.3.0
- React Router DOM 7.18.4
- Zustand 5.0.15
- Axios 1.20.0
- Tailwind CSS 4.3.3 & @tailwindcss/vite
- Motion 13.4.4
- Lucide React 1.48.0
- Swiper 14.2.0
- Lenis 1.3.26
- React Hot Toast 2.6.1
- Date-fns 4.4.0

## Project Structure

```
HorizonTechX_ShopNest/
├── HorizonTechX_ShopNest_backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   ├── cloudinary.config.js
│       │   ├── db.js
│       │   └── env.config.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── cart.controller.js
│       │   ├── order.controller.js
│       │   └── product.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   ├── sanitize.middleware.js
│       │   ├── upload.middleware.js
│       │   └── validate.middleware.js
│       ├── models/
│       │   ├── Cart.model.js
│       │   ├── Category.model.js
│       │   ├── Order.model.js
│       │   ├── Product.model.js
│       │   └── User.model.js
│       ├── repositories/
│       │   ├── cart.repository.js
│       │   ├── order.repository.js
│       │   ├── product.repository.js
│       │   └── user.repository.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── cart.routes.js
│       │   ├── order.routes.js
│       │   ├── product.routes.js
│       │   └── index.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── cart.service.js
│       │   ├── order.service.js
│       │   └── product.service.js
│       ├── utils/
│       │   ├── ApiError.js
│       │   ├── ApiResponse.js
│       │   ├── asyncHandler.js
│       │   ├── generateToken.js
│       │   └── pagination.js
│       └── validators/
│           ├── auth.validator.js
│           ├── order.validator.js
│           └── product.validator.js
├── HorizonTechX_ShopNest_frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   ├── authApi.js
│       │   ├── axios.js
│       │   ├── cartApi.js
│       │   ├── orderApi.js
│       │   └── productApi.js
│       ├── components/
│       │   ├── auth/
│       │   │   ├── AccountPopup.jsx
│       │   │   ├── AuthModal.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── cart/
│       │   │   ├── CartDrawer.jsx
│       │   │   ├── CartItem.jsx
│       │   │   └── CartSummary.jsx
│       │   ├── common/
│       │   │   ├── ConfirmModal.jsx
│       │   │   ├── EmptyState.jsx
│       │   │   ├── Loader.jsx
│       │   │   └── ScrollToTop.jsx
│       │   ├── home/
│       │   │   ├── CountdownTimer.jsx
│       │   │   ├── MarqueeStrip.jsx
│       │   │   └── StatCounter.jsx
│       │   ├── layout/
│       │   │   ├── Footer.jsx
│       │   │   ├── Layout.jsx
│       │   │   └── Navbar.jsx
│       │   ├── navigation/
│       │   │   ├── AutocompleteSearch.jsx
│       │   │   └── MobileTabBar.jsx
│       │   ├── orders/
│       │   │   ├── OrderCard.jsx
│       │   │   ├── OrderStatusBadge.jsx
│       │   │   └── OrderTracker.jsx
│       │   ├── products/
│       │   │   ├── ProductCard.jsx
│       │   │   ├── ProductFilters.jsx
│       │   │   ├── ProductGallery.jsx
│       │   │   ├── ProductGrid.jsx
│       │   │   └── RelatedProducts.jsx
│       │   └── ui/
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── CategoryCard.jsx
│       │       ├── Footer.jsx
│       │       ├── Input.jsx
│       │       ├── Logo.jsx
│       │       ├── Navbar.jsx
│       │       ├── ProgressiveImage.jsx
│       │       ├── Rating.jsx
│       │       ├── SectionHeader.jsx
│       │       ├── Skeleton.jsx
│       │       ├── TestimonialCard.jsx
│       │       └── Typography.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── NotFound.jsx
│       │   ├── account/
│       │   │   └── Dashboard.jsx
│       │   ├── auth/
│       │   │   └── Auth.jsx
│       │   ├── cart/
│       │   │   ├── Cart.jsx
│       │   │   └── Checkout.jsx
│       │   ├── order/
│       │   │   ├── OrderDetails.jsx
│       │   │   └── Orders.jsx
│       │   └── product/
│       │       ├── ProductDetails.jsx
│       │       └── ProductList.jsx
│       ├── providers/
│       │   └── SmoothScrollProvider.jsx
│       ├── store/
│       │   ├── useAuthStore.js
│       │   ├── useCartStore.js
│       │   ├── useOrderStore.js
│       │   └── useProductStore.js
│       ├── styles/
│       │   └── motion.js
│       └── utils/
│           ├── cloudinary.js
│           ├── formatDate.js
│           ├── formatPrice.js
│           └── notify.js
├── vercel.json
└── README.md
```

## Prerequisites

- Node.js 18.x or higher (tested on Node 20+)
- npm 9.x or higher
- MongoDB instance (MongoDB Atlas cluster URI or local MongoDB instance)
- Cloudinary account for media assets (Cloud Name, API Key, API Secret)

## Environment Variables

Configuration is handled through `.env` files. Reference templates are provided in `.env.example` in each folder.

### Backend (`HorizonTechX_ShopNest_backend/.env`)

| Variable | Description | Placeholder Value |
|---|---|---|
| `PORT` | Port number the backend server listens on | `5000` |
| `NODE_ENV` | Application environment (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/shopnest` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:5173,http://localhost:3000` |
| `JWT_SECRET` | Secret key used to sign JWT access tokens | `your_super_secret_jwt_access_key` |
| `JWT_EXPIRES_IN` | Access token expiration duration | `7d` |
| `JWT_REFRESH_SECRET` | Secret key used to sign JWT refresh tokens | `your_super_secret_jwt_refresh_key` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration duration | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_cloudinary_api_secret` |

### Frontend (`HorizonTechX_ShopNest_frontend/.env`)

| Variable | Description | Placeholder Value |
|---|---|---|
| `VITE_API_URL` | Base URL for REST API requests | `http://localhost:5000/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for media assets | `your_cloudinary_cloud_name` |

## Installation & Setup

### 1. Backend Setup

```bash
cd HorizonTechX_ShopNest_backend

# Install dependencies
npm install

# Create environment configuration from template
cp .env.example .env

# Edit .env with your MongoDB and Cloudinary credentials

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

In a separate terminal:

```bash
cd HorizonTechX_ShopNest_frontend

# Install dependencies
npm install

# Create environment configuration from template
cp .env.example .env

# Start Vite development server
npm run dev
```

The frontend client will run on `http://localhost:5173`.

## API Overview

All routes are mounted under `/api` and `/api/v1`.

| Method | Path | Auth Required | Purpose |
|---|---|---|---|
| `GET` | `/health`, `/api/health` | No | Server health and operational status check |
| `POST` | `/api/auth/register` | No | Register a new user account |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and return access token |
| `POST` | `/api/auth/refresh` | No | Issue new access token using refresh token |
| `POST` | `/api/auth/logout` | Yes | Invalidate user session and clear authentication cookies |
| `GET` | `/api/auth/me` | Yes | Retrieve current authenticated user profile |
| `PUT` | `/api/auth/me` | Yes | Update authenticated user profile details |
| `POST` | `/api/auth/addresses` | Yes | Add a new shipping address to user profile |
| `DELETE` | `/api/auth/addresses/:addressId` | Yes | Remove a shipping address from user profile |
| `PATCH` | `/api/auth/addresses/:addressId/default` | Yes | Set a shipping address as the default address |
| `POST` | `/api/auth/wishlist/:productId` | Yes | Toggle product in user wishlist |
| `GET` | `/api/products` | No | Retrieve products with search, filtering, and pagination |
| `GET` | `/api/products/featured` | No | Retrieve list of featured products |
| `GET` | `/api/products/categories` | No | Retrieve list of all product categories |
| `GET` | `/api/products/slug/:slug` | No | Retrieve product details by URL slug |
| `GET` | `/api/products/:id` | No | Retrieve single product details by ID |
| `POST` | `/api/products` | Yes (Admin) | Create a new product in the catalog |
| `PUT` | `/api/products/:id` | Yes (Admin) | Update an existing product |
| `DELETE` | `/api/products/:id` | Yes (Admin) | Delete a product from the catalog |
| `GET` | `/api/cart` | Yes | Retrieve current user's active shopping cart |
| `POST` | `/api/cart/items` | Yes | Add item to cart or increment quantity |
| `PUT` | `/api/cart/items` | Yes | Update item quantity in cart |
| `DELETE` | `/api/cart/items/:productId` | Yes | Remove item from cart |
| `DELETE` | `/api/cart` | Yes | Clear all items from cart |
| `POST` | `/api/orders` | Yes | Place a new order from active cart items |
| `GET` | `/api/orders/my-orders` | Yes | Retrieve authenticated user's order history |
| `GET` | `/api/orders/:id` | Yes | Retrieve specific order details with tracking status |
| `GET` | `/api/orders` | Yes (Admin) | Retrieve all orders across all users |
| `PATCH` | `/api/orders/:id/status` | Yes (Admin) | Update order status (Pending, Processing, Shipped, Delivered, Cancelled) |

## Manual Verification Checklist

To verify core e-commerce workflows:

1. User Authentication:
   - Navigate to `http://localhost:5173/auth`.
   - Register a new account with name, email, and password.
   - Verify immediate redirection, welcome toast notification, and user profile state loaded in the navbar.
   - Refresh the page and confirm the session is restored via `/api/auth/me`.
2. Product Browsing & Filtering:
   - Browse the homepage catalog and navigate to `/products`.
   - Use the category selector, price slider, and search input to filter items.
   - Click a product to open `/products/:id` and verify image gallery, specifications, and stock status.
3. Wishlist Management:
   - Click the heart icon on any product card or the product detail page.
   - Confirm the heart icon fills active, a toast notification confirms the addition, and the wishlist count in the navbar updates.
   - Refresh the page and verify the product remains in the wishlist.
4. Cart Operations:
   - Click "Add to Cart" on a product.
   - Verify the cart drawer slides open showing the added product, calculated price, and quantity controls.
   - Increment and decrement item quantities and confirm subtotal, tax, and total price update accurately.
5. Checkout & Order Placement:
   - Click "Proceed to Checkout" from the cart drawer or `/cart` page.
   - Complete the delivery address form or select an existing saved address.
   - Select a payment method and submit the order.
   - Confirm order creation, cart clearance, and redirection to the order confirmation page.
6. Order Tracking & History:
   - Navigate to `/orders` and verify the newly placed order appears in the list.
   - Click on the order to open `/orders/:id`.
   - Verify order items, shipping address, total breakdown, and the interactive status progress stepper.
