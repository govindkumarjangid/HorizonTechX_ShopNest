import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  HelpCircle,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { H1, Button } from '../../components/ui';
import { OrderTracker } from '../../components/orders/OrderTracker';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { formatPrice } from '../../utils/formatPrice';
import { useOrderStore } from '../../store/useOrderStore';
import { notify } from '../../utils/notify';

/**
 * Dedicated Single Order Details & Live Telemetry Page
 */
export const OrderDetails = ({
  order: propOrder,
  onBackToOrders,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, activeOrder } = useOrderStore();
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);

  // Resolve order from URL parameter or prop or store
  const order =
    (id ? orders.find((o) => o.id === id) : null) ||
    propOrder ||
    activeOrder ||
    orders[0] || {
      id: 'ORD-89241',
      date: '24 Sep, 2026',
      status: 'Processing',
      statusStep: 1,
      paymentMethod: 'UPI / NetBanking',
      trackingNumber: 'HTX-IND-90214',
      shippingAddress: {
        fullName: 'Govind Jangid',
        phone: '+91 98765 43210',
        street: 'Flat 402, Block C, Heritage Heights',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      items: [],
      total: 24999,
    };

  const handleDownloadInvoice = () => {
    setIsDownloadingInvoice(true);
    notify.loading('Generating certified tax invoice (GST)...', { id: 'invoice-gen' });
    setTimeout(() => {
      setIsDownloadingInvoice(false);
      setInvoiceDownloaded(true);
      notify.success('Tax invoice downloaded successfully!', { id: 'invoice-gen' });
    }, 900);
  };

  const handleConciergeSupport = () => {
    notify.success('Concierge specialist requested. We will reach you via WhatsApp shortly.');
  };

  const handleBack = () => {
    if (onBackToOrders) {
      onBackToOrders();
    } else {
      navigate('/orders');
    }
  };

  const calculatedSubtotal =
    order.subtotal ||
    order.items?.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) ||
    order.total;

  const calculatedTax = order.tax || Math.round(calculatedSubtotal * 0.18);
  const calculatedShipping = order.shippingFee || (calculatedSubtotal >= 4999 ? 0 : 499);
  const calculatedTotal = order.total || calculatedSubtotal + calculatedShipping + calculatedTax;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200/80 dark:border-dark-border">
        <button
          type="button"
          onClick={handleBack}
          className="text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            loading={isDownloadingInvoice}
            onClick={handleDownloadInvoice}
            leftIcon={Download}
          >
            {invoiceDownloaded ? 'Invoice Saved' : 'Download Tax Invoice'}
          </Button>
        </div>
      </div>

      {/* Order Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-500 font-bold">
              Precision Telemetry ID
            </span>
            <H1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              {order.id}
            </H1>
            <span className="text-xs text-neutral-500">
              Placed on {order.date} • Airway Bill: <strong className="font-mono text-neutral-900 dark:text-white">{order.trackingNumber}</strong>
            </span>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        {/* Live Stepper Tracker */}
        <div className="pt-2">
          <OrderTracker currentStep={order.statusStep ?? 1} />
        </div>

        {/* Telemetry Checkpoints */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/60 dark:border-dark-border flex flex-col gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>Latest Dispatch Telemetry</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
            <span>Package passed optical calibration & acoustic seal inspection.</span>
            <span className="font-mono text-[11px] text-neutral-400">Bengaluru Lab</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
            <span>Air consignment manifested with BlueDart Express.</span>
            <span className="font-mono text-[11px] text-neutral-400">Transit Terminal</span>
          </div>
        </div>
      </div>

      {/* Grid: Delivery / Payment vs Items & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-4">
            <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
              Package Contents ({order.items?.length || 0} items)
            </h3>

            <div className="flex flex-col gap-4 divide-y divide-neutral-100 dark:divide-dark-border/80">
              {order.items?.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-dark-border"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xs">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Shipping Address</span>
              </div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white mt-1">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>

            {/* Payment Method */}
            <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xs">
                <CreditCard className="w-4 h-4 text-brand-500" />
                <span>Payment Method</span>
              </div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white mt-1 uppercase">
                {order.paymentMethod || 'UPI / NetBanking'}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Transaction Verified
              </span>
              <p className="text-[11px] text-neutral-400 mt-1">
                GSTIN: 07AAACH7409R1ZZ
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-subtle flex flex-col gap-4">
            <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white">
              Price Breakdown
            </h4>

            <div className="flex flex-col gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium">
                  {formatPrice(calculatedSubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Express Air Shipping</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium">
                  {calculatedShipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free Express</span>
                  ) : (
                    formatPrice(calculatedShipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% IGST)</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium">
                  {formatPrice(calculatedTax)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200/80 dark:border-dark-border font-bold text-base text-neutral-900 dark:text-white">
                <span>Total Paid</span>
                <span className="font-mono text-brand-500">{formatPrice(calculatedTotal)}</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              leftIcon={HelpCircle}
              onClick={handleConciergeSupport}
              className="w-full mt-2 cursor-pointer"
            >
              Order Concierge Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
