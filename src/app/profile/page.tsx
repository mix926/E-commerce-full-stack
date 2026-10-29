import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { logoutUser } from '@/actions/auth';
import Link from 'next/link';
import { User, Mail, Package, Star, Calendar, LogOut, ShoppingCart, Tag, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/signin');

  const [user, orderCount, reviewCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.order.count({ where: { userId: session.userId } }),
    prisma.review.count({ where: { userId: session.userId } }),
  ]);

  if (!user) redirect('/signin');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <User className="w-8 h-8 text-blue-600" />
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Header Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
              <span className="text-3xl font-extrabold text-white">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900">{user.name || 'Anonymous'}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>

          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link
          href="/orders"
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{orderCount}</div>
            <div className="text-xs text-gray-500">Orders Placed</div>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="bg-rose-50 p-3 rounded-xl group-hover:bg-rose-100 transition-colors">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900">Saved Items</div>
            <div className="text-xs text-gray-500">View Wishlist</div>
          </div>
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-50 p-3 rounded-xl">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{reviewCount}</div>
            <div className="text-xs text-gray-500">Reviews Written</div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{user.name || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="space-y-2">
          <Link
            href="/orders"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Package className="w-4 h-4" />
            View My Orders
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <ShoppingCart className="w-4 h-4" />
            My Cart
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Tag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">Account Actions</h2>
        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
