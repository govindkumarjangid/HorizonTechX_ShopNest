import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.config.js';
import { User } from '../models/User.model.js';

if (env.MONGO_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (dnsErr) {
    console.warn('[MongoDB] DNS warning:', dnsErr.message);
  }
}

async function seedUser() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.MONGO_URI, { dbName: 'shopnest' });
  console.log('Connected to MongoDB.');

  const email = 'testuser@shopnest.com';
  const plainPassword = 'Password@123';

  // Check if exists
  let user = await User.findOne({ email });

  if (user) {
    console.log('Existing user found, resetting password and profile...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    user.name = 'ShopNest Member';
    user.password = hashedPassword;
    user.phone = '9876543210';
    user.city = 'Mumbai';
    user.role = 'customer';
    user.addresses = [
      {
        type: 'Home',
        fullName: 'ShopNest Member',
        phone: '9876543210',
        street: '402, Skyline Residency, Bandra West',
        landmark: 'Near Linking Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        isDefault: true,
      },
    ];

    await User.findByIdAndUpdate(user._id, {
      name: user.name,
      password: hashedPassword,
      phone: user.phone,
      city: user.city,
      role: 'customer',
      addresses: user.addresses,
    });
    console.log('✅ User updated successfully.');
  } else {
    user = new User({
      name: 'ShopNest Member',
      email: email,
      password: plainPassword, // pre-save will hash
      phone: '9876543210',
      city: 'Mumbai',
      role: 'customer',
      addresses: [
        {
          type: 'Home',
          fullName: 'ShopNest Member',
          phone: '9876543210',
          street: '402, Skyline Residency, Bandra West',
          landmark: 'Near Linking Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true,
        },
      ],
    });
    await user.save();
    console.log('✅ User created successfully.');
  }

  // Verify login functionality
  const check = await User.findOne({ email }).select('+password');
  const valid = await check.isPasswordCorrect(plainPassword);
  console.log('Credentials verification:', valid ? 'PASSED ✅' : 'FAILED ❌');
  console.log('-------------------------------------------');
  console.log('TEST USER CREDENTIALS:');
  console.log('Email:    ' + email);
  console.log('Password: ' + plainPassword);
  console.log('Name:     ' + check.name);
  console.log('-------------------------------------------');

  await mongoose.disconnect();
}

seedUser().catch((err) => {
  console.error('Seed user error:', err);
  process.exit(1);
});
