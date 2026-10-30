'use client';

import { registerUser } from '@/actions/auth';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

function SignUpContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
    } catch (err: unknown) {
      const isRedirect =
        typeof err === 'object' &&
        err !== null &&
        'digest' in err &&
        typeof (err as { digest: string }).digest === 'string' &&
        (err as { digest: string }).digest.startsWith('NEXT_REDIRECT');

      if (!isRedirect) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Join E-Shop!</h2>
          <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
            Create your free account and start shopping thousands of premium products today.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            {['✓ Free shipping on orders over $50', '✓ Easy 30-day returns', '✓ Secure & fast checkout'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 border border-white/20 font-medium text-left">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-Shop</p>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{t('signup.title')}</h2>
          <p className="text-sm text-gray-500 mb-7">{t('signup.subtitle')}</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('signup.fullName')}</label>
              <input name="name" type="text" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="e.g. Sokha Chan" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('signup.email')}</label>
              <input name="email" type="email" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('signup.password')}</label>
              <input name="password" type="password" required minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder={t('signup.passwordHint')} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('signup.submitting') : t('signup.submit')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 pt-5 border-t border-gray-200">
            {t('signup.haveAccount')}{' '}
            <Link href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-bold text-blue-600 hover:underline">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-gray-400">Loading sign up...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
