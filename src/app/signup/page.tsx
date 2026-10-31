'use client';

import { registerUser } from '@/actions/auth';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Loader2, AlertCircle, Mail, Lock, User, Eye, EyeOff, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

function SignUpContent() {
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') || '/';
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError('');
    try {
      await registerUser(formData);
    } catch (err: unknown) {
      const isRedirect =
        typeof err === 'object' && err !== null && 'digest' in err &&
        typeof (err as { digest: string }).digest === 'string' &&
        (err as { digest: string }).digest.startsWith('NEXT_REDIRECT');
      if (!isRedirect) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-[88vh] flex bg-gray-50">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-14 bg-white border-r border-gray-100">
        {/* soft orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(16,185,129,.08),transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,.08),transparent 70%)' }} />
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(16,185,129,.05) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-xs text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', boxShadow: '0 8px 32px rgba(16,185,129,.25)' }}>
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Join E-Shop!</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            Create your free account and start shopping thousands of premium products today.
          </p>

          {/* Benefit list */}
          <div className="space-y-3 text-left">
            {[
              'Free shipping on orders over $50',
              'Easy 30-day returns policy',
              'Secure & fast checkout',
              'Exclusive deals for members',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white">
        <div className="w-full max-w-sm">

          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', boxShadow: '0 8px 24px rgba(16,185,129,.25)' }}>
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">E-Shop</p>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">{t('signup.title')}</h2>
          <p className="text-sm text-gray-400 mb-7">{t('signup.subtitle')}</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">{t('signup.fullName')}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input name="name" type="text" required placeholder="e.g. Sokha Chan"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-gray-300" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">{t('signup.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input name="email" type="email" required placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-gray-300" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">{t('signup.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input name="password" type={showPw ? 'text' : 'password'} required minLength={6}
                  placeholder={t('signup.passwordHint')}
                  className="w-full pl-10 pr-11 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder-gray-300" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">{t('signup.passwordHint')}</p>
            </div>

            {/* Mini benefit row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { emoji: '🚚', label: 'Free shipping' },
                { emoji: '🔒', label: 'Secure pay' },
                { emoji: '↩',  label: '30-day return' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-base">{b.emoji}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black text-white transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', boxShadow: '0 6px 20px rgba(16,185,129,.25)' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('signup.submitting') : t('signup.submit')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 pt-5 border-t border-gray-100">
            {t('signup.haveAccount')}{' '}
            <Link href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
