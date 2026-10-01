import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Award,
} from 'lucide-react';
import { H1, Button, Badge, Rating, Skeleton } from '../../components/ui';
import { ProductGallery } from '../../components/products/ProductGallery';
import { RelatedProducts } from '../../components/products/RelatedProducts';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { productApi } from '../../api/productApi';
import { notify } from '../../utils/notify';


export const ProductDetails = ({
  product: propProduct,
  onAddToWishlist,
  onNavigateToCatalog,
  onSelectProduct,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(propProduct || null);
  const [loading, setLoading] = useState(!propProduct);

  const { products: storeProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    if (!storeProducts || storeProducts.length === 0) {
      fetchProducts({ limit: 8 });
    }
  }, [storeProducts, fetchProducts]);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id) {
      const matchInStore = storeProducts.find((p) => (p._id || p.id) === id || p.slug === id);
      if (matchInStore) {
        setProductData(matchInStore);
        setLoading(false);
      } else {
        setLoading(true);
      }

      productApi.getProductById(id)
        .then((res) => {
          if (isMounted && res?.data) {
            setProductData(res.data);
          }
        })
        .catch(() => {
          // If not mongo ID, try by slug
          productApi.getProductBySlug(id)
            .then((res) => {
              if (isMounted && res?.data) setProductData(res.data);
            })
            .catch((err) => {
              console.error('Failed to load product from API:', err);
            });
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id, storeProducts]);

  // Normalized product object
  const product = productData || propProduct || storeProducts[0] || {
    id: id || 'loading',
    _id: id || 'loading',
    title: 'Curated Product',
    name: 'Curated Product',
    price: 0,
    mrp: 0,
    category: 'Electronics',
    description: 'Loading product specifications...',
    inStock: true,
    rating: 4.8,
    numReviews: 84,
    images: [],
    image: '',
  };

  const resolvedId = product._id || product.id;
  const resolvedTitle = product.name || product.title;
  const resolvedPrice = Number(product.price) || 0;
  const resolvedOriginalPrice = product.mrp || product.originalPrice;
  const resolvedGallery = product.images && product.images.length > 0 ? product.images : [product.image || ''];
  const resolvedInStock = product.inStock !== undefined ? product.inStock : (product.stock > 0);
  const resolvedRating = product.rating || 4.8;
  const resolvedReviews = product.numReviews || product.reviewsCount || 64;
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'materials' | 'shipping'
  const [showStickyBar, setShowStickyBar] = useState(false);
  const toggleWishlist = useAuthStore((state) => state.toggleWishlist);
  const isWishlisted = useAuthStore((state) => {
    if (!resolvedId) return false;
    const targetStr = String(resolvedId);
    return (state.wishlist || []).some((item) => {
      const itemId = typeof item === 'object' ? (item._id || item.id) : item;
      return itemId !== undefined && itemId !== null && String(itemId) === targetStr;
    });
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch category-specific related products with real images
  useEffect(() => {
    let isCurrent = true;
    if (product.category && product.category !== 'Electronics') {
      productApi.getProducts({ category: product.category, limit: 10 })
        .then((res) => {
          if (!isCurrent) return;
          const prods = (res.data?.products || []).filter((p) => (p._id || p.id) !== resolvedId);
          setRelatedProducts(prods);
        })
        .catch(() => {
          if (isCurrent) setRelatedProducts([]);
        });
    }
    return () => {
      isCurrent = false;
    };
  }, [product.category, resolvedId]);

  const addItem = useCartStore((state) => state.addItem);

  // Monitor scroll for mobile sticky Add to Cart bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!resolvedInStock) {
      notify.error('This product is currently out of stock');
      return;
    }
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      notify.success(`${resolvedTitle} (${quantity}) added to your bag!`);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleToggleWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product);
    } else {
      toggleWishlist(product);
    }
    if (!isWishlisted) {
      notify.success(`${resolvedTitle} saved to your Wishlist`);
    } else {
      notify.info(`${resolvedTitle} removed from Wishlist`);
    }
  };

  const handleCatalogClick = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    else navigate('/shop');
  };

  const handleSelectRelated = (relatedProd) => {
    if (onSelectProduct) onSelectProduct(relatedProd);
    const relId = typeof relatedProd === 'string' ? relatedProd : (relatedProd?._id || relatedProd?.id);
    if (relId) {
      navigate(`/product/${relId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviews?.length || resolvedReviews})` },
    { id: 'shipping', label: 'Shipping & Warranty' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-10 w-full flex flex-col gap-8 sm:gap-14">
      {/* Breadcrumb Navigation - Strictly 1 line on mobile */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 max-w-full">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="hover:text-brand-500 cursor-pointer shrink-0"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <button
          type="button"
          onClick={handleCatalogClick}
          className="hover:text-brand-500 cursor-pointer shrink-0"
        >
          Catalog
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-400 max-w-27.5 truncate shrink-0 capitalize">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 dark:text-white font-medium truncate max-w-35 sm:max-w-65 shrink-0">
          {resolvedTitle}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Interactive Touch & Zoom Gallery */}
        <div className="lg:col-span-7 w-full">
          <ProductGallery
            images={resolvedGallery}
            title={resolvedTitle}
          />
        </div>

        {/* Right: Purchase Controls & Product Specifications */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 lg:self-start flex flex-col gap-6 w-full">
          {/* Header Badges & Title */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Badge variant={resolvedInStock ? 'brand' : 'outOfStock'} size="sm">
                {resolvedInStock ? 'In Stock • Immediate Dispatch' : 'Sold Out'}
              </Badge>
              {product.badgeText && (
                <Badge variant={product.badgeVariant || 'neutral'} size="sm">
                  {product.badgeText}
                </Badge>
              )}
            </div>

            <H1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {resolvedTitle}
            </H1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 pt-1">
              <Rating rating={resolvedRating} reviewsCount={resolvedReviews} size="sm" />
              <span className="text-xs text-neutral-400 font-mono">
                SKU: {String(resolvedId).slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-neutral-900 dark:text-white">
              {formatPrice(resolvedPrice)}
            </span>
            {resolvedOriginalPrice && resolvedOriginalPrice > resolvedPrice && (
              <span className="font-mono text-sm text-neutral-400 line-through">
                {formatPrice(resolvedOriginalPrice)}
              </span>
            )}
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Includes 18% GST & Air Shipping
            </span>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {product.description}
          </p>


          {/* Quantity Stepper & Main Action Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-4">
            <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-xl bg-neutral-50 dark:bg-dark-surface p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer disabled:opacity-30"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 sm:w-8 text-center font-mono font-bold text-xs sm:text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              disabled={!product.inStock || isAdding}
              isLoading={isAdding}
              loadingText="Adding to Bag..."
              onClick={handleAddToCart}
              leftIcon={ShoppingBag}
              className="flex-1 shadow-elevated cursor-pointer min-w-0"
            >
              <span className="truncate">
                {product.inStock ? `Add to Bag • ${formatPrice(resolvedPrice * quantity)}` : 'Sold Out'}
              </span>
            </Button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleWishlist}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-150 cursor-pointer shrink-0 ${
                isWishlisted
                  ? 'border-brand-300 dark:border-brand-700 bg-brand-50/90 dark:bg-brand-950/60 text-brand-500 shadow-xs'
                  : 'border-neutral-200 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-card text-neutral-500'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-brand-500 text-brand-500' : 'text-neutral-500'}`} />
            </motion.button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">2-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">30-Day Easy Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">100% Genuine Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Tabs */}
      <div className="w-full bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl border border-neutral-200/80 dark:border-dark-border p-4 sm:p-8 shadow-subtle">
        {/* Tab Header Buttons */}
        <div className="flex items-center gap-4 sm:gap-8 border-b border-neutral-200 dark:border-dark-border pb-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors relative pb-2 cursor-pointer
                ${activeTab === tab.id ? 'text-brand-500' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="py-5">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              <div className="flex flex-col gap-1 p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 font-bold">Category</span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white capitalize">{product.category}</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 font-bold">Brand</span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">{product.brand || 'ShopNest Curated'}</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 font-bold">Stock Status</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">{resolvedInStock ? 'In Stock (Ready to Dispatch)' : 'Out of Stock'}</span>
              </div>
              {product.specs && Object.entries(product.specs).map(([key, value], idx) => (
                <div key={idx} className="flex flex-col gap-1 p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 font-bold">
                    {key}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-4 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                <div className="flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-dark-card border border-neutral-200/60 dark:border-dark-border shrink-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-none">
                    {Number(resolvedRating).toFixed(1)}
                  </span>
                  <div className="flex flex-col items-center gap-1">
                    <Rating rating={resolvedRating} size="sm" showScore={false} showValue={false} />
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {product.reviews?.length || resolvedReviews} reviews
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Verified Customer Feedback</p>
                  <p className="leading-relaxed">All reviews are submitted by authenticated buyers following delivered purchases.</p>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {product.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-neutral-900 dark:text-white">
                          {rev.reviewerName || 'Verified Buyer'}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {rev.date ? new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      <Rating rating={rev.rating || 5} size="xs" showScore={false} showValue={false} />
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 py-4">No customer reviews yet for this product.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Shipping Info</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{product.shippingInformation || 'Ships in 3-5 business days'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Warranty</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{product.warrantyInformation || '1 Year Manufacturer Warranty'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Return Policy</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{product.returnPolicy || '30 days return policy'}</span>
                </div>
              </div>
              <p>
                All orders are packaged in tamper-evident secure boxes and dispatched with comprehensive transit insurance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel Section */}
      <RelatedProducts
        products={relatedProducts.length > 0 ? relatedProducts : storeProducts}
        currentProductId={resolvedId}
        category={product.category}
        onSelectProduct={handleSelectRelated}
        onQuickView={handleSelectRelated}
        onClick={handleSelectRelated}
        onAddToCart={addItem}
        onAddToWishlist={handleToggleWishlist}
      />

      {/* Mobile Sticky Add-to-Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="
              fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-0 inset-x-0 z-30 lg:hidden
              bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md
              border-t border-neutral-200 dark:border-dark-border
              p-3 px-4 shadow-elevated flex items-center justify-between gap-4
            "
          >
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                {resolvedTitle}
              </span>
              <span className="font-mono text-xs font-bold text-brand-500">
                {formatPrice(resolvedPrice)}
              </span>
            </div>

            <Button
              size="sm"
              disabled={!resolvedInStock || isAdding}
              isLoading={isAdding}
              loadingText="Adding..."
              onClick={handleAddToCart}
              leftIcon={ShoppingBag}
              className="shrink-0 cursor-pointer"
            >
              {resolvedInStock ? 'Add to Bag' : 'Sold Out'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
