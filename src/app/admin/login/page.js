'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin')
    } else {
      setError('Password errata')
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-neutral-900 mb-6">Area riservata</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button className="w-full bg-neutral-900 text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition">
          Entra
        </button>
      </form>
    </main>
  )
}