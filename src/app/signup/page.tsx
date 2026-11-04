'use client';

import { registerUser } from '@/actions/auth';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Loader2, AlertCircle, Mail, Lock, User, Eye, EyeOff, ShoppingBag, CheckCircle2, Truck, Shield, RotateCcw } from 'lucide-react';
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-50">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-14 bg-white border-r border-slate-200">
        {/* Animated background */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(59,130,246,.1),transparent 70%)', animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,.08),transparent 70%)', animation: 'float 8s ease-in-out infinite reverse' }} />
        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(59,130,246,.05) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative max-w-xs text-center z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 20px 40px rgba(59,130,246,.25)' }}>
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3">Join Our Store!</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-10">
            Create your free account and unlock exclusive benefits, faster checkout, and personalized recommendations.
          </p>

          {/* Benefit list */}
          <div className="space-y-3 text-left">
            {[
              { icon: Truck, text: 'Free shipping on orders over $50' },
              { icon: RotateCcw, text: 'Easy 30-day returns policy' },
              { icon: Shield, text: 'Secure & fast checkout' },
              { icon: CheckCircle2, text: 'Exclusive deals for members' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <item.icon className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white lg:bg-gradient-to-b lg:from-white lg:to-slate-50">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-700">

          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,.25)' }}>
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Create Account</p>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-2">{t('signup.title')}</h1>
          <p className="text-sm text-slate-600 mb-8">{t('signup.subtitle')}</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 animate-in shake font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" action={handleSubmit}>
            <input type="hidden" name="redirect" value={redirectTo} />

            {/* Full Name */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
              <label className="text-xs font-bold text-slate-700 block mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input name="name" type="text" required placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium" />
              </div>
            </div>

            {/* Email */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
              <label className="text-xs font-bold text-slate-700 block mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input name="email" type="email" required placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium" />
              </div>
            </div>

            {/* Password */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '150ms' }}>
              <label className="text-xs font-bold text-slate-700 block mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input name="password" type={showPw ? 'text' : 'password'} required minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-3 text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Minimum 6 characters for security</p>
            </div>

            {/* Mini benefit row with icons */}
            <div className="grid grid-cols-3 gap-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
              {[
                { Icon: Truck, label: 'Free Shipping' },
                { Icon: Shield, label: 'Secure Payment' },
                { Icon: RotateCcw, label: '30-Day Return' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-center hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <b.Icon className="w-5 h-5 text-slate-600" />
                  <span className="text-[10px] text-slate-600 font-bold">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', animationDelay: '250ms', boxShadow: '0 10px 30px rgba(59,130,246,.3)' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-slate-600 mt-6 pt-6 border-t-2 border-slate-200 font-medium">
              Already have an account?{' '}
              <Link href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Sign In
              </Link>
            </p>
          </form>
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
