'use client';

import Link from 'next/link';
import { Package, ArrowRight, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending'
  },
  processing: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Package className="w-4 h-4" />,
    label: 'Processing'
  },
  shipped: {
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: <Truck className="w-4 h-4" />,
    label: 'Shipped'
  },
  delivered: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Delivered'
  },
  cancelled: {
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Cancelled'
  },
};

export default function OrdersContent({ orders }: OrdersContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              {t('orders.title')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {orders.length} {orders.length !== 1 ? t('orders.count') : 'order'}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 px-6 bg-white border border-gray-200 rounded-3xl shadow-sm text-center max-w-2xl mx-auto animate-in fade-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            {t('orders.none')}
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {t('orders.noneDesc')}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
          >
            {t('orders.shopNow')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
                  {/* Order ID & Status */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Order ID
                    </p>
                    <p className="text-sm font-bold text-gray-900 font-mono break-all">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {t('status.' + order.status)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Order Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Items Preview */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Items ({totalItems})
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={item.id}
                          className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden ring-2 ring-white"
                          style={{ zIndex: 3 - i }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total & Action */}
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Total Amount
                    </p>
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                      ${order.total.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                      View Details <ArrowRight className="w-4 h-4" />
                    </div>
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
