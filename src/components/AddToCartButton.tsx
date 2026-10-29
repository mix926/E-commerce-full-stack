'use client';

import { addToCart } from '@/actions/cart';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
  productName?: string;
}

export default function AddToCartButton({
  productId,
  quantity = 1,
  className = '',
  showIcon = true,
  disabled = false,
  productName,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { t } = useLanguage();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(productId, quantity);
      setAdded(true);
      toast.success(
        productName
          ? `Added "${productName}" to your cart!`
          : `Item added to your cart!`
      );
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    } catch (error: unknown) {
      const isRedirect =
        typeof error === 'object' &&
        error !== null &&
        'digest' in error &&
        typeof (error as { digest: string }).digest === 'string' &&
        (error as { digest: string }).digest.startsWith('NEXT_REDIRECT');

      if (isRedirect) {
        toast.info('Please sign in to add items to your cart');
        router.push('/signin');
        return;
      }

      toast.error('Could not add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
        added
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : showIcon ? (
        <ShoppingCart className="w-4 h-4" />
      ) : null}
      {added ? t('product.addedToCart') : loading ? t('product.adding') : disabled ? t('product.outOfStock') : t('product.addToCart')}
    </button>
  );
}
