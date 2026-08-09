'use client';

import React, { useState } from 'react';
import { loginUserAsync, signupUserAsync, UserProfile } from '@/lib/auth';
import { Sparkles, Lock, User, ArrowRight, UserPlus, LogIn, AlertCircle, Star } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }

      setIsLoading(true);
      const result = await signupUserAsync(username, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setError(result.message || 'Signup failed');
      }
    } else {
      setIsLoading(true);
      const result = await loginUserAsync(username, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setError(result.message || 'Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-rose-500 selection:text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/80 relative z-10 flex flex-col items-center">
        {/* Mascot Logo Avatar */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl shadow-amber-500/20 mb-4 bg-amber-100 shrink-0 transform hover:scale-105 transition-transform">
          <img
            src="/logo.png"
            alt="Lernster Mascot Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Lernster</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {isSignup ? 'Create your account to start learning' : 'Welcome back! Log in to continue'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. maria_learner"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password Field (2x for Signup) */}
          {isSignup && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={isSignup}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all mt-2"
          >
            {isSignup ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Log In</span>
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Toggle Login / Signup Mode */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 w-full text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium inline-flex items-center gap-1.5 justify-center"
          >
            {isSignup ? (
              <span>Already have an account? <strong className="text-white underline">Log in here</strong></span>
            ) : (
              <span className="inline-flex items-center gap-1">
                Don't have an account?{' '}
                <strong className="text-white underline inline-flex items-center gap-1">
                  Sign up here
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 inline-block drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                </strong>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
