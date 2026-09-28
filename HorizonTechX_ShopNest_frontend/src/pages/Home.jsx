import { useState, useEffect } from 'react';
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
} from '../assets/assets';
import { notify } from '../utils/notify';
import { formatPrice } from '../utils/formatPrice';
import { CountdownTimer } from '../components/home/CountdownTimer';
import { StatCounter } from '../components/home/StatCounter';
import { MarqueeStrip } from '../components/home/MarqueeStrip';
import { useProductStore } from '../store/useProductStore';

export const Home = ({
  onAddToCart,
  onAddToWishlist,
  onNavigateToCatalog,
  onNavigateToProduct,
}) => {
  const navigate = useNavigate();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
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

  // Flagship Hero Product: resolved from real DB products (prioritizing audio/hardware/horology)
  const flagshipProduct =
    products.find(
      (p) =>
        ['audio', 'laptops', 'mens-watches', 'mobile-accessories'].includes(p.category) ||
        /headphone|audio|sound|watch|airpod|laptop|keyboard|speaker/i.test(p.name || p.title)
    ) ||
    featuredProducts.find(
      (p) =>
        ['audio', 'laptops', 'mens-watches', 'mobile-accessories'].includes(p.category) ||
        /headphone|audio|sound|watch|airpod|laptop|keyboard|speaker/i.test(p.name || p.title)
    ) || {
      id: 'flagship-aura',
      title: 'Aura Studio Wireless Reference Headphones',
      name: 'Aura Studio Wireless Reference Headphones',
      price: 24999,
      mrp: 29999,
      rating: 4.96,
      numReviews: 840,
      category: 'Audio Precision',
      stock: 14,
      image: '',
    };

  // New arrivals: top 4 products from real database
  const newArrivals = products.slice(0, 4);

  // Dynamic filter tabs from real categories
  const filterTabs = [
    { label: 'All Products', value: 'all' },
    ...categories.slice(0, 6).map((cat) => ({
      label: cat.name || cat,
      value: cat.slug || cat,
    })),
  ];

  // Filter products based on selected tab for the archive catalog
  const filteredProducts = activeCategoryFilter === 'all'
    ? products
    : products.filter(
        (p) =>
          p.category?.toLowerCase() === activeCategoryFilter.toLowerCase() ||
          p.categorySlug?.toLowerCase() === activeCategoryFilter.toLowerCase()
      );

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
    if (onAddToCart) onAddToCart(prod);
    notify.success(`${prod.title} added to your bag!`);
  };

  const handleAddToWishlist = (prod) => {
    if (onAddToWishlist) onAddToWishlist(prod);
    notify.success(`${prod.title} updated in Wishlist!`);
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
      
      {/* =========================================================
          1. SPLIT HERO SECTION WITH FLAGSHIP PRODUCT & COUNTDOWN
         ========================================================= */}
      <section className="relative pt-4 sm:pt-10 overflow-hidden">
        {/* Ambient Glow in Background */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-[150px] pointer-events-none" />

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
                <H1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight mb-4 leading-[1.15]">
                  Premium Essentials <br />
                  for <span className="text-brand-500 underline decoration-brand-500/30 decoration-wavy decoration-2">Modern Living</span> <br />
                  & Tech.
                </H1>
                <Subtitle className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
                  Discover curated laptops, flagship smartphones, smart accessories, and premium lifestyle essentials crafted for everyday excellence.
                </Subtitle>
              </motion.div>

              {/* Action CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mt-8 mb-10">
                <Button
                  size="lg"
                  rightIcon={ArrowRight}
                  onClick={handleCatalogNavigate}
                  className="shadow-elevated hover:shadow-glow-brand cursor-pointer"
                >
                  Explore Full Catalog
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={ShoppingBag}
                  onClick={() => {
                    const el = document.getElementById('featured-drops');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="cursor-pointer"
                >
                  Featured Drops
                </Button>
              </motion.div>

              {/* Animated Stats Count-up Strip (Item 7) */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-4 px-6 rounded-2xl bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-neutral-200/60 dark:border-dark-border shadow-xs w-full max-w-xl"
              >
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white flex items-center">
                    <StatCounter end={4.92} decimals={2} duration={2000} />
                    <span className="text-xs text-neutral-400 font-normal ml-1">/ 5</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    1,800+ Reviews
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-brand-500">
                    <StatCounter end={100} duration={1800} suffix="%" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Aircraft Alloys
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white">
                    <StatCounter end={2} duration={1200} suffix="-Year" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Direct Cover
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-neutral-900 dark:text-white">
                    <StatCounter end={50} duration={1600} suffix="+" />
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Design Accolades
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Flagship Product with Floating Rating & Price Cards (Item 2) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0 px-3 sm:px-6"
            >
              {/* Backlight Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/25 via-amber-500/15 to-brand-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Showcase Relative Wrapper (allows floating badges to overflow without clipping) */}
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg select-none">
                
                {/* Main Product Card - Edge-to-Edge Full Coverage */}
                <div
                  className="relative w-full aspect-square rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-dark-border shadow-elevated group cursor-pointer bg-neutral-100 dark:bg-dark-surface"
                  onClick={() => handleProductNavigate(flagshipProduct)}
                >
                  {/* Subtle Top Badge */}
                  <div className="absolute top-5 right-5 z-20">
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

                {/* Floating Card 1: Rating Pill (Placed outside overflow-hidden - never clipped) */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 left-2 sm:top-6 sm:-left-6 z-30 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-neutral-200/90 dark:border-dark-border shadow-elevated max-w-[190px] sm:max-w-[210px]"
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
                  className="absolute bottom-4 right-2 sm:bottom-6 sm:-right-4 z-30 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border border-neutral-200/90 dark:border-dark-border shadow-elevated max-w-[200px] sm:max-w-[220px]"
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

      {/* =========================================================
          2. MARQUEE STRIP (Item 4: Between Hero & Categories)
         ========================================================= */}
      <MarqueeStrip />

      {/* =========================================================
          3. EDITORIAL 2x2 BENTO COLLECTIONS GRID (Item 1 Kept)
         ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          badge="Curated Categories"
          badgeIcon={LayoutGrid}
          title="Explore Our"
          highlightWord="Featured Collections"
          subtitle="Modern computing, smart audio, and designer lifestyle essentials engineered for everyday excellence."
        />

        <div className="w-full grid grid-cols-12 gap-5 text-left">
          {bentoCollections.map((collection) => {
            const matchingProd = products.find(
              (p) =>
                p.category?.toLowerCase() === collection.category?.toLowerCase() ||
                (collection.link && collection.link.includes(p.category?.toLowerCase()))
            );
            const bentoImage = matchingProd?.image || (matchingProd?.images && matchingProd.images[0]) || collection.image || '';

            return (
              <motion.div
                key={collection.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`
                  ${collection.span} group relative rounded-3xl overflow-hidden
                  min-h-[300px] sm:min-h-[420px] aspect-[16/10] sm:aspect-auto flex flex-col justify-end p-5 sm:p-8
                  border border-neutral-200/80 dark:border-dark-border
                  shadow-subtle hover:shadow-elevated select-none cursor-pointer bg-neutral-100 dark:bg-dark-surface
                `}
                onClick={() => handleCatalogNavigate(collection.link)}
              >
                {/* Background Image with Zoom */}
                <ProgressiveImage
                  src={bentoImage}
                  alt={collection.title}
                  width={1000}
                  aspectRatio=""
                  className="absolute inset-0 w-full h-full"
                  imgClassName="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
              <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-neutral-950/0 transition-colors" />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Badge variant="brand" size="sm">
                    {collection.badge}
                  </Badge>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-brand-500 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-brand-300 font-semibold mt-2">
                  {collection.category}
                </span>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {collection.title}
                </h3>

                <p className="text-sm text-neutral-300 max-w-md">
                  {collection.subtitle}
                </p>
              </div>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          4. NEW ARRIVALS SHOWCASE (Item 1: Converted from redundant category scroll)
         ========================================================= */}
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
          {newArrivals.map((product) => (
            <motion.div
              key={`new-${product.id}`}
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

      {/* =========================================================
          5. FULL FEATURED ARCHIVE CATALOG WITH FILTER TABS
         ========================================================= */}
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

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100 dark:bg-dark-card border border-neutral-200/60 dark:border-dark-border overflow-x-auto max-w-full no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.value)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer
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
        </div>

        {/* Product Cards Grid with Staggered Entrance */}
        <motion.div
          key={activeCategoryFilter}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItem} className="h-full">
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

      {/* =========================================================
          6. REASSURANCE & TRUST PERKS
         ========================================================= */}
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

      {/* =========================================================
          7. TESTIMONIALS & COLLECTOR REVIEWS
         ========================================================= */}
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
            className="w-full !pb-10"
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

      {/* =========================================================
          8. EDITORIAL NEWSLETTER CARD (Item 3: Kept as the sole VIP sign-up)
         ========================================================= */}
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
                    rounded-xl px-5 py-3 text-sm text-white placeholder:text-neutral-400
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
