'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Password errata')
      return
    }

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-espresso text-avorio flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm text-center">
        <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-4">
          Area riservata
        </p>
        <h1 className="font-display italic text-3xl mb-10">Bentornato</h1>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-avorio/20 focus:border-bronzo px-1 py-3 text-avorio text-center placeholder:text-avorio/45 focus:outline-none transition-colors font-body mb-6"
        />
        {error && <p className="text-terracotta text-sm font-body mb-4">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-bronzo hover:bg-bronzo-light text-espresso py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? 'Verifico...' : 'Entra'}
        </button>
      </form>
    </main>
  )
}