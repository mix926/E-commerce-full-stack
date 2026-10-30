'use client';

import { loginUser } from '@/actions/auth';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2, AlertCircle, ShoppingBag, Sparkles, KeyRound } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fillDemoAccount = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setError('');
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    try {
      await loginUser(formData);
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
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Welcome back!</h2>
          <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
            Sign in to access your orders, track deliveries, and enjoy personalized deals.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {['500+ Products', '10k+ Happy Customers', '4.9★ Rating'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20 text-xs font-semibold">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-Shop</p>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{t('signin.title')}</h2>
          <p className="text-sm text-gray-500 mb-7">{t('signin.subtitle')}</p>

          {/* Demo fill */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs mb-6">
            <div>
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {t('signin.demoTitle')}
              </div>
              <div className="text-blue-600 mt-0.5 font-mono text-[11px]">demo@example.com / password123</div>
            </div>
            <button type="button" onClick={fillDemoAccount}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 text-xs">
              <KeyRound className="w-3 h-3" /> {t('signin.fillDemo')}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('signin.email')}</label>
              <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">{t('signin.password')}</label>
              <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('signin.submitting') : t('signin.submit')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 pt-5 border-t border-gray-200">
            {t('signin.noAccount')}{' '}
            <Link href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-bold text-blue-600 hover:underline">
              {t('signin.createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-gray-400">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
