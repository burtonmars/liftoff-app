'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liftoff</h1>
          <p className="mt-1 text-sm text-gray-500">Drop the weight. Do the thing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold text-sm disabled:opacity-50 transition-opacity min-h-[52px]"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
