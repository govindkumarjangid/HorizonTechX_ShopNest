/**
 * Formats a number to Indian Rupee (₹) currency format
 * Example: 24999 -> ₹24,999
 */
export const formatPrice = (amount, includeDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
};

export default formatPrice;
