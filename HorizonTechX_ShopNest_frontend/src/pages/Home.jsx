import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import {
  ArrowRight,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  Star,
  Flame,
  LayoutGrid,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  H1,
  H2,
  Subtitle,
  Button,
  ProductCard,
  Badge,
  SectionHeader,
  TestimonialCard,
  ProgressiveImage,
  ProductCardSkeleton,
} from '../components/ui';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
} from '../styles/motion';
import {
  bentoCollections,
  testimonials,
  trustPerks,
  products as defaultCatalogProducts,
} from '../assets/assets';
import { notify } from '../utils/notify';
import { formatPrice } from '../utils/formatPrice';
import { CountdownTimer } from '../components/home/CountdownTimer';
import { StatCounter } from '../components/home/StatCounter';
import { MarqueeStrip } from '../components/home/MarqueeStrip';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { productApi } from '../api/productApi';

export const Home = ({
  onAddToCart,
  onAddToWishlist,
  onNavigateToCatalog,
  onNavigateToProduct,
}) => {
  const navigate = useNavigate();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [archiveProducts, setArchiveProducts] = useState([]);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const {
    products,
    categories,
    featuredProducts,
    fetchProducts,
    fetchCategories,
    fetchFeaturedProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts({ limit: 12 });
    fetchCategories();
    fetchFeaturedProducts(4);
  }, [fetchProducts, fetchCategories, fetchFeaturedProducts]);

  // Dynamically load products whenever the category filter tab changes
  useEffect(() => {
    let isCurrent = true;
    setIsArchiveLoading(true);

    const params = {
      limit: 8,
      ...(activeCategoryFilter !== 'all' ? { category: activeCategoryFilter } : {}),
    };

    productApi
      .getProducts(params)
      .then((res) => {
        if (!isCurrent) return;
        setArchiveProducts(res.data?.products || []);
      })
      .catch((err) => {
        console.error('[Home] Failed to load category products:', err);
        if (isCurrent) setArchiveProducts([]);
      })
      .finally(() => {
        if (isCurrent) setIsArchiveLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeCategoryFilter]);

  const flagshipProduct =
    products.find(
      (p) =>
        (p.image || p.images?.[0]) &&
        (['audio', 'laptops', 'mens-watches', 'womens-watches', 'mobile-accessories', 'smartphones', 'tablets'].includes(p.category) ||
          /headphone|audio|sound|watch|airpod|laptop|keyboard|speaker|phone|tab|ipad|macbook|galaxy|rolex|iwc/i.test(p.name || p.title))
    ) ||
    featuredProducts.find(
      (p) =>
        (p.image || p.images?.[0]) &&
        (['audio', 'laptops', 'mens-watches', 'womens-watches', 'mobile-accessories', 'smartphones', 'tablets'].includes(p.category) ||
          /headphone|audio|sound|watch|airpod|laptop|keyboard|speaker|phone|tab|ipad|macbook|galaxy|rolex|iwc/i.test(p.name || p.title))
    ) ||
    archiveProducts.find(
      (p) =>
        (p.image || p.images?.[0]) &&
        (['audio', 'laptops', 'mens-watches', 'womens-watches', 'mobile-accessories', 'smartphones', 'tablets'].includes(p.category) ||
          /headphone|audio|sound|watch|airpod|laptop|keyboard|speaker|phone|tab|ipad|macbook|galaxy|rolex|iwc/i.test(p.name || p.title))
    ) ||
    products.find((p) => p.image || p.images?.[0]) ||
    featuredProducts.find((p) => p.image || p.images?.[0]) ||
    defaultCatalogProducts[0] || {};

  // New arrivals
  const newArrivals =
    products.length > 0
      ? products.slice(0, 4)
      : featuredProducts.length > 0
        ? featuredProducts.slice(0, 4)
        : defaultCatalogProducts.slice(0, 4);

  // Effective archive products for Featured & Trending section
  const effectiveArchiveProducts =
    archiveProducts.length > 0
      ? archiveProducts
      : activeCategoryFilter === 'all'
        ? products.length > 0
          ? products.slice(0, 8)
          : defaultCatalogProducts.slice(0, 8)
        : defaultCatalogProducts.filter(
          (p) => p.categorySlug?.toLowerCase() === activeCategoryFilter.toLowerCase()
        );

  // Dynamic filter tabs from real categories
  const filterTabs = [
    { label: 'All Products', value: 'all' },
    ...categories.slice(0, 8).map((cat) => ({
      label: cat.name || cat,
      value: cat.slug || cat,
    })),
  ];

  const filterScrollRef = useRef(null);

  const scrollFilters = (direction) => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      filterScrollRef.current.scrollLeft += scrollAmount;
    }
  };

  const handleCatalogNavigate = (link) => {
    if (typeof link === 'string' && link.startsWith('/')) {
      navigate(link);
    } else if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      navigate('/shop');
    }
  };

  const handleProductNavigate = (prod) => {
    if (!prod) return;
    const prodId = prod._id || prod.id;
    if (onNavigateToProduct) onNavigateToProduct(prod);
    navigate(`/product/${prodId}`);
  };

  const handleAddToCart = (prod) => {
    if (onAddToCart) {
      onAddToCart(prod);
    } else {
      useCartStore.getState().addItem(prod, 1);
    }
    const title = prod.name || prod.title || 'Product';
    notify.success(`${title} added to your bag!`);
  };

  const handleAddToWishlist = (prod) => {
    if (onAddToWishlist) {
      onAddToWishlist(prod);
    } else {
      const prodId = prod?._id || prod?.id;
      const willBeInWishlist = !useAuthStore.getState().isInWishlist(prodId);
      useAuthStore.getState().toggleWishlist(prod);
      const title = prod?.name || prod?.title || 'Product';
      if (willBeInWishlist) {
        notify.success(`${title} added to Wishlist!`);
      } else {
        notify.info(`${title} removed from Wishlist`);
      }
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim() || !emailRegex.test(newsletterEmail.trim())) {
      notify.error('Please enter a valid email address');
      return;
    }
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
    notify.success('Privilege unlocked! Your 15% VIP invitation code has been dispatched.');
  };

  return (
    <div className="flex flex-col gap-20 sm:gap-28 w-full pb-16">

      <section className="relative pt-4 sm:pt-10 overflow-hidden">
        {/* Ambient Glow in Background */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-162.5 h-100 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Text, Countdown Pill, CTAs & Animated Count-up Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Countdown Urgency Pill (Item 5) */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2.5 mb-6">
                <Badge variant="brand" icon={Calendar} size="md">
                  Autumn Archive 2026
                </Badge>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold backdrop-blur-xs">
                  <CountdownTimer compact={true} />
                </div>
              </motion.div>

              {/* Master Headline with Stagger */}
              <motion.div variants={fadeInUp} className="max-w-2xl w-full">
                <H1 className="text-[1.7rem] sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight mb-2.5 sm:mb-4 leading-[1.2]">
                  Premium Essentials <br />
                  for <span className="text-brand-500">Modern Living</span> <br />
                  & Tech.
                </H1>
                <Subtitle className="text-xs sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                  Discover curated laptops, flagship smartphones, smart accessories, and premium lifestyle essentials crafted for everyday excellence.
                </Subtitle>
              </motion.div>

              {/* Action CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-row items-center gap-2 sm:gap-4 mt-5 sm:mt-8 mb-6 sm:mb-10 w-full sm:w-auto">
                <Button
                  size="md"
                  rightIcon={ArrowRight}
                  onClick={handleCatalogNavigate}
                  className="flex-1 sm:flex-initial py-2.5 sm:py-3.5 px-3.5 sm:px-6 text-xs sm:text-sm font-semibold shadow-elevated hover:shadow-glow-brand cursor-pointer whitespace-nowrap"
                >
                  Explore Catalog
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={ShoppingBag}
                  onClick={() => {
                    const el = document.getElementById('featured-drops');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 sm:flex-initial py-2.5 sm:py-3.5 px-3.5 sm:px-6 text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  Featured Drops
                </Button>
              </motion.div>

              {/* Animated Stats Count-up Strip */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 py-4 px-3 sm:px-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-neutral-200/60 dark:border-dark-border shadow-xs w-full max-w-xl"
              >
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start">
                    <StatCounter end={4.92} decimals={2} duration={2000} />
                    <span className="text-xs text-neutral-400 font-normal ml-1">/ 5</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    1,800+ Reviews
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="font-display font-black text-2xl text-brand-500 flex items-center justify-center sm:justify-start">
                    <StatCounter end={100} duration={1800} suffix="%" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Aircraft Alloys
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start">
                    <StatCounter end={2} duration={1200} suffix="-Year" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Direct Cover
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start">
                    <StatCounter end={50} duration={1600} suffix="+" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Design Accolades
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0 px-3 sm:px-6"
            >
              {/* Backlight Glow Effect */}
              <div className="absolute -inset-4 bg-linear-to-tr from-brand-500/25 via-amber-500/15 to-brand-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Showcase Relative Wrapper */}
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg select-none">

                {/* Main Product Card  */}
                <div
                  className="relative w-full aspect-square rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-dark-border shadow-elevated group cursor-pointer bg-neutral-100 dark:bg-dark-surface"
                  onClick={() => handleProductNavigate(flagshipProduct)}
                >
                  {/* Subtle Top Badge */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-neutral-900/80 text-white dark:bg-white/10 backdrop-blur-md border border-white/20">
                      Flagship Piece
                    </span>
                  </div>

                  {/* Flagship Product Image filling entire container */}
                  <ProgressiveImage
                    src={flagshipProduct?.image || (flagshipProduct?.images && flagshipProduct.images[0]) || ''}
                    alt={flagshipProduct?.name || flagshipProduct?.title || "Flagship Acoustic"}
                    width={900}
                    priority={true}
                    aspectRatio="aspect-square"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Floating Card 1: Rating Pill */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-2 left-2 sm:top-6 sm:-left-6 z-10 p-2 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-neutral-200/90 dark:border-dark-border shadow-elevated max-w-40 sm:max-w-52.5"
                >
                  <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      {flagshipProduct?.rating || 4.96}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      ({flagshipProduct?.numReviews || flagshipProduct?.reviewsCount || 840}+ reviews)
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-snug truncate">
                    {flagshipProduct?.name || flagshipProduct?.title || 'Aura Reference'}
                  </p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-mono mt-0.5">
                    {flagshipProduct?.category || 'Audio Precision'} • In Stock
                  </p>
                </motion.div>

                {/* Floating Card 2: Price & Urgency Card (Placed outside overflow-hidden - never clipped) */}
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-2 right-2 sm:bottom-6 sm:-right-4 z-10 p-2.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-neutral-200/90 dark:border-dark-border shadow-elevated max-w-42.5 sm:max-w-55"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Only {flagshipProduct?.stock || 14} Units Left
                    </span>
                    {flagshipProduct?.mrp && flagshipProduct?.price && flagshipProduct.mrp > flagshipProduct.price && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
                        -{Math.round(((flagshipProduct.mrp - flagshipProduct.price) / flagshipProduct.mrp) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-lg text-neutral-900 dark:text-white">
                      {formatPrice(flagshipProduct?.price || 24999)}
                    </span>
                    {flagshipProduct?.mrp && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatPrice(flagshipProduct.mrp)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                    Includes 2-Yr cover & express air courier.
                  </p>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <MarqueeStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          badge="Curated Categories"
          badgeIcon={LayoutGrid}
          title="Explore Our"
          highlightWord="Featured Collections"
          subtitle="Modern computing, smart audio, and designer lifestyle essentials engineered for everyday excellence."
        />

        <div className="w-full grid grid-cols-12 gap-4 sm:gap-5 text-left">
          {bentoCollections.map((collection) => {
            const matchingProd = products.find(
              (p) => p.category?.toLowerCase() === collection.categorySlug?.toLowerCase()
            );
            const bentoImage = collection.image || matchingProd?.image || (matchingProd?.images && matchingProd.images[0]) || '';

            return (
              <motion.div
                key={collection.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`
                  ${collection.span} group relative rounded-2xl sm:rounded-3xl overflow-hidden
                  min-h-65 sm:min-h-90 lg:min-h-105 flex flex-col justify-between p-5 sm:p-7 lg:p-8
                  border border-neutral-200/80 dark:border-dark-border
                  shadow-subtle hover:shadow-elevated select-none cursor-pointer
                  bg-neutral-900 text-white
                `}
                onClick={() => handleCatalogNavigate(collection.link)}
              >
                {/* Full-Bleed Background Image */}
                <img
                  src={bentoImage}
                  alt={collection.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Cinematic Contrast Gradient Overlay for full background visibility */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 via-50% to-black/20 pointer-events-none" />

                {/* Top: Badge & Arrow Action */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 dark:bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {collection.badge}
                  </span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-subtle flex items-center justify-center group-hover:bg-brand-500 group-hover:border-brand-500 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Bottom: Category, Title & Subtitle */}
                <div className="relative z-10 flex flex-col gap-1 sm:gap-1.5 mt-auto pt-12">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
                    {collection.category}
                  </span>

                  <h3 className="font-display font-bold text-lg sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug drop-shadow-xs">
                    {collection.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-200 max-w-md line-clamp-2">
                    {collection.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          badge="Fresh Arrivals"
          badgeIcon={Flame}
          title="New Arrivals for"
          highlightWord="Modern Living"
          subtitle="Our latest handpicked releases across premium tech, electronics, and lifestyle products."
          action={
            <Button
              variant="outline"
              size="md"
              rightIcon={ArrowRight}
              onClick={handleCatalogNavigate}
              className="cursor-pointer"
            >
              Explore All Drops
            </Button>
          }
        />

        {/* 4-Column High-Impact Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product, idx) => (
            <motion.div
              key={`new-${product._id || product.id || idx}`}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="h-full"
            >
              <ProductCard
                {...product}
                badgeText="New Arrival"
                badgeVariant="brand"
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleAddToWishlist(product)}
                onQuickView={() => handleProductNavigate(product)}
                onClick={() => handleProductNavigate(product)}
              />
            </motion.div>
          ))}
        </div>
      </section>


      <section id="featured-drops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="brand" icon={Tag} size="sm" className="mb-2">
              Curated Collection
            </Badge>
            <H2>
              Featured & Trending <span className="text-brand-500">Products</span>
            </H2>
            <Subtitle className="text-sm sm:text-base max-w-xl mt-1">
              Browse top rated gear across electronics, computing, smart home and lifestyle essentials.
            </Subtitle>
          </div>

          {/* Interactive Filter Pills with Left & Right scroll buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-dark-card border border-neutral-200/60 dark:border-dark-border w-full md:w-auto max-w-full md:max-w-xl lg:max-w-2xl min-w-0">
            <button
              type="button"
              onClick={() => scrollFilters('left')}
              className="w-8 h-8 rounded-xl bg-white dark:bg-dark-surface shadow-xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-brand-500 hover:text-white transition-all cursor-pointer shrink-0 z-10 active:scale-95 border border-neutral-200/50 dark:border-dark-border"
              aria-label="Scroll filters left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={filterScrollRef}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth min-w-0"
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveCategoryFilter(tab.value)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer
                    ${activeCategoryFilter === tab.value
                      ? 'bg-white dark:bg-dark-surface text-brand-600 dark:text-brand-400 shadow-subtle'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollFilters('right')}
              className="w-8 h-8 rounded-xl bg-white dark:bg-dark-surface shadow-xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-brand-500 hover:text-white transition-all cursor-pointer shrink-0 z-10 active:scale-95 border border-neutral-200/50 dark:border-dark-border"
              aria-label="Scroll filters right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Dynamic Skeletons & Animated Entrance */}
        {isArchiveLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : effectiveArchiveProducts.length > 0 ? (
          <motion.div
            key={activeCategoryFilter}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {effectiveArchiveProducts.map((product) => (
              <motion.div key={product._id || product.id} variants={staggerItem} className="h-full">
                <ProductCard
                  {...product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleAddToWishlist(product)}
                  onQuickView={() => handleProductNavigate(product)}
                  onClick={() => handleProductNavigate(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-4 bg-neutral-50 dark:bg-dark-card rounded-3xl border border-neutral-200/60 dark:border-dark-border">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
              No products found in this category right now.
            </p>
            <Button size="sm" variant="outline" onClick={() => setActiveCategoryFilter('all')} className="cursor-pointer">
              Browse All Products
            </Button>
          </div>
        )}

        {/* Bottom Catalog Discovery CTA */}
        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            variant="outline"
            rightIcon={ArrowRight}
            onClick={handleCatalogNavigate}
            className="cursor-pointer"
          >
            Discover All {products.length}+ Curated Pieces
          </Button>
        </div>
      </section>


      <section className="bg-neutral-100/70 dark:bg-dark-surface/50 border-y border-neutral-200/80 dark:border-dark-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustPerks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col p-6 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/60 dark:border-dark-border shadow-xs hover:shadow-subtle transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-semibold text-base text-neutral-900 dark:text-dark-text mb-1">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          align="center"
          badge="Verified Acquirers"
          badgeIcon={Star}
          title="Endorsed by Discerning"
          highlightWord="Architects & Creators"
          subtitle="Real reviews from professionals who rely on ShopNest hardware to power high-stakes creative workflows every day."
        />

        <div className="w-full relative pb-12">
          <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full pb-10!"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <TestimonialCard
                  {...testimonial}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 dark:bg-dark-card text-white p-8 sm:p-14 lg:p-16 border border-neutral-800 dark:border-dark-border shadow-elevated">

          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-accent-amber/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand" icon={Tag} size="sm">
                Private Release Access
              </Badge>
            </div>

            <H2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              Unlock 15% Off Your First Acquisition.
            </H2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Join 28,000+ engineers, designers, and collectors. Receive private early access to small-batch drops, firmware releases, and behind-the-scenes material science journals.
            </p>

            {newsletterSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium flex items-center gap-2 mt-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Welcome to the archive. Your 15% VIP code has been dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col sm:flex-row gap-3 mt-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your executive email..."
                  className="
                    flex-1 bg-white/10 dark:bg-white/5 border border-white/20
                    rounded-xl px-5 py-3 text-base sm:text-sm text-white placeholder:text-neutral-400
                    focus:outline-none focus:border-brand-500 focus:bg-white/15 transition-all
                  "
                />
                <Button type="submit" size="md" rightIcon={ArrowRight} className="shrink-0 cursor-pointer">
                  Claim Privilege
                </Button>
              </form>
            )}

            <div className="flex items-center gap-6 mt-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> No spam guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> Instant one-click unsubscribe
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
