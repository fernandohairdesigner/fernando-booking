'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    const res = await fetch('/api/admin/bookings')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  async function cancelBooking(id) {
    if (!confirm('Cancellare questa prenotazione?')) return
    await fetch(`/api/admin/bookings/${id}`, { method: 'POST' })
    loadBookings()
  }

  async function logout() {
    await fetch('/api/admin-logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <main className="min-h-screen bg-espresso text-avorio px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-3">
              Area riservata
            </p>
            <h1 className="font-display italic text-3xl md:text-4xl">Prenotazioni</h1>
          </div>
          <button
            onClick={logout}
            className="text-avorio/55 hover:text-avorio text-sm font-body tracking-wide transition-colors"
          >
            Esci
          </button>
        </div>

        {loading && <p className="text-avorio/45 font-body">Carico...</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-avorio/45 font-body">Nessuna prenotazione in programma.</p>
        )}

        <div>
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center gap-6 py-6 border-b border-avorio/10"
            >
              <div>
                <p className="font-display text-lg text-avorio">
                  {b.customer_name} <span className="text-bronzo-light italic">— {b.services?.name}</span>
                </p>
                <p className="text-sm text-avorio/55 mt-1 font-body">
                  {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('it-IT', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}{' '}
                  alle {b.start_time} · Tel: {b.customer_phone}
                </p>
              </div>
              <button
                onClick={() => cancelBooking(b.id)}
                className="text-terracotta text-sm font-body hover:text-avorio border border-terracotta/40 hover:border-avorio/40 rounded-full px-4 py-2 transition-colors whitespace-nowrap"
              >
                Cancella
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}