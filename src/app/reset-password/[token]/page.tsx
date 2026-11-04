'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Lock, Eye, EyeOff, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useParams } from 'next/navigation';

function ResetPasswordContent() {
  const params = useParams();
  const token = params.token as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  // Validate token on mount (optional - can happen on form submit)
  useEffect(() => {
    // Token will be validated when user tries to submit
    setTokenValidating(false);
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setTokenInvalid(true);
          setError(data.error || 'Invalid or expired reset token');
        } else {
          setError(data.error || 'Failed to reset password');
        }
      } else {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  if (tokenValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Verifying reset token...</p>
        </div>
      </div>
    );
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
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-3">Create New Password</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            Your password is the key to your account security. Make it strong and unique to protect your information.
          </p>

          {/* Security tips */}
          <div className="space-y-3 text-left">
            {[
              { Icon: Lock, text: 'Use at least 6 characters' },
              { Icon: CheckCircle2, text: 'Mix uppercase and lowercase' },
              { Icon: CheckCircle2, text: 'Include numbers and symbols' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <item.Icon className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white lg:bg-gradient-to-b lg:from-white lg:to-slate-50">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-700">

          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,.25)' }}>
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reset Password</p>
          </div>

          {tokenInvalid ? (
            <>
              {/* Invalid Token State */}
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50 border-2 border-red-200">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">Link Expired</h2>
                <p className="text-slate-600 text-sm mb-8">
                  This password reset link has expired or is invalid. Password reset links expire after 24 hours for security.
                </p>

                <Link 
                  href="/forgot-password" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 10px 30px rgba(59,130,246,.3)' }}
                >
                  Request New Reset Link
                </Link>

                <Link 
                  href="/signin" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all mt-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : !success ? (
            <>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Reset Password</h1>
              <p className="text-sm text-slate-600 mb-8">Enter your new password below.</p>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 animate-in shake font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Password Input */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
                  <label className="text-xs font-bold text-slate-700 block mb-2">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required 
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      required 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading || !password || !confirmPassword}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500" 
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', animationDelay: '150ms', boxShadow: '0 10px 30px rgba(59,130,246,.3)' }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                {/* Back to Sign In */}
                <Link 
                  href="/signin" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: '200ms' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-50 border-2 border-emerald-200 animate-in bounce duration-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">Password Reset Successful!</h2>
                <p className="text-slate-600 text-sm mb-8">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>

                <Link 
                  href="/signin" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 10px 30px rgba(59,130,246,.3)' }}
                >
                  <Lock className="w-4 h-4" />
                  Go to Sign In
                </Link>
              </div>
            </>
          )}
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
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
