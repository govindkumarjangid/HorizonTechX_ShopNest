import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Lock, Headphones, MapPin } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/shop' },
      { label: 'Featured Drops', path: '/shop' },
      { label: 'New Arrivals', path: '/shop' },
      { label: 'Curated Sets', path: '/shop' },
    ],
    support: [
      { label: 'Track Order', path: '/orders' },
      { label: 'Shipping & Delivery', path: '/shop' },
      { label: 'My Account', path: '/dashboard' },
      { label: 'Help & Concierge', path: '/orders' },
    ],
    company: [
      { label: 'About ShopNest', path: '/' },
      { label: 'Hardware Ethos', path: '/' },
      { label: 'Material Science', path: '/shop' },
      { label: 'Security Protocols', path: '/' },
    ],
  };

  const trustBadges = [
    { icon: Truck, title: 'Complimentary Shipping', desc: 'On all orders across India' },
    { icon: ShieldCheck, title: '2-Year Warranty', desc: 'Comprehensive hardware cover' },
    { icon: RotateCcw, title: '30-Day Free Returns', desc: 'Zero hassle evaluation' },
    { icon: Lock, title: 'Encrypted Checkout', desc: 'Bank-level 256-bit security' },
  ];

  return (
    <footer className="w-full bg-white dark:bg-dark-surface border-t border-neutral-200/80 dark:border-dark-border mt-20">
      {/* Value Proposition Reassurance Bar */}
      <div className="border-b border-neutral-100 dark:border-dark-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-dark-card text-brand-500 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      {badge.title}
                    </h5>
                    <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Info & Studio Concierge (5 Columns) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left cursor-pointer bg-transparent border-none p-0 w-fit"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-display font-bold text-lg">
                H
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
                Horizon<span className="text-brand-500">ShopNest</span>
              </span>
            </button>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              Curating elevated tech essentials and lifestyle hardware with meticulous craftsmanship, aerospace aluminum, and uncompromising acoustic tolerances.
            </p>

            {/* Studio Concierge Information */}
            <div className="flex flex-col gap-2.5 pt-2 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-dark-border/40 max-w-sm">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Concierge Desk: <strong className="text-neutral-900 dark:text-neutral-200">concierge@shopnest.design</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Bengaluru Design Lab & Mumbai Hub • Mon–Sat 10:00–19:00 IST</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-500 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Private Vault Status: Operational • All shipments insured</span>
              </div>
            </div>
          </div>

          {/* Navigation Column Groups (7 Columns) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Shop Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Catalog
              </h4>
              <ul className="flex flex-col gap-2.5">
                {footerLinks.shop.map((link, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => navigate(link.path)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Concierge
              </h4>
              <ul className="flex flex-col gap-2.5">
                {footerLinks.support.map((link, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => navigate(link.path)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Identity
              </h4>
              <ul className="flex flex-col gap-2.5">
                {footerLinks.company.map((link, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => navigate(link.path)}
                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Visual Payment Providers & Encrypted Trust Strip (Item 6) */}
        <div className="pt-8 mt-12 border-t border-neutral-100 dark:border-dark-border/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mr-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Encrypted Checkout:
            </span>

            {/* UPI Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M4 4l8 8-8 8h5.5l8-8-8-8H4z" fill="#00B894" />
                <path d="M11 4l8 8-8 8h5.5l8-8-8-8H11z" fill="#E17055" />
              </svg>
              <span className="font-black text-xs tracking-tight text-neutral-900 dark:text-white">UPI</span>
            </div>

            {/* Visa Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-2xs">
              <span className="font-sans font-black italic text-xs tracking-tight text-blue-600 dark:text-blue-400">
                VISA
              </span>
            </div>

            {/* Mastercard Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-2xs">
              <div className="flex -space-x-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B]" />
              </div>
              <span className="text-[11px] font-bold text-neutral-900 dark:text-white">Mastercard</span>
            </div>

            {/* RuPay Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-2xs">
              <span className="text-xs font-black tracking-tight text-neutral-900 dark:text-white">
                Ru<span className="text-cyan-600 dark:text-cyan-400">Pay</span>
              </span>
            </div>

            {/* NetBanking / Cards Pill */}
            <div className="hidden sm:flex items-center px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
              NetBanking & EMI
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>256-Bit SSL • Razorpay Secured • PCI-DSS Level 1</span>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-dark-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 HorizonTechX ShopNest Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Security Audits</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
