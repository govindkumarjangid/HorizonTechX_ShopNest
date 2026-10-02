# HorizonTechX ShopNest — Frontend Client

React 19 single-page application built with Vite and Tailwind CSS for the ShopNest e-commerce platform.

## Features

- Clean, modern UI styled with Tailwind CSS v4 and Lucide React icons
- Smooth inertial scrolling powered by Lenis
- Dynamic product browsing with live autocomplete search and multi-criteria filters (category, price, rating)
- Global state management using Zustand stores (`useAuthStore`, `useCartStore`, `useProductStore`, `useOrderStore`)
- Slide-over cart drawer with real-time subtotal, tax, and shipping fee calculations
- Multi-step checkout workflow with saved address selection and payment methods
- Order history and interactive visual order tracking stepper
- Reactive product wishlist with persistent user state
- Authenticated Axios client with Bearer token headers and centralized error handling
- Carousel and banner interactions using Swiper
- Smooth micro-interactions and transitions with Motion
- Single Page Application (SPA) routing with 404 fallback and `vercel.json` rewrites

## Tech Stack & Dependencies

- React (`^19.2.8`) & React DOM (`^19.2.8`)
- Vite (`^8.3.0`)
- React Router DOM (`^7.18.4`)
- Tailwind CSS (`^4.3.3`) & `@tailwindcss/vite`
- Zustand (`^5.0.15`)
- Axios (`^1.20.0`)
- Motion (`^13.4.4`)
- Lucide React (`^1.48.0`)
- Swiper (`^14.2.0`)
- Lenis (`^1.3.26`)
- React Hot Toast (`^2.6.1`)
- Date-fns (`^4.4.0`)

## Environment Configuration

Create a `.env` file in this directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The frontend client runs on `http://localhost:5173`.
