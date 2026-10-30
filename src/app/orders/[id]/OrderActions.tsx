'use client';

import { useState } from 'react';
import { cancelOrder } from '@/actions/orders';
import { Printer, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

interface OrderActionsProps {
  orderId: string;
  canCancel: boolean;
}

export default function OrderActions({ orderId, canCancel }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await cancelOrder(orderId);
      toast.success('Order has been cancelled successfully.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not cancel order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
      >
        <Printer className="w-3.5 h-3.5 text-gray-500" />
        {t('order.printInvoice')}
      </button>

      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {t('order.cancelOrder')}
        </button>
      )}
    </div>
  );
}
