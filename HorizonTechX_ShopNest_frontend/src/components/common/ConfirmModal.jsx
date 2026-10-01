import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { backdropFade } from '../../styles/motion';


export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 shadow-2xl z-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-rose-50 text-semantic-error dark:bg-rose-950/40' : 'bg-brand-50 text-brand-500'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                {title}
              </h3>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
              {description}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant={isDestructive ? 'danger' : 'primary'}
                size="sm"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1"
              >
                {confirmLabel}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
