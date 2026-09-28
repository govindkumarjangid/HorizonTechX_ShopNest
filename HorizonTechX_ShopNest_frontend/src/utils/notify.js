import toast from 'react-hot-toast';

/**
 * Standardized Toast Notification System
 * Replaces browser alerts, default tooltips, and unstyled errors
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

  loading: (message, options = {}) => {
    return toast.loading(message, {
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
