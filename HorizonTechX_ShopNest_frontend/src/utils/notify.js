import toast from 'react-hot-toast';

/**
 * Standardized Toast Notification System
 * Strictly enforces ONLY success and error toasts across the application
 */
export const notify = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      icon: null,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      icon: null,
      ...options,
    });
  },

  // Legacy calls strictly mapped to success or error only
  info: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      icon: null,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast.error(message, {
      duration: 3500,
      icon: null,
      ...options,
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export { toast };
export default notify;
