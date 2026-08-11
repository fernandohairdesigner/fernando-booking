'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Annulla() {
  const { token } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    supabase
      .from('bookings')
      .select('*, services(name)')
      .eq('cancel_token', token)
      .single()
      .then(({ data }) => {
        setBooking(data)
        setLoading(false)
      })
  }, [token])

  async function handleCancel() {
    await supabase.from('bookings').update({ status: 'annullata' }).eq('cancel_token', token)
    setCancelled(true)
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-neutral-400">Carico...</main>
  }

  if (!booking || booking.status === 'annullata' || cancelled) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white rounded-2xl p-10 shadow-sm border border-neutral-100">
          <h1 className="text-xl font-semibold text-neutral-900">
            {cancelled ? 'Prenotazione annullata' : 'Nessuna prenotazione trovata'}
          </h1>
          <p className="text-neutral-500 mt-3">
            {cancelled
              ? 'Il tuo appuntamento è stato disdetto. A presto!'
              : 'Questo link non è più valido.'}
          </p>
        </div>
      </main>
    )
  }

  const dataFormattata = new Date(booking.booking_date + 'T12:00:00').toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center bg-white rounded-2xl p-10 shadow-sm border border-neutral-100">
        <h1 className="text-xl font-semibold text-neutral-900">Annulla prenotazione</h1>
        <p className="text-neutral-500 mt-3">
          {booking.services?.name} — {dataFormattata} alle {booking.start_time}
        </p>
        <button
          onClick={handleCancel}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition"
        >
          Conferma annullamento
        </button>
      </div>
    </main>
  )
}