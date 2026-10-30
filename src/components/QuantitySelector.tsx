'use client';

import { useState } from 'react';
import { addToCart } from '@/actions/cart';
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

interface QuantitySelectorProps {
  productId: string;
  maxStock: number;
  productName?: string;
}

export default function QuantitySelector({
  productId,
  maxStock,
  productName,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { t } = useLanguage();

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(maxStock, q + 1));

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(productId, quantity);
      setAdded(true);
      toast.success(
        productName
          ? t('toast.addedQtyWithName').replace('{qty}', String(quantity)).replace('{name}', productName)
          : t('toast.addedQtyItems').replace('{qty}', String(quantity))
      );
      router.refresh();
      setTimeout(() => setAdded(false), 2500);
    } catch (error: unknown) {
      const isRedirect =
        typeof error === 'object' &&
        error !== null &&
        'digest' in error &&
        typeof (error as { digest: string }).digest === 'string' &&
        (error as { digest: string }).digest.startsWith('NEXT_REDIRECT');

      if (isRedirect) {
        toast.info(t('toast.signInRequired'));
        router.push('/signin');
        return;
      }
      toast.error(t('toast.addFailedRetry'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Control */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">{t('cart.quantity')}</span>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            onClick={decrement}
            disabled={quantity === 1}
            className="p-2.5 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-4 py-2 font-bold text-gray-900 min-w-[3rem] text-center bg-white">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={quantity === maxStock}
            className="p-2.5 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <span className="text-xs text-gray-500">
          ({t('cart.max')} {maxStock})
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${
          added
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ShoppingCart className="w-5 h-5" />
        )}
        {added ? t('cart.addedToCart') : loading ? t('product.adding') : t('product.addToCart')}
      </button>
    </div>
  );
}
