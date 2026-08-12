'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function Annulla() {
  const { token } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    fetch(`/api/cancel-booking?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data.booking)
        setLoading(false)
      })
  }, [token])

  async function handleCancel() {
    await fetch('/api/cancel-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setCancelled(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-espresso text-avorio flex items-center justify-center">
        <p className="text-avorio/45 font-body">Carico...</p>
      </main>
    )
  }

  if (!booking || booking.status === 'annullata' || cancelled) {
    return (
      <main className="min-h-screen bg-espresso text-avorio flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-6">
            {cancelled ? 'Fatto' : 'Link non valido'}
          </p>
          <h1 className="font-display italic text-3xl md:text-4xl mb-6">
            {cancelled ? 'Prenotazione annullata' : 'Nessuna prenotazione trovata'}
          </h1>
          <p className="text-avorio/65 font-body leading-relaxed">
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
    <main className="min-h-screen bg-espresso text-avorio flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-6">
          Annulla prenotazione
        </p>
        <h1 className="font-display italic text-3xl md:text-4xl mb-4">
          {booking.services?.name}
        </h1>
        <p className="text-avorio/65 font-body mb-10">
          {dataFormattata} alle {booking.start_time}
        </p>
        <button
          onClick={handleCancel}
          className="bg-terracotta hover:bg-terracotta/80 text-espresso px-10 py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300"
        >
          Conferma annullamento
        </button>
      </div>
    </main>
  )
}