'use client'

import { useEffect, useRef, useState } from 'react'

const GIORNI = ['lu', 'ma', 'me', 'gi', 've', 'sa', 'do']
const MESI = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
]

function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function CustomDatePicker({ value, onChange, min }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = min ? new Date(min + 'T00:00:00') : today

  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(value + 'T00:00:00') : new Date(minDate)
  )

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstOfMonth = new Date(year, month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  function isBeforeMin(d) {
    return d < minDate
  }

  function isSameDay(a, b) {
    return a && b && a.toDateString() === b.toDateString()
  }

  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'gg/mm/aaaa'

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  const canGoPrev = new Date(year, month, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-transparent border-b border-avorio/20 hover:border-bronzo/60 px-1 py-3 text-left font-body transition-colors"
      >
        <span className={selectedDate ? 'text-avorio' : 'text-avorio/45'}>{displayLabel}</span>
        <svg className="w-4 h-4 text-bronzo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 bg-espresso-light border border-avorio/10 rounded-xl shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="text-avorio/60 hover:text-bronzo-light disabled:opacity-20 disabled:hover:text-avorio/60 px-2"
            >
              ‹
            </button>
            <p className="font-display italic text-avorio">
              {MESI[month]} {year}
            </p>
            <button type="button" onClick={nextMonth} className="text-avorio/60 hover:text-bronzo-light px-2">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {GIORNI.map((g) => (
              <div key={g} className="text-center text-avorio/40 text-xs font-body uppercase">
                {g}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  disabled={isBeforeMin(d)}
                  onClick={() => {
                    onChange(toISO(d))
                    setOpen(false)
                  }}
                  className={`h-9 rounded-full text-sm font-body transition-colors ${
                    isSameDay(d, selectedDate)
                      ? 'bg-bronzo text-espresso font-semibold'
                      : isBeforeMin(d)
                      ? 'text-avorio/20 cursor-not-allowed'
                      : 'text-avorio/80 hover:bg-bronzo/20'
                  }`}
                >
                  {d.getDate()}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}