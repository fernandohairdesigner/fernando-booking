'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPanel() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin/login')
      return
    }
    loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*, services(name)')
      .eq('status', 'confermata')
      .gte('booking_date', new Date().toISOString().split('T')[0])
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  async function cancelBooking(id) {
    if (!confirm('Cancellare questa prenotazione?')) return
    await supabase.from('bookings').update({ status: 'annullata' }).eq('id', id)
    loadBookings()
  }

  function logout() {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Prenotazioni</h1>
          <button onClick={logout} className="text-sm text-neutral-500 hover:text-neutral-900">
            Esci
          </button>
        </div>

        {loading && <p className="text-neutral-400">Carico...</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-neutral-400">Nessuna prenotazione in programma.</p>
        )}

        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-neutral-900">
                  {b.customer_name} — {b.services?.name}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('it-IT', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}{' '}
                  alle {b.start_time} — Tel: {b.customer_phone}
                </p>
              </div>
              <button
                onClick={() => cancelBooking(b.id)}
                className="text-red-500 text-sm hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5"
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