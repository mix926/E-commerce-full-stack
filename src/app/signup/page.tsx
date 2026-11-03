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
    <div className="min-h-[88vh] flex bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-14 bg-white border-r border-gray-200">
        {/* Animated background */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(16,185,129,.15),transparent 70%)', animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,.12),transparent 70%)', animation: 'float 8s ease-in-out infinite reverse' }} />
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(16,185,129,.05) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-xs text-center z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', boxShadow: '0 20px 40px rgba(16,185,129,.25)' }}>
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Join E-Shop!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Create your free account and unlock exclusive benefits, faster checkout, and personalized recommendations.
          </p>

          {/* Benefit list */}
          <div className="space-y-3 text-left">
            {[
              'Free shipping on orders over $50',
              'Easy 30-day returns policy',
              'Secure & fast checkout',
              'Exclusive deals for members',
            ].map((item, i) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white lg:bg-gradient-to-b lg:from-white lg:to-gray-50">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-700">

          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', boxShadow: '0 8px 24px rgba(16,185,129,.25)' }}>
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">E-Shop</p>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">{t('signup.title')}</h2>
          <p className="text-sm text-gray-500 mb-8">{t('signup.subtitle')}</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-in shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
              <label className="text-xs font-semibold text-gray-700 block mb-2">{t('signup.fullName')}</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input name="name" type="text" required placeholder="e.g. Sokha Chan"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400" />
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
              <label className="text-xs font-semibold text-gray-700 block mb-2">{t('signup.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input name="email" type="email" required placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400" />
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '150ms' }}>
              <label className="text-xs font-semibold text-gray-700 block mb-2">{t('signup.password')}</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input name="password" type={showPw ? 'text' : 'password'} required minLength={6}
                  placeholder={t('signup.passwordHint')}
                  className="w-full pl-10 pr-11 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5 font-medium">{t('signup.passwordHint')}</p>
            </div>

            {/* Mini benefit row */}
            <div className="grid grid-cols-3 gap-2 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
              {[
                { emoji: '🚚', label: 'Free shipping' },
                { emoji: '🔒', label: 'Secure pay' },
                { emoji: '↩',  label: '30-day return' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                  <span className="text-base">{b.emoji}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ background: 'linear-gradient(135deg,#10b981,#6366f1)', animationDelay: '250ms' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('signup.submitting') : t('signup.submit')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-8 pt-6 border-t border-gray-200">
            {t('signup.haveAccount')}{' '}
            <Link href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
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
