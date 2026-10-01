import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Filter,
  SlidersHorizontal,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  RefreshCw,
  Zap,
  Package,
  Award,
  ThumbsUp,
  Percent,
  Sliders,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Share2,
  ExternalLink,
} from 'lucide-react';

// Custom clean SVGs for social media icons
export const InstagramIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TwitterIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const GithubIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const YoutubeIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// icons
export const icons = {
  // Navigation & Actions
  bag: ShoppingBag,
  cart: ShoppingCart,
  heart: Heart,
  search: Search,
  user: User,
  menu: Menu,
  close: X,
  themeLight: Sun,
  themeDark: Moon,
  filter: Filter,
  sliders: SlidersHorizontal,
  quickView: Eye,
  eyeOff: EyeOff,

  // Directions & Navigation
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUpRight: ArrowUpRight,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,

  // Reassurance & Trust
  shipping: Truck,
  warranty: ShieldCheck,
  returns: RotateCcw,
  security: Lock,
  clock: Clock,
  package: Package,
  award: Award,
  thumbsUp: ThumbsUp,
  discount: Percent,
  refresh: RefreshCw,
  lightning: Zap,

  // Feedback & Ratings
  star: Star,
  award: Award,
  check: Check,
  checkCircle: CheckCircle2,
  alertCircle: AlertCircle,
  helpCircle: HelpCircle,
  globe: Globe,
  share: Share2,
  external: ExternalLink,

  // Communication & Socials
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  github: GithubIcon,
  youtube: YoutubeIcon,
  card: CreditCard,
};

// Navigation & Header Links
export const navLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Laptops', href: '/shop?category=laptops' },
  { label: 'Smartphones', href: '/shop?category=smartphones' },
  { label: 'Accessories', href: '/shop?category=mobile-accessories' },
  { label: 'Watches', href: '/shop?category=mens-watches' },
  { label: 'Sports', href: '/shop?category=sports-accessories' },
];

