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

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              {/* Continue with Google */}
              <Link href="/api/auth/google"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 transition-all border-2 border-slate-200 hover:border-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: '300ms' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Link>

              {/* Continue with GitHub */}
              <Link href="/api/auth/github"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 transition-all border-2 border-slate-200 hover:border-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: '350ms' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.903-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.597 9.597 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Continue with GitHub
              </Link>
            </div>

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
