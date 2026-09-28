import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import env from '../config/env.config.js';
import Product from '../models/Product.model.js';

// Configure DNS for MongoDB Atlas SRV connection on Windows
if (env.MONGO_URI?.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (dnsErr) {
    console.warn('[MongoDB] Warning: Could not override DNS servers:', dnsErr.message);
  }
}

dotenv.config();

const DUMMY_JSON_URL = 'https://dummyjson.com/products?limit=197';

async function seedDummyJsonProducts() {
  console.log('--------------------------------------------------');
  console.log('[Seed] Connecting to MongoDB Atlas...');
  await mongoose.connect(env.MONGO_URI);
  console.log('[Seed] Connected successfully to MongoDB Atlas.');

  // 1. Delete all previous products
  console.log('[Seed] Deleting old products from database...');
  const deleteResult = await Product.deleteMany({});
  console.log(`[Seed] Deleted ${deleteResult.deletedCount} old products from collection.`);

  // 2. Fetch products from DummyJSON
  console.log(`[Seed] Fetching products from ${DUMMY_JSON_URL}...`);
  const response = await fetch(DUMMY_JSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch from DummyJSON: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawProducts = data.products || [];
  console.log(`[Seed] Received ${rawProducts.length} products from DummyJSON.`);

  // 3. Map to comprehensive Product Schema
  const transformedProducts = rawProducts.map((p) => {
    const title = p.title || p.name || 'Curated Product';
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${p.id}`;

    const discountPercentage = p.discountPercentage || 0;
    const price = Number(p.price);
    const mrp = discountPercentage > 0
      ? Number((price / (1 - discountPercentage / 100)).toFixed(2))
      : price;

    const primaryImage = p.thumbnail || (p.images && p.images[0]) || '';
    const imagesList = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (primaryImage ? [primaryImage] : []);

    const reviews = Array.isArray(p.reviews)
      ? p.reviews.map((r) => ({
          rating: Number(r.rating) || 5,
          comment: r.comment || '',
          date: r.date ? new Date(r.date) : new Date(),
          reviewerName: r.reviewerName || 'Verified Buyer',
          reviewerEmail: r.reviewerEmail || '',
        }))
      : [];

    const specs = {
      Category: p.category || 'General',
      Brand: p.brand || 'ShopNest Curated',
      SKU: p.sku || `SKU-${p.id}`,
      Weight: p.weight ? `${p.weight} kg` : 'Standard',
      Dimensions: p.dimensions
        ? `${p.dimensions.width} x ${p.dimensions.height} x ${p.dimensions.depth} cm`
        : 'Standard',
      Warranty: p.warrantyInformation || '1 Year Manufacturer Warranty',
      Shipping: p.shippingInformation || 'Ships in 3-5 business days',
      'Return Policy': p.returnPolicy || '30 days return policy',
      'Min Order Qty': String(p.minimumOrderQuantity || 1),
    };

    return {
      dummyJsonId: p.id,
      name: title,
      title: title,
      slug: slug,
      description: p.description || 'Premium curated item featuring top-grade quality and design.',
      category: p.category || 'general',
      price: price,
      discountPercentage: discountPercentage,
      mrp: mrp,
      originalPrice: mrp,
      rating: Number(p.rating) || 0,
      stock: Number(p.stock) || 0,
      inStock: (Number(p.stock) || 0) > 0,
      tags: Array.isArray(p.tags) ? p.tags : [],
      brand: p.brand || 'ShopNest Curated',
      sku: p.sku || `SKU-${p.id}`,
      weight: Number(p.weight) || 0,
      dimensions: p.dimensions || { width: 0, height: 0, depth: 0 },
      warrantyInformation: p.warrantyInformation || '1 Year Brand Warranty',
      shippingInformation: p.shippingInformation || 'Ships in 3-5 business days',
      availabilityStatus: p.availabilityStatus || (p.stock > 0 ? 'In Stock' : 'Out of Stock'),
      reviews: reviews,
      numReviews: reviews.length || 0,
      returnPolicy: p.returnPolicy || '30 days return policy',
      minimumOrderQuantity: Number(p.minimumOrderQuantity) || 1,
      meta: p.meta || {},
      image: primaryImage,
      thumbnail: primaryImage,
      images: imagesList,
      colors: ['#171613', '#64748b', '#cbd5e1'],
      specs: specs,
      isFeatured: (Number(p.rating) >= 4.5) || [1, 2, 5, 8, 12, 16, 20, 24, 30].includes(p.id),
    };
  });

  // 4. Bulk insert
  console.log(`[Seed] Inserting ${transformedProducts.length} products into MongoDB...`);
  const inserted = await Product.insertMany(transformedProducts);
  console.log(`[Seed] Successfully inserted ${inserted.length} products into MongoDB!`);

  // 5. Verification
  const totalInDb = await Product.countDocuments();
  const distinctCategories = await Product.distinct('category');
  console.log(`[Seed] Verification: Total products now in database: ${totalInDb}`);
  console.log(`[Seed] Distinct categories (${distinctCategories.length}):`, distinctCategories);

  await mongoose.disconnect();
  console.log('[Seed] Disconnected from MongoDB. Seeding completed successfully!');
  console.log('--------------------------------------------------');
}

seedDummyJsonProducts().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
