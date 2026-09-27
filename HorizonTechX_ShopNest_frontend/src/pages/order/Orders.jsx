import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, ArrowLeft } from 'lucide-react';
import { H1, Subtitle, Badge } from '../../components/ui';
import { OrderCard } from '../../components/orders/OrderCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useOrderStore } from '../../store/useOrderStore';

/**
 * Dedicated Orders Listing Page
 */
export const Orders = ({
  onSelectOrder,
  onNavigateToCatalog,
}) => {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'processing' | 'delivered'
  const [searchQuery, setSearchQuery] = useState('');

  const handleOrderClick = (order) => {
    if (onSelectOrder) {
      onSelectOrder(order);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleCatalogClick = () => {
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      navigate('/shop');
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by status tab
    if (activeFilter === 'processing' && order.status !== 'Processing') return false;
    if (activeFilter === 'delivered' && order.status !== 'Delivered') return false;

    // Filter by search query (order ID or item name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesItem = order.items?.some((item) =>
        item.title?.toLowerCase().includes(q)
      );
      return matchesId || matchesItem;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-2 mb-8">
        <button
          type="button"
          onClick={handleCatalogClick}
          className="text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors flex items-center gap-1.5 cursor-pointer w-fit mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <H1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Your Orders & Shipments
            </H1>
            <Subtitle className="text-sm">
              Real-time telemetry and dispatch records for your precision hardware orders.
            </Subtitle>
          </div>

          <Badge variant="brand" icon={Package} size="md">
            {orders.length} Dispatched
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs mb-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'processing', 'delivered'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer
                ${
                  activeFilter === filter
                    ? 'bg-neutral-900 text-white dark:bg-brand-500'
                    : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }
              `}
            >
              {filter === 'all' ? 'All Orders' : filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or item..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description={
            searchQuery
              ? `No orders matching "${searchQuery}". Try a different keyword.`
              : 'You have not placed any orders under this filter yet.'
          }
          actionLabel="Explore Hardware Archive"
          onAction={handleCatalogClick}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onTrackDetails={handleOrderClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
