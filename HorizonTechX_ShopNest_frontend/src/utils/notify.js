import toast from 'react-hot-toast';

export const notify = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 3500,
      icon: '⚠️',
      ...options,
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export { toast };
export default notify;
