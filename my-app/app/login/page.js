'use client'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ShowToast } from '@/lib/toastify'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const { data } = await res.json();
      localStorage.setItem('MyData', JSON.stringify(data))
      router.replace('/home')
    } else {
      const { message } = await res.json();
      ShowToast(message, 'red');
    }
  }

  return (
    <>
      <Head>
        <title>Login | MyApp</title>
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-300 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white/25 p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-white drop-shadow-sm">
            Welcome!
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
                placeholder="your_email@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600/90 px-4 py-2 text-lg font-semibold tracking-wide text-white shadow-lg transition hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/90">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-white underline underline-offset-2 hover:text-indigo-200"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
