'use client';

import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OrderItemThumb {
  id: string;
  quantity: number;
  product: { id: string; name: string; image: string };
}

interface OrderListItem {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItemThumb[];
}

interface OrdersContentProps {
  orders: OrderListItem[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  processing: 'bg-blue-100 text-blue-700 border border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border border-green-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

export default function OrdersContent({ orders }: OrdersContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-5 py-4">
        <Package className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{t('orders.title')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} {t('orders.count')}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-full p-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('orders.none')}</h2>
          <p className="text-gray-500 mb-8">{t('orders.noneDesc')}</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            {t('orders.shopNow')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {t('status.' + order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    {/* Item thumbnails */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          +{order.items.length - 4} {t('orders.more')}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        {totalItems} {totalItems !== 1 ? t('orders.items') : t('orders.item')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 justify-end">
                      {t('orders.viewDetails')} <ArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
