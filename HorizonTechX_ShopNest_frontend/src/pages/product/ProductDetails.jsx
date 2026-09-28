import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Award,
} from 'lucide-react';
import { H1, Button, Badge, Rating, Skeleton } from '../../components/ui';
import { ProductGallery } from '../../components/products/ProductGallery';
import { RelatedProducts } from '../../components/products/RelatedProducts';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';
import { productApi } from '../../api/productApi';
import { notify } from '../../utils/notify';

/**
 * Product Detail Page (PDP)
 * Features mobile sticky bottom action bar, variant swatches, technical tabs, and touch gallery
 */
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

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#171613');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'materials' | 'shipping'
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (onAddToWishlist) onAddToWishlist(product);
    if (nextState) {
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
    { id: 'materials', label: 'Product Details' },
    { id: 'shipping', label: 'Shipping & Returns' },
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
        <span className="text-neutral-400 max-w-[110px] truncate shrink-0 capitalize">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[140px] sm:max-w-[260px] shrink-0">
          {resolvedTitle}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Interactive Touch & Zoom Gallery */}
        <div className="lg:col-span-7 w-full">
          <ProductGallery
            images={resolvedGallery}
            title={resolvedTitle}
          />
        </div>

        {/* Right: Purchase Controls & Product Specifications */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
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

          {/* Variant Swatches (Colors) */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Finish & Anodization:
              </span>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-7 h-7 rounded-full transition-transform cursor-pointer relative
                      ${selectedColor === color ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-dark-bg scale-110' : 'hover:scale-105'}
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {selectedColor === color && (
                      <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Main Action Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-4">
            <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-xl bg-neutral-50 dark:bg-dark-surface p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer disabled:opacity-30"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-7 sm:w-8 text-center font-mono font-bold text-xs sm:text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer"
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
              className="p-3 sm:p-3.5 rounded-xl border border-neutral-200 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors cursor-pointer shrink-0"
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

          {activeTab === 'materials' && (
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
              <p>
                Crafted using premium high-grade materials with rigorous quality standards, engineered for durability, reliability, and modern lifestyle aesthetics.
              </p>
              <p>
                100% compliant with standard global safety, RoHS, and consumer electronics environmental standards. Each piece passes comprehensive quality assurance checks before shipment.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
              <p>
                Orders placed before 2:00 PM IST are processed for guaranteed same-day dispatch via BlueDart Air Express or Delhivery with real-time tracking.
              </p>
              <p>
                All shipments are fully insured during transit with tamper-evident premium packaging and easy 30-day hassle-free returns.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel Section */}
      <RelatedProducts
        products={storeProducts}
        currentProductId={resolvedId}
        category={product.category}
        onSelectProduct={handleSelectRelated}
        onQuickView={handleSelectRelated}
        onClick={handleSelectRelated}
        onAddToCart={addItem}
      />

      {/* Mobile Sticky Add-to-Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="
              fixed bottom-16 sm:bottom-0 inset-x-0 z-30 lg:hidden
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
