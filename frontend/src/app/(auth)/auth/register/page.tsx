'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get register action from Zustand store
  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      return setError('Please fill in all fields');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    try {
      setIsSubmitting(true);
      
      // Call the Zustand register action (which delegates to authApi.js)
      const res = await register({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (res?.success) {
        // Retrieve user or nested payload structure to check role
        const user = res.user || res.data?.user || res.data;
        const role = user?.role;

        // Role-based redirection upon successful signup
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'doctor') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError(res?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <form
        className="flex flex-col items-center max-w-md w-full p-8 rounded-2xl bg-white shadow-md border border-slate-200"
        onSubmit={handleRegister}
        noValidate
      >
        {/* BRAND / HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-primary tracking-tight">
            Create Account
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Join MediConnect to manage your healthcare journey
          </p>
        </div>

        {/* NAME INPUT */}
        <div className="w-full mb-4">
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Full Name
          </label>
          <div className="relative w-full">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition"
              required
            />
          </div>
        </div>

        {/* EMAIL INPUT */}
        <div className="w-full mb-4">
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Email Address
          </label>
          <div className="relative w-full">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition"
              required
            />
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div className="w-full mb-4">
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">
            Password (Min 8 characters)
          </label>
          <div className="relative w-full">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary p-1 cursor-pointer transition"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 w-full">
            <p className="text-xs text-center text-rose-600 font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          className="w-full rounded-xl bg-primary border border-slate-900 text-white font-bold text-xs py-3 px-4 shadow-sm hover:bg-slate-800 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2 mb-4"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Creating Account...
            </span>
          ) : (
            'Register'
          )}
        </button>

        {/* FOOTER LINK */}
        <p className="text-xs font-medium text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline ml-1 transition">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}