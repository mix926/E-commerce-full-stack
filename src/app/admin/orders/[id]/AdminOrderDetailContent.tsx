'use client';

import { useLanguage } from '@/context/LanguageContext';
import OrderStatusUpdater from './OrderStatusUpdater';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; image: string };
}

interface Props {
  order: {
    id: string;
    total: number;
    status: string;
    address: string;
    user: { name: string | null; email: string };
    items: OrderItem[];
  };
}

export default function AdminOrderDetailContent({ order }: Props) {
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('order.number')}{order.id.slice(-8).toUpperCase()}
      </h1>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.customer')}</h2>
        <p className="text-sm text-gray-700">
          <span className="font-medium">{t('admin.name')}:</span> {order.user.name ?? '—'}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">{t('admin.email')}:</span> {order.user.email}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-medium">{t('order.shippingDetails')}:</span> {order.address}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{t('order.orderItems')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">{t('admin.productName')}</th>
                <th className="px-6 py-3 text-left">{t('order.qty')}</th>
                <th className="px-6 py-3 text-left">{t('admin.price')}</th>
                <th className="px-6 py-3 text-left">{t('admin.total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <span className="font-medium text-gray-900">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <p className="text-base font-bold text-gray-900">
            {t('admin.total')}: ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Status Updater */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.status')}</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
