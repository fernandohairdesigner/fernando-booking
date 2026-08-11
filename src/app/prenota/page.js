'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Prenota() {
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true })
      .then(({ data }) => setServices(data || []))
  }, [])

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([])
      return
    }
    setLoadingSlots(true)
    setSelectedSlot('')
    fetch(`/api/available-slots?date=${date}&serviceId=${serviceId}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .finally(() => setLoadingSlots(false))
  }, [serviceId, date])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/create-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, date, startTime: selectedSlot, name, phone, email }),
    })

    const result = await res.json()
    setSubmitting(false)

    if (result.error) {
      setError('Si è verificato un errore. Riprova o chiamaci direttamente.')
      return
    }

    setDone(true)
  }

  const today = new Date().toISOString().split('T')[0]

  if (done) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white rounded-2xl p-10 shadow-sm border border-neutral-100">
          <h1 className="text-2xl font-semibold text-neutral-900">Prenotazione confermata!</h1>
          <p className="text-neutral-500 mt-3">
            Ti aspettiamo il {date} alle {selectedSlot}. A presto!
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-8">Prenota il tuo appuntamento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Servizio</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">Seleziona un servizio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — €{s.price} ({s.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Data</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {date && serviceId && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Orario</label>
              {loadingSlots && <p className="text-neutral-400 text-sm">Carico gli orari disponibili...</p>}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-neutral-400 text-sm">Nessun orario disponibile in questo giorno.</p>
              )}
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-sm border transition ${
                      selectedSlot === slot
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedSlot && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Nome e cognome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Telefono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email (facoltativa)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-neutral-900 text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submitting ? 'Invio in corso...' : 'Conferma prenotazione'}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  )
}