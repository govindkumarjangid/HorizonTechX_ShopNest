import User from '../models/User.model.js';

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findByEmail = async (email, selectPassword = false) => {
  const query = User.findOne({ email: email.toLowerCase().trim() });
  if (selectPassword)
    query.select('+password +refreshToken');
  return await query.exec();
};

export const findById = async (id, selectRefreshToken = false) => {
  const query = User.findById(id).populate('wishlist');
  if (selectRefreshToken)
    query.select('+refreshToken');
  return await query.exec();
};

export const updateById = async (id, updateData) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('wishlist');
};

export const updateRefreshToken = async (id, refreshToken) => {
  return await User.findByIdAndUpdate(id, { $set: { refreshToken } });
};

export const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (addressData.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();
  return user;
};

export const removeAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.addresses.pull({ _id: addressId });
  await user.save();
  return user;
};

export const setDefaultAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });

  await user.save();
  return user;
};

export const toggleWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const prodIndex = user.wishlist.findIndex(
    (item) => item.toString() === productId.toString()
  );

  if (prodIndex > -1) user.wishlist.splice(prodIndex, 1);
  else user.wishlist.push(productId);

  await user.save();
  await user.populate('wishlist');
  return user;
};

export default {
  createUser,
  findByEmail,
  findById,
  updateById,
  updateRefreshToken,
  addAddress,
  removeAddress,
  setDefaultAddress,
  toggleWishlist,
};
