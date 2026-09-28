import dns from 'dns';
import mongoose from 'mongoose';
import env from '../config/env.config.js';
import Product from '../models/Product.model.js';

// Resolve MongoDB Atlas SRV query errors on Windows environments
if (env.MONGO_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (dnsErr) {
    console.warn('[MongoDB] Warning: Could not override DNS servers:', dnsErr.message);
  }
}

/**
 * HorizonTechX ShopNest - Product Seeder
 * Fetches 100 products from DummyJSON, converts USD to INR (₹),
 * calculates realistic MRP based on discount percentage,
 * generates unique SEO slugs, and seeds MongoDB.
 */
export async function seedProducts() {
  console.log('====================================================');
  console.log('🌱 Starting HorizonTechX ShopNest Product Seeding...');
  console.log(`📡 Connecting to MongoDB URI: ${env.MONGO_URI}`);

  try {
    await mongoose.connect(env.MONGO_URI, { dbName: 'shopnest' });
    console.log('✅ Connected to MongoDB successfully.');

    console.log('🌐 Fetching 100 next-generation e-commerce products from DummyJSON API (skip=77)...');
    const response = await fetch('https://dummyjson.com/products?limit=100&skip=77');

    if (!response.ok) {
      throw new Error(`Failed to fetch from DummyJSON: ${response.status} ${response.statusText}`);
    }

    const { products } = await response.json();
    console.log(`📦 Retrieved ${products.length} products from DummyJSON.`);

    // Map into ShopNest Indian Rupee (INR) schema
    const docs = products.map((p) => {
      const discount = p.discountPercentage || 12;
      const inrPrice = Math.round(p.price * 83); // USD -> INR @ ₹83
      const inrMrp = Math.round((p.price * 83) / (1 - discount / 100));
      const cleanSlug = `${p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}-${p.id}`;

      return {
        name: p.title,
        slug: cleanSlug,
        description: p.description,
        price: inrPrice,
        mrp: inrMrp,
        category: p.category,
        brand: p.brand || 'ShopNest Curated',
        stock: p.stock !== undefined ? p.stock : 25,
        rating: p.rating || 4.2,
        numReviews: Math.floor(15 + Math.random() * 200),
        image: p.thumbnail,
        images: p.images && p.images.length > 0 ? p.images : [p.thumbnail],
        isFeatured: p.rating >= 4.5,
        inStock: (p.stock !== undefined ? p.stock : 25) > 0,
      };
    });

    console.log('🧹 Purging existing products in collection...');
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Removed ${deleteResult.deletedCount} existing documents.`);

    console.log('📥 Inserting converted Indian Rupee products...');
    const inserted = await Product.insertMany(docs);
    console.log(`🎉 SUCCESS: ${inserted.length} precision products seeded into MongoDB!`);

    // Output category breakdown
    const distinctCategories = [...new Set(docs.map((d) => d.category))];
    console.log(`🏷️  Seeded ${distinctCategories.length} distinct categories:`);
    console.log(`   ${distinctCategories.slice(0, 10).join(', ')}...`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB cleanly.');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

// Execute immediately when run directly
seedProducts();
