import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { Button } from './Button';
import { notify } from '../../utils/notify';

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      notify.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    setEmail('');
    notify.success('Thank you for subscribing to the Horizon bulletin!');
  };

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
      { label: 'Contact Us', path: '/' },
    ],
  };

  const trustBadges = [
    { icon: Truck, title: 'Complimentary Shipping', desc: 'On orders over ₹4,999' },
    { icon: ShieldCheck, title: '2-Year Warranty', desc: 'Crafted to endure' },
    { icon: RotateCcw, title: '30-Day Free Returns', desc: 'Hassle-free guarantee' },
    { icon: Lock, title: 'Encrypted Checkout', desc: 'Bank-level security' },
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
          {/* Brand Info & Newsletter (5 Columns) */}
          <div className="md:col-span-5 flex flex-col gap-6">
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
              Curating elevated tech essentials and lifestyle hardware with meticulous craftsmanship and uncompromising aesthetics.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} noValidate className="flex flex-col gap-2 max-w-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                Join the Private Archive
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Receive private release previews and exclusive collector drops.
              </p>

              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                  Welcome aboard. Look out for our welcome correspondence.
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="
                      flex-1 bg-neutral-100 dark:bg-dark-card
                      border border-neutral-200 dark:border-dark-border
                      rounded-xl px-4 py-2.5 text-xs text-neutral-900 dark:text-dark-text
                      outline-none focus:border-brand-500
                    "
                  />
                  <Button type="submit" size="sm" rightIcon={ArrowRight} className="cursor-pointer">
                    Join
                  </Button>
                </div>
              )}
            </form>
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

        {/* Bottom Rights Bar */}
        <div className="pt-12 mt-12 border-t border-neutral-100 dark:border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
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