// Rich Products Catalog
export const products = [
  {
    id: 'prod-101',
    title: 'Aura Studio Wireless Noise-Cancelling Headphones',
    slug: 'aura-studio-wireless-headphones',
    price: 24999,
    originalPrice: 29999,
    category: 'Audio',
    categorySlug: 'audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewsCount: 148,
    badgeText: 'Curator Pick',
    badgeVariant: 'brand',
    inStock: true,
    colors: ['#171613', '#D5D2C9', '#E0533C'],
    description: 'Custom 45mm beryllium drivers deliver reference-grade acoustic clarity. Engineered with memory foam lambskin cushions and aerospace-grade anodized aluminum framework.',
    specs: [
      { label: 'Frequency Response', value: '10Hz – 40,000Hz' },
      { label: 'Battery Life', value: '38 Hours Active ANC' },
      { label: 'Weight', value: '265g' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm Hi-Res' },
    ],
  },
  {
    id: 'prod-102',
    title: 'Horizon Stealth Mechanical Keyboard (CNC Aluminum)',
    slug: 'horizon-stealth-mechanical-keyboard',
    price: 16499,
    originalPrice: 19999,
    category: 'Workstation',
    categorySlug: 'workstation',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    reviewsCount: 92,
    badgeText: 'New Release',
    badgeVariant: 'new',
    inStock: true,
    colors: ['#12131C', '#E7E5DF'],
    description: 'Gasket-mounted sound profile featuring pre-lubed tactile switches, solid brass internal weight, and double-shot PBT keycaps with custom iconography.',
    specs: [
      { label: 'Case Material', value: '6063 Anodized Aluminum' },
      { label: 'Layout', value: '75% Compact Layout' },
      { label: 'Switches', value: 'Custom Factory Lubed Tactile 62g' },
      { label: 'Hot-Swap', value: '5-Pin South-Facing RGB PCB' },
    ],
  },
  {
    id: 'prod-103',
    title: 'Chronos Ceramic Minimalist Chronograph Watch',
    slug: 'chronos-ceramic-chronograph-watch',
    price: 29999,
    originalPrice: 34999,
    category: 'Timepieces',
    categorySlug: 'timepieces',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    reviewsCount: 215,
    badgeText: '-15% OFF',
    badgeVariant: 'sale',
    inStock: true,
    colors: ['#0C0B0A', '#FFFFFF'],
    description: 'High-density matte ceramic case housing a Swiss-calibrated mechanical chronograph movement. Scratch-proof sapphire glass with dual anti-reflective coating.',
    specs: [
      { label: 'Case Diameter', value: '39mm' },
      { label: 'Water Resistance', value: '5 ATM (50 Meters)' },
      { label: 'Movement', value: 'Swiss Automatic 28,800 vph' },
      { label: 'Strap', value: 'Quick-release Tuscan leather' },
    ],
  },
  {
    id: 'prod-104',
    title: 'Lumina OLED Ambient Workstation Lamp',
    slug: 'lumina-oled-workstation-lamp',
    price: 11999,
    originalPrice: 14499,
    category: 'Lighting',
    categorySlug: 'lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    reviewsCount: 56,
    badgeText: 'Sold Out',
    badgeVariant: 'outOfStock',
    inStock: false,
    colors: ['#171613', '#D5D2C9'],
    description: 'Zero glare optical path engineered with a CRI 98+ full-spectrum emitter. Auto-dimming sensor balances illumination dynamically based on ambient room light.',
    specs: [
      { label: 'Color Temp', value: '2700K – 6500K Continuous' },
      { label: 'CRI Rating', value: 'Ra ≥ 98 Color Fidelity' },
      { label: 'Control', value: 'Wireless Rotary Dial Controller' },
    ],
  },
  {
    id: 'prod-105',
    title: 'Titan Arc Precision Ergonomic Mouse',
    slug: 'titan-arc-precision-mouse',
    price: 9999,
    originalPrice: 11999,
    category: 'Workstation',
    categorySlug: 'workstation',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    reviewsCount: 78,
    badgeText: 'Top Rated',
    badgeVariant: 'brand',
    inStock: true,
    colors: ['#171613', '#FAF9F7'],
    description: 'Magnesium skeleton weighing only 54 grams. Equipped with optical microswitches tested for 90 million clicks and a 30,000 DPI sensor.',
    specs: [
      { label: 'Sensor', value: 'PixArt PAW3395 30K Optical' },
      { label: 'Weight', value: '54g Ultra-lightweight' },
      { label: 'Polling Rate', value: 'Up to 4000Hz Wireless' },
    ],
  },
  {
    id: 'prod-106',
    title: 'Verve Portable Hi-Res DAC & Headphone Amp',
    slug: 'verve-portable-hires-dac',
    price: 13499,
    originalPrice: 15999,
    category: 'Audio',
    categorySlug: 'audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewsCount: 64,
    badgeText: 'Audiophile Choice',
    badgeVariant: 'new',
    inStock: true,
    colors: ['#171613', '#B45309'],
    description: 'Dual ESS Sabre ES9038Q2M decoding chips. Supports DSD512 native playback and PCM 768kHz via 4.4mm balanced and 3.5mm standard outputs.',
    specs: [
      { label: 'Output Power', value: '560mW @ 32Ω Balanced' },
      { label: 'Audio Chip', value: 'Dual ESS ES9038Q2M' },
      { label: 'Chassis', value: 'Sandblasted Brass & Glass' },
    ],
  },
  {
    id: 'prod-107',
    title: 'Strata Handcrafted Full-Grain Leather Desk Pad',
    slug: 'strata-fullgrain-leather-desk-pad',
    price: 7499,
    originalPrice: 8999,
    category: 'Workstation',
    categorySlug: 'workstation',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    reviewsCount: 112,
    badgeText: 'Artisanal',
    badgeVariant: 'neutral',
    inStock: true,
    colors: ['#5A564D', '#262420', '#A4301D'],
    description: 'Sourced from heritage Tuscan tanneries, vegetable-tanned to age gracefully with a unique rich patina over decades of daily productivity.',
    specs: [
      { label: 'Dimensions', value: '900mm x 420mm (3.5mm thickness)' },
      { label: 'Backing', value: 'Non-slip natural Portuguese cork' },
      { label: 'Edge Finish', value: 'Hand-beveled & burnished with beeswax' },
    ],
  },
  {
    id: 'prod-108',
    title: 'Monolith Solid Walnut Magnetic MagSafe Dock',
    slug: 'monolith-walnut-magsafe-dock',
    price: 6499,
    originalPrice: 7999,
    category: 'Accessories',
    categorySlug: 'accessories',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    reviewsCount: 183,
    badgeText: '-18% OFF',
    badgeVariant: 'sale',
    inStock: true,
    colors: ['#3E3B34'],
    description: 'Carved from a single block of FSC-certified American black walnut with weighted steel base. Micro-suction bottom ensures true one-hand detachment.',
    specs: [
      { label: 'Weight', value: '450g Heavy-gauge anti-lift' },
      { label: 'Charging Rate', value: '15W Fast Charge Qi2 Ready' },
      { label: 'Compatibility', value: 'All MagSafe & Qi2 Devices' },
    ],
  },
];

// Editorial Bento Hero Showcase Collections
export const bentoCollections = [
  {
    id: 'col-1',
    title: 'Smart Audio & Earwear',
    subtitle: 'Immersive soundscapes and noise-cancelling clarity.',
    category: 'Mobile & Audio',
    categorySlug: 'mobile-accessories',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
    link: '/shop?category=mobile-accessories',
    span: 'col-span-12 lg:col-span-7',
    badge: 'Trending Now',
  },
  {
    id: 'col-2',
    title: 'Modern Laptops & Computing',
    subtitle: 'High-performance laptops engineered for speed and precision.',
    category: 'Laptops',
    categorySlug: 'laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
    link: '/shop?category=laptops',
    span: 'col-span-12 sm:col-span-6 lg:col-span-5',
    badge: 'Popular Choice',
  },
  {
    id: 'col-3',
    title: 'Luxury Timepieces',
    subtitle: 'Chronographs and smart watches designed for everyday elegance.',
    category: 'Watches',
    categorySlug: 'mens-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    link: '/shop?category=mens-watches',
    span: 'col-span-12 sm:col-span-6 lg:col-span-5',
    badge: 'Curated Drop',
  },
  {
    id: 'col-4',
    title: 'Next-Gen Smartphones',
    subtitle: 'Flagship mobile devices with breakthrough cameras and displays.',
    category: 'Smartphones',
    categorySlug: 'smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85',
    link: '/shop?category=smartphones',
    span: 'col-span-12 lg:col-span-7',
    badge: 'Best Seller',
  },
];

//  Customer Testimonials & Reviews
export const testimonials = [
  {
    id: 'test-1',
    name: 'Julian Vance',
    role: 'Principal Architect at Atelier V',
    avatar: '',
    rating: 5,
    title: 'The benchmark of modern tactile luxury.',
    quote: 'The Horizon Stealth keyboard transformed my drafting desk into an inspiring sanctuary. The sheer density, sound dampening, and hand-finished finish are unmatched in current hardware.',
    productPurchased: 'Horizon Stealth Mechanical Keyboard',
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    role: 'Audio Mastering Engineer',
    avatar: '',
    rating: 5,
    title: 'Acoustic fidelity without fatigue.',
    quote: 'The Aura Studio headphones achieve a flat, truthful curve without sacrificing low-end texture. I wear them for 8-hour sessions with zero cranial pressure. Exceptional work.',
    productPurchased: 'Aura Studio Wireless Headphones',
  },
  {
    id: 'test-3',
    name: 'Marcus Sterling',
    role: 'Industrial Designer',
    avatar: '',
    rating: 5,
    title: 'Flawless ceramic engineering.',
    quote: 'The ceramic case on the Chronos chronograph has an astonishing matte warmth. ShopNest’s packaging and white-glove delivery experience set a gold standard.',
    productPurchased: 'Chronos Ceramic Chronograph Watch',
  },
];

// Core Reassurance Trust Perks
export const trustPerks = [
  {
    icon: icons.shipping,
    title: 'Complimentary Express Courier',
    description: 'Direct air courier on all domestic & international orders over ₹4,999.',
  },
  {
    icon: icons.warranty,
    title: '2-Year Ironclad Warranty',
    description: 'Every mechanical and electronic component backed by full replacement coverage.',
  },
  {
    icon: icons.returns,
    title: '30-Day Studio Trial',
    description: 'Experience items in your personal workspace with risk-free complimentary returns.',
  },
  {
    icon: icons.security,
    title: 'Bank-Grade 256-bit Encryption',
    description: 'Transactions processed through verified PCI-DSS compliant gateways.',
  },
];

// Footer Directory Columns
export const footerNavigation = {
  catalog: [
    { label: 'All Hardware', href: '/products' },
    { label: 'Acoustic Engineering', href: '/products?category=audio' },
    { label: 'Desk Architecture', href: '/products?category=workstation' },
    { label: 'Horology & Objects', href: '/products?category=timepieces' },
    { label: 'Lighting Systems', href: '/products?category=lighting' },
    { label: 'Archive Releases', href: '/products' },
  ],
  concierge: [
    { label: 'Track Order', href: '/orders' },
    { label: 'White-Glove Shipping', href: '#' },
    { label: 'Returns & Exchange Portal', href: '#' },
    { label: 'Hardware Care & Cleaning', href: '#' },
    { label: 'Warranty Claims', href: '#' },
    { label: 'Contact Concierge', href: '#' },
  ],
  identity: [
    { label: 'Our Philosophy', href: '#' },
    { label: 'Sustainable Sourcing', href: '#' },
    { label: 'Material Science', href: '#' },
    { label: 'Editorial Journal', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  socials: [
    { icon: icons.instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: icons.twitter, label: 'X (Twitter)', href: 'https://x.com' },
    { icon: icons.github, label: 'GitHub', href: 'https://github.com' },
    { icon: icons.youtube, label: 'YouTube', href: 'https://youtube.com' },
  ],
};
