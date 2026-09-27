import React from 'react';
import { Badge } from '../ui/Badge';

/**
 * Reusable Status Pill for Orders
 */
export const OrderStatusBadge = ({ status = 'Processing' }) => {
  const statusMap = {
    Placed: { variant: 'neutral', label: 'Order Placed' },
    Processing: { variant: 'brand', label: 'Processing' },
    Shipped: { variant: 'warning', label: 'Shipped' },
    Delivered: { variant: 'success', label: 'Delivered' },
    Cancelled: { variant: 'error', label: 'Cancelled' },
  };

  const current = statusMap[status] || { variant: 'brand', label: status };

  return (
    <Badge variant={current.variant} size="sm">
      {current.label}
    </Badge>
  );
};

export default OrderStatusBadge;
