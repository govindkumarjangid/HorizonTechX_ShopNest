import Product from '../models/Product.model.js';

export const findProducts = async ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 12 }) => {
  return await Product.find(filter).sort(sort).skip(skip).limit(limit).lean();
};

export const countProducts = async (filter = {}) => {
  return await Product.countDocuments(filter);
};

export const findById = async (id) => {
  return await Product.findById(id);
};

export const findBySlug = async (slug) => {
  return await Product.findOne({ slug });
};

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const updateById = async (id, updateData) => {
  return await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const findFeatured = async (limit = 8) => {
  return await Product.find({ isFeatured: true }).limit(limit).lean();
};

export const getDistinctCategories = async () => {
  return await Product.distinct('category');
};

export const bulkInsert = async (docs) => {
  return await Product.insertMany(docs);
};

export const deleteAll = async () => {
  return await Product.deleteMany({});
};

export default {
  findProducts,
  countProducts,
  findById,
  findBySlug,
  createProduct,
  updateById,
  deleteById,
  findFeatured,
  getDistinctCategories,
  bulkInsert,
  deleteAll,
};
