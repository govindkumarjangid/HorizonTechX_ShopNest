import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reviewerName: {
      type: String,
      trim: true,
      default: 'Verified Customer',
    },
    reviewerEmail: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const dimensionsSchema = new mongoose.Schema(
  {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    depth: { type: Number, default: 0 },
  },
  { _id: false }
);

const metaSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: { type: String, default: '' },
    qrCode: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    dummyJsonId: {
      type: Number,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100'],
    },
    mrp: {
      type: Number,
      required: [true, 'Product MRP / original price is required'],
      min: [0, 'MRP cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      default: 'ShopNest Curated',
      index: true,
    },
    sku: {
      type: String,
      trim: true,
      index: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    dimensions: {
      type: dimensionsSchema,
      default: () => ({ width: 0, height: 0, depth: 0 }),
    },
    warrantyInformation: {
      type: String,
      trim: true,
      default: '1 Year Brand Warranty',
    },
    shippingInformation: {
      type: String,
      trim: true,
      default: 'Ships in 3-5 business days',
    },
    availabilityStatus: {
      type: String,
      trim: true,
      default: 'In Stock',
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    returnPolicy: {
      type: String,
      trim: true,
      default: '30 days return policy',
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
    },
    meta: {
      type: metaSchema,
      default: () => ({}),
    },
    image: {
      type: String,
      required: [true, 'Primary image thumbnail is required'],
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: ['#171613', '#64748b', '#cbd5e1'],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slugify, title/name sync, MRP sync, and stock sync pre-save hook
productSchema.pre('save', function () {
  if (!this.title && this.name) this.title = this.name;
  if (!this.name && this.title) this.name = this.title;

  if (this.isModified('name') || this.isModified('title') || !this.slug) {
    const baseSlug = (this.name || this.title || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.slug = this.dummyJsonId ? `${baseSlug}-${this.dummyJsonId}` : baseSlug;
  }

  if (!this.mrp) {
    const discount = this.discountPercentage || 0;
    this.mrp = discount > 0 ? Number((this.price / (1 - discount / 100)).toFixed(2)) : this.price;
  }
  if (!this.originalPrice) {
    this.originalPrice = this.mrp;
  }

  if (!this.image) {
    this.image = this.thumbnail || (this.images && this.images[0]) || '';
  }
  if (!this.thumbnail) {
    this.thumbnail = this.image;
  }

  if (Array.isArray(this.reviews)) {
    this.numReviews = this.reviews.length;
  }

  this.inStock = this.stock > 0;
  this.availabilityStatus = this.stock > 0 ? (this.stock < 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock';
});

// Full-text search index
productSchema.index({
  name: 'text',
  title: 'text',
  description: 'text',
  brand: 'text',
  category: 'text',
  tags: 'text',
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
