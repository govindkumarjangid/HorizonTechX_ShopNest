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
  Sparkles,
} from 'lucide-react';
import { H1, Button, Badge, Rating } from '../../components/ui';
import { ProductGallery } from '../../components/products/ProductGallery';
import { RelatedProducts } from '../../components/products/RelatedProducts';
import { formatPrice } from '../../utils/formatPrice';
import { useCartStore } from '../../store/useCartStore';
import { products } from '../../assets/assets';
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

  // Resolve product by route param ID, prop, or fallback
  const product =
    (id ? products.find((p) => p.id === id) : null) ||
    propProduct ||
    products[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#171613');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'materials' | 'shipping'
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Monitor scroll for mobile sticky Add to Cart bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product, quantity);
      notify.success(`${product.title} (${quantity}) added to your bag!`);
    } else {
      notify.error('This instrument is currently awaiting new batch fabrication');
    }
  };

  const handleToggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (onAddToWishlist) onAddToWishlist(product);
    if (nextState) {
      notify.success(`${product.title} saved to your Wishlist`);
    } else {
      notify.info(`${product.title} removed from Wishlist`);
    }
  };

  const handleCatalogClick = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    else navigate('/shop');
  };

  const handleSelectRelated = (relatedProd) => {
    if (onSelectProduct) onSelectProduct(relatedProd);
    navigate(`/product/${relatedProd.id}`);
  };

  const tabs = [
    { id: 'specs', label: 'Technical Specifications' },
    { id: 'materials', label: 'Material Science & Ethics' },
    { id: 'shipping', label: 'Concierge Delivery' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex flex-col gap-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="hover:text-brand-500 cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <button
          type="button"
          onClick={handleCatalogClick}
          className="hover:text-brand-500 cursor-pointer"
        >
          Catalog
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-400">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Interactive Touch & Zoom Gallery */}
        <div className="lg:col-span-7 w-full">
          <ProductGallery
            images={product.gallery || [product.image]}
            title={product.title}
          />
        </div>

        {/* Right: Purchase Controls & Product Specifications */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Header Badges & Title */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Badge variant={product.inStock ? 'brand' : 'outOfStock'} size="sm">
                {product.inStock ? 'In Stock • Immediate Dispatch' : 'Sold Out'}
              </Badge>
              {product.badgeText && (
                <Badge variant={product.badgeVariant || 'neutral'} size="sm">
                  {product.badgeText}
                </Badge>
              )}
            </div>

            <H1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {product.title}
            </H1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 pt-1">
              <Rating rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
              <span className="text-xs text-neutral-400 font-mono">
                SKU: {product.id.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-extrabold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
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
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center border border-neutral-200 dark:border-dark-border rounded-xl bg-neutral-50 dark:bg-dark-surface p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer disabled:opacity-30"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-bold text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:text-brand-500 cursor-pointer"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              leftIcon={ShoppingBag}
              className="flex-1 shadow-elevated cursor-pointer"
            >
              {product.inStock ? `Add to Bag • ${formatPrice(product.price * quantity)}` : 'Sold Out'}
            </Button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleWishlist}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-brand-500 text-brand-500' : 'text-neutral-500'}`} />
            </motion.button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500" />
              <span>Complimentary Courier</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>2-Year Full Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <span>30-Day Studio Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Hand-Calibrated Unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Tabs */}
      <div className="w-full bg-white dark:bg-dark-card rounded-3xl border border-neutral-200/80 dark:border-dark-border p-6 sm:p-10 shadow-subtle">
        {/* Tab Header Buttons */}
        <div className="flex items-center gap-4 sm:gap-8 border-b border-neutral-200 dark:border-dark-border pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                text-sm font-semibold whitespace-nowrap transition-colors relative pb-2 cursor-pointer
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
        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.specs ? (
                Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={idx} className="flex flex-col gap-1 p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border">
                    <span className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500">Standard aerospace specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
              <p>
                Machined exclusively from solid monolithic blocks of 6063 aerospace aluminum, utilizing 5-axis CNC high-precision mills with tolerance boundaries beneath 0.02mm.
              </p>
              <p>
                Anodized utilizing closed-loop sulfur electrolyte tanks to minimize environmental effluent. All internal PCB solder tracks incorporate 100% lead-free, RoHS-compliant silver composite alloy.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
              <p>
                Orders placed before 2:00 PM IST are manifested for guaranteed same-day dispatch via BlueDart Air Express or Delhivery Direct Cargo.
              </p>
              <p>
                Every hardware shipment is insured up to 100% of transit valuation against courier loss or optical transit vibration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel Section */}
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
        onSelectProduct={handleSelectRelated}
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
                {product.title}
              </span>
              <span className="font-mono text-xs font-bold text-brand-500">
                {formatPrice(product.price)}
              </span>
            </div>

            <Button
              size="sm"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              leftIcon={ShoppingBag}
              className="shrink-0 cursor-pointer"
            >
              {product.inStock ? 'Add to Bag' : 'Sold Out'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
