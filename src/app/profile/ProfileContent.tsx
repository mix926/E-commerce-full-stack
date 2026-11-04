'use client';

import Link from 'next/link';
import { User, Package, Star, LogOut, ShoppingCart, Tag, Heart, Edit2, Lock, Settings } from 'lucide-react';
import { logoutUser } from '@/actions/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';

interface ProfileContentProps {
  user: { name: string | null; email: string; createdAt: string };
  orderCount: number;
  reviewCount: number;
}

export default function ProfileContent({ user, orderCount, reviewCount }: ProfileContentProps) {
  const { t } = useLanguage();
  const membershipDays = useMemo(() => {
    return Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  }, [user.createdAt]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="relative mb-8 animate-in fade-in duration-500">
        <div className="h-32 sm:h-48 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Avatar */}
            <div className="relative px-6 pt-6 pb-0 text-center">
              <div className="-mt-24 mb-4 mx-auto">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center mx-auto">
                  <span className="text-5xl font-extrabold text-white">
                    {(user.name || user.email)[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 py-6 text-center border-b border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                {user.name || t('profile.anonymous')}
              </h2>
              <p className="text-sm text-gray-500 break-all mb-3">{user.email}</p>
              
              <div className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                <p className="text-xs font-semibold text-blue-700 flex items-center gap-1 justify-center">
                  <Star className="w-3.5 h-3.5" />
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/orders"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium">{t('profile.ordersPlaced')}</p>
                    <p className="text-lg font-bold text-gray-900">{orderCount}</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-rose-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium">{t('profile.savedItems')}</p>
                    <p className="text-lg font-bold text-gray-900">0</p>
                  </div>
                </div>
              </Link>

              <div className="p-3 rounded-lg bg-amber-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 rounded-lg">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 font-medium">{t('profile.reviewsWritten')}</p>
                    <p className="text-lg font-bold text-gray-900">{reviewCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Account Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('profile.accountInfo')}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {t('profile.fullName')}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {user.name || t('profile.notSet')}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {t('profile.emailAddress')}
                  </p>
                  <p className="text-base font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <Tag className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('profile.quickLinks')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/orders"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Package className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {t('profile.viewMyOrders')}
                </span>
              </Link>

              <Link
                href="/products"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  Browse
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
              >
                <Heart className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-500 transition-colors">
                  Wishlist
                </span>
              </Link>

              <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  Settings
                </span>
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Change Password
              </button>
              <button className="w-full px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left font-semibold text-gray-700 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '400ms' }}>
            <p className="text-sm text-red-700 mb-4">
              Once you sign out, you&apos;ll need to sign in again with your credentials.
            </p>
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition-all active:scale-95 w-full sm:w-auto justify-center sm:justify-start"
              >
                <LogOut className="w-4 h-4" />
                {t('profile.signOut')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
