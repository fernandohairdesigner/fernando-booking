'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CustomSelect from '@/components/CustomSelect'
import CustomDatePicker from '@/components/CustomDatePicker'

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
      setError(result.error)
      if (res.status === 409) {
        setSelectedSlot('')
        fetch(`/api/available-slots?date=${date}&serviceId=${serviceId}`)
          .then((r) => r.json())
          .then((data) => setSlots(data.slots || []))
      }
      return
    }

    setDone(true)
  }

  const today = new Date().toISOString().split('T')[0]

  const inputClasses =
    'w-full bg-transparent border-b border-avorio/20 focus:border-bronzo px-1 py-3 text-avorio placeholder:text-avorio/45 focus:outline-none transition-colors font-body'

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} — €${s.price} (${s.duration_minutes} min)`,
  }))

  if (done) {
    return (
      <main className="min-h-screen bg-espresso text-avorio flex items-center justify-center px-6 pt-20">
        <div className="max-w-md text-center">
          <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-6">
            Prenotazione confermata
          </p>
          <h1 className="font-display italic text-4xl md:text-5xl mb-6">
            A prestissimo!
          </h1>
          <p className="text-avorio/70 font-body leading-relaxed">
            Ti aspettiamo il {new Date(date + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle {selectedSlot}.
            <br />
            Ti abbiamo mandato una email di conferma.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-espresso text-avorio px-6 pt-32 pb-24">
      <div className="max-w-lg mx-auto">
        <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs mb-4 text-center">
          Prenota
        </p>
        <h1 className="font-display italic text-4xl md:text-5xl mb-12 text-center">
          Il tuo appuntamento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
              Servizio
            </label>
            <CustomSelect
              options={serviceOptions}
              value={serviceId}
              onChange={setServiceId}
              placeholder="Seleziona un servizio"
            />
          </div>

          <div>
            <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
              Data
            </label>
            <CustomDatePicker value={date} onChange={setDate} min={today} />
          </div>

          {date && serviceId && (
            <div>
              <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
                Orario
              </label>
              {loadingSlots && (
                <p className="text-avorio/45 text-sm font-body">Carico gli orari disponibili...</p>
              )}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-avorio/45 text-sm font-body">
                  Nessun orario disponibile in questo giorno.
                </p>
              )}
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 rounded-full text-sm font-body border transition-colors duration-300 ${
                      selectedSlot === slot
                        ? 'bg-bronzo text-espresso border-bronzo font-semibold'
                        : 'border-avorio/20 text-avorio/75 hover:border-bronzo-light'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedSlot && (
            <div className="space-y-8 pt-4 border-t border-avorio/10">
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
                  Nome e cognome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Il tuo numero"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.2em] text-avorio/60 mb-3">
                  Email (facoltativa)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                  placeholder="La tua email"
                />
              </div>

              {error && <p className="text-terracotta text-sm font-body">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-bronzo hover:bg-bronzo-light text-espresso py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300 disabled:opacity-40"
              >
                {submitting ? 'Invio in corso...' : 'Conferma prenotazione'}
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}