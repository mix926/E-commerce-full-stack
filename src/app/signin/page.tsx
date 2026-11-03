'use client';

import { loginUser } from '@/actions/auth';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, ShoppingBag, Star, Truck, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') || '/';
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError('');
    try {
      await loginUser(formData);
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
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,.15),transparent 70%)', animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(168,85,247,.12),transparent 70%)', animation: 'float 8s ease-in-out infinite reverse' }} />
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(99,102,241,.05) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-xs text-center z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 20px 40px rgba(99,102,241,.25)' }}>
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Welcome back!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Sign in to access your orders, track deliveries, and enjoy exclusive member benefits.
          </p>

          {/* Feature cards */}
          <div className="space-y-3 text-left">
            {[
              { icon: <Truck className="w-4 h-4 text-blue-500" />,         bg: 'bg-blue-50',    title: 'Free Shipping',    desc: 'On orders over $50' },
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50', title: 'Secure Payments',  desc: '256-bit SSL encrypted' },
              { icon: <Star className="w-4 h-4 text-amber-500 fill-amber-400" />, bg: 'bg-amber-50', title: '4.9 Rating', desc: 'From 10k+ happy customers' },
            ].map((item, i) => (
              <div key={item.title} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-8 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`${item.bg} p-2 rounded-lg shrink-0`}>{item.icon}</div>
                <div>
                  <p className="text-gray-900 text-xs font-bold">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white lg:bg-gradient-to-b lg:from-white lg:to-gray-50">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-700">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,.3)' }}>
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">E-Shop</p>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">{t('signin.title')}</h2>
          <p className="text-sm text-gray-500 mb-8">{t('signin.subtitle')}</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-in shake"  >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
              <label className="text-xs font-semibold text-gray-700 block mb-2">{t('signin.email')}</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input name="email" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400" />
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">{t('signin.password')}</label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input name="password" type={showPw ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '150ms' }}>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,.3)' }}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? t('signin.submitting') : t('signin.submit')}
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
            <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-8 pt-6 border-t border-gray-200">
            {t('signin.noAccount')}{' '}
            <Link href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              {t('signin.createAccount')}
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
