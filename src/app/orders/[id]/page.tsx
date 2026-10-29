import { getOrderById } from '@/actions/orders';
import { getSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, MapPin, CheckCircle, Truck, Calendar, ShoppingBag, ArrowLeft } from 'lucide-react';
import OrderActions from './OrderActions';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/signin');

  const order = await getOrderById(id);
  if (!order) notFound();

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const canCancel = order.status === 'pending' || order.status === 'processing';

  // Calculate estimated delivery: 3 days after order creation
  const orderDate = new Date(order.createdAt);
  const estDelivery = new Date(orderDate);
  estDelivery.setDate(orderDate.getDate() + 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link
          href="/orders"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Orders
        </Link>
        <OrderActions orderId={order.id} canCancel={canCancel} />
      </div>

      {/* Invoice Header (visible on print) */}
      <div className="hidden print:block mb-8 border-b pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              E
            </div>
            <span className="font-extrabold text-xl">E-Shop Store Receipt</span>
          </div>
          <span className="text-xs text-gray-500">
            Invoice Date: {new Date().toLocaleDateString('en-US')}
          </span>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Package className="w-6 h-6 text-blue-600 shrink-0" />
              <h1 className="text-xl font-extrabold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <p className="text-xs text-gray-500">
              Placed on{' '}
              {orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
              STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Tracking & Timeline */}
        {order.status !== 'cancelled' ? (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" /> Order Progress
              </span>
              <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Est. Delivery:{' '}
                {estDelivery.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-1/2 w-full h-0.5 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center z-10 text-xs font-bold transition-colors ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 capitalize font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            This order was cancelled. If you need any assistance or refund verification, please reach out to our 24/7 customer support.
          </div>
        )}
      </div>

      {/* Grid: Delivery Info + Order Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Shipping Address & Details */}
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border print:p-4">
          <h2 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Shipping Details
          </h2>
          <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-900">{session.name || 'Valued Customer'}</p>
            <p className="text-gray-500">{order.address}</p>
            <p className="text-gray-500">{session.email}</p>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400">
              Courier: Express Worldwide
              <br />
              Tracking: <span className="font-mono text-gray-600">TRK-{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm print:border print:p-4">
          <h2 className="font-bold text-gray-900 text-sm mb-4">
            Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                <Link href={`/products/${item.product.id}`} className="shrink-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`}>
                    <p className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors truncate">
                      {item.product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-bold text-sm text-gray-900 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping & Handling</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
              <span>Grand Total Paid</span>
              <span className="text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="text-center print:hidden">
        <Link
          href="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-sm text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
