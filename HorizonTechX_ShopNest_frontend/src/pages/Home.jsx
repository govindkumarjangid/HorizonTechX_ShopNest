import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import {
  H1,
  H2,
  Subtitle,
  Button,
  ProductCard,
  Badge,
  SectionHeader,
  CategoryCard,
  TestimonialCard,
} from '../components/ui';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
} from '../styles/motion';
import {
  categories,
  products,
  bentoCollections,
  testimonials,
  trustPerks,
} from '../assets/assets';
import { notify } from '../utils/notify';

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

  // Filter products based on selected tab
  const filteredProducts = activeCategoryFilter === 'all'
    ? products
    : products.filter((p) => p.categorySlug === activeCategoryFilter);

  const filterTabs = [
    { label: 'All Curations', value: 'all' },
    { label: 'Acoustic', value: 'audio' },
    { label: 'Workstation', value: 'workstation' },
    { label: 'Timepieces', value: 'timepieces' },
    { label: 'Lighting', value: 'lighting' },
  ];

  const handleCatalogNavigate = () => {
    if (onNavigateToCatalog) onNavigateToCatalog();
    else navigate('/shop');
  };

  const handleProductNavigate = (prod) => {
    if (onNavigateToProduct) onNavigateToProduct(prod);
    navigate(`/product/${prod.id}`);
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
    <div className="flex flex-col gap-24 sm:gap-32 w-full pb-16">
      
      {/* =========================================================
          1. HERO SECTION & BENTO COLLECTION INTRO
         ========================================================= */}
      <section className="relative pt-6 sm:pt-12">
        {/* Ambient Glow in Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          
          {/* Subtle Tag Pill */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 mb-6"
          >
            <Badge variant="brand" icon={Sparkles} size="lg">
              Autumn Archive 2026 • Limited Edition Hardware
            </Badge>
          </motion.div>

          {/* Master Headline */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.08 }}
            className="max-w-4xl"
          >
            <H1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Precision Instruments for <br className="hidden sm:inline" />
              <span className="text-brand-500 underline decoration-brand-500/30 decoration-wavy decoration-2">
                Uncompromising
              </span> Spaces.
            </H1>
            <Subtitle className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-600 dark:text-neutral-300">
              We engineer tactile keyboards, audiophile acoustics, and minimal horology curated for architects, creators, and discerning tastemakers.
            </Subtitle>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.16 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-14"
          >
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
            >
              Featured Drops
            </Button>
          </motion.div>

          {/* Social Proof Counter Strip (Fixed min-height to prevent CLS) */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.22 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 py-6 px-8 rounded-2xl bg-white/70 dark:bg-dark-surface/70 backdrop-blur-md border border-neutral-200/60 dark:border-dark-border shadow-subtle mb-16 w-full max-w-4xl min-h-[96px]"
          >
            <div className="flex flex-col items-center">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                4.92 / 5
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Over 1,800+ Verified Reviews
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-brand-500">
                100%
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Aircraft Aluminum & Ceramics
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                2-Year
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Comprehensive Replacement
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white">
                50+
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Global Design Accolades
              </span>
            </div>
          </motion.div>

          {/* Editorial Bento Hero Collections Grid */}
          <div className="w-full grid grid-cols-12 gap-5 text-left">
            {bentoCollections.map((collection) => (
              <motion.div
                key={collection.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`
                  ${collection.span} group relative rounded-3xl overflow-hidden
                  min-h-[340px] sm:min-h-[420px] aspect-[16/10] sm:aspect-auto flex flex-col justify-end p-8
                  border border-neutral-200/80 dark:border-dark-border
                  shadow-subtle hover:shadow-elevated select-none cursor-pointer bg-neutral-100 dark:bg-dark-surface
                `}
                onClick={onNavigateToCatalog}
              >
                {/* Background Image with Zoom & Lazy Loading */}
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
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
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          2. CATEGORY SHOWCASE (Interactive Swiper Slider)
         ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeader
          badge="Curated Domains"
          badgeIcon={Sparkles}
          title="Engineered for Every Dimension of"
          highlightWord="Modern Living"
          subtitle="Swipe through our specialized hardware divisions, crafted in small batches with strict tolerance limits."
          action={
            <Button
              variant="outline"
              size="md"
              rightIcon={ArrowRight}
              onClick={handleCatalogNavigate}
              className="cursor-pointer"
            >
              View All Domains
            </Button>
          }
        />

        {/* Swiper Carousel for Categories (Zero layout jump on load) */}
        <div className="w-full relative pb-10">
          <Swiper
            modules={[FreeMode, Pagination]}
            freeMode={true}
            spaceBetween={20}
            slidesPerView={1.15}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: {
                slidesPerView: 2.15,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="w-full !overflow-visible"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="h-auto">
                <CategoryCard
                  name={cat.name}
                  tagline={cat.tagline}
                  itemCount={cat.itemCount}
                  image={cat.image}
                  href={`#${cat.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategoryFilter(cat.slug);
                    const el = document.getElementById('featured-drops');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* =========================================================
          3. FEATURED / TRENDING PRODUCTS CATALOG
         ========================================================= */}
      <section id="featured-drops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="brand" icon={Sparkles} size="sm" className="mb-2">
              The Archive
            </Badge>
            <H2>
              Featured & Trending <span className="text-brand-500">Hardware</span>
            </H2>
            <Subtitle className="text-sm sm:text-base max-w-xl mt-1">
              Select items currently in stock with immediate courier dispatch worldwide.
            </Subtitle>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100 dark:bg-dark-card border border-neutral-200/60 dark:border-dark-border overflow-x-auto max-w-full">
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
          4. REASSURANCE & TRUST PERKS
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
          5. TESTIMONIALS & COLLECTOR REVIEWS (Swiper Carousel)
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
          6. EDITORIAL NEWSLETTER / CTA BANNER
         ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 dark:bg-dark-card text-white p-8 sm:p-14 lg:p-16 border border-neutral-800 dark:border-dark-border shadow-elevated">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-accent-amber/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand" icon={Sparkles} size="sm">
                Private Release Access
              </Badge>
            </div>

            <H2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
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
