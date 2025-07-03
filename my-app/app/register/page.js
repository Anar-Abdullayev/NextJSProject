'use client'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShowToast } from '@/lib/toastify'

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const data = await res.json();
      if (data.status === 200)
        router.push('/login')
      else {
        ShowToast(data.message, 'red');
      }

    }
  }

  return (
    <>
      <Head>
        <title>Create Account | MyApp</title>
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white/30 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="mb-6 text-center text-3xl font-bold text-white drop-shadow-sm">
            Create Your Account
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-white"
              >
                Surname
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Surname"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your_email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
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
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border-0 bg-white/80 px-4 py-2 text-gray-800 placeholder-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600/90 px-4 py-2 text-lg font-semibold tracking-wide text-white shadow-lg transition hover:bg-emerald-700/90 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/90">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-white underline underline-offset-2 hover:text-emerald-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
