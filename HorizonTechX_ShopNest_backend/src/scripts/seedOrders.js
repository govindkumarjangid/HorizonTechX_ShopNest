import dns from 'dns';
import mongoose from 'mongoose';
import env from '../config/env.config.js';
import { User } from '../models/User.model.js';
import { Order } from '../models/Order.model.js';
import Product from '../models/Product.model.js';

if (env.MONGO_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (dnsErr) {
    console.warn('[MongoDB] DNS warning:', dnsErr.message);
  }
}

async function seedOrders() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGO_URI, { dbName: 'shopnest' });

  const user = await User.findOne({ email: 'testuser@shopnest.com' });
  if (!user) {
    console.error('Test user not found');
    process.exit(1);
  }

  // Get 2 sample products
  const products = await Product.find().limit(5);
  const p1 = products[0] || {
    _id: new mongoose.Types.ObjectId(),
    name: 'Aura Studio Wireless Reference Headphones',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  };
  const p2 = products[1] || {
    _id: new mongoose.Types.ObjectId(),
    name: 'Horizon Stealth Mechanical Keyboard (CNC Aluminum)',
    price: 16499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  };

  // Remove existing orders for clean test
  await Order.deleteMany({ user: user._id });

  // Order 1: Live In-Transit Order (Shipped)
  const order1 = new Order({
    orderId: 'ORD-78241',
    user: user._id,
    items: [
      {
        product: p1._id,
        title: p1.name || p1.title,
        price: p1.price || 24999,
        quantity: 1,
        image: p1.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: user.name || 'ShopNest Member',
      phone: user.phone || '9876543210',
      street: '402, Skyline Residency, Bandra West',
      landmark: 'Near Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    statusStep: 2,
    trackingNumber: 'SN-EXP-982412-IN',
    subtotal: p1.price || 24999,
    shippingFee: 0,
    tax: 0,
    total: p1.price || 24999,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  });

  // Order 2: Delivered Order
  const order2 = new Order({
    orderId: 'ORD-65103',
    user: user._id,
    items: [
      {
        product: p2._id,
        title: p2.name || p2.title,
        price: p2.price || 16499,
        quantity: 1,
        image: p2.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: user.name || 'ShopNest Member',
      phone: user.phone || '9876543210',
      street: '402, Skyline Residency, Bandra West',
      landmark: 'Near Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    statusStep: 3,
    trackingNumber: 'SN-EXP-651038-IN',
    subtotal: p2.price || 16499,
    shippingFee: 0,
    tax: 0,
    total: p2.price || 16499,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  });

  await order1.save();
  await order2.save();

  console.log('✅ Seeded 2 real orders for testuser@shopnest.com:');
  console.log('   1. ORD-78241 (Shipped / In Transit - Step 2)');
  console.log('   2. ORD-65103 (Delivered - Step 3)');

  await mongoose.disconnect();
}

seedOrders().catch((err) => {
  console.error('Seed orders error:', err);
  process.exit(1);
});
