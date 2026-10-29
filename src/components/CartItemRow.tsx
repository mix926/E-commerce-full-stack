'use client';

import { updateCartItem, removeFromCart } from '@/actions/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
}

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();
  const [qty, setQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const handleQtyChange = async (newQty: number) => {
    if (newQty < 0) return;
    setLoading(true);
    if (newQty === 0) {
      // treat as remove
      await removeFromCart(item.id);
      router.refresh();
      return;
    }
    setQty(newQty);
    await updateCartItem(item.id, newQty);
    router.refresh();
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeFromCart(item.id);
    router.refresh();
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex gap-4 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {/* Product Image */}
      <Link href={`/products/${item.product.id}`} className="shrink-0">
        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm md:text-base">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-xs text-blue-600 font-medium mt-0.5">{item.product.category}</p>
        <p className="text-blue-600 font-bold mt-1">${item.product.price.toFixed(2)}</p>

        {/* Quantity Controls + Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQtyChange(qty - 1)}
              disabled={loading}
              className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-3 py-1 text-sm font-bold text-gray-900 min-w-[2rem] text-center">
              {qty}
            </span>
            <button
              onClick={() => handleQtyChange(qty + 1)}
              disabled={loading || qty >= item.product.stock}
              className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 p-1"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="shrink-0 text-right">
        <p className="font-bold text-gray-900">
          ${(item.product.price * qty).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
