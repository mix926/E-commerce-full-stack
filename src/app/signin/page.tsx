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
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="inline-flex justify-center mb-3">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShoppingBag className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">{t('signin.title')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('signin.subtitle')}
          </p>
        </div>

        {/* 1-Click Demo Fill */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {t('signin.demoTitle')}
            </div>
            <div className="text-blue-700 mt-0.5 font-mono text-[11px]">
              demo@example.com / password123
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            {t('signin.fillDemo')}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-4" action={handleSubmit}>
          <input type="hidden" name="redirect" value={redirectTo} />

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('signin.email')}
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">{t('signin.password')}</label>
            </div>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t('signin.submitting') : t('signin.submit')}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
          {t('signin.noAccount')}{' '}
          <Link
            href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-bold text-blue-600 hover:underline"
          >
            {t('signin.createAccount')}
          </Link>
        </p>
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
