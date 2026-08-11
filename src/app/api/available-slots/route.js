import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!date || !serviceId) {
    return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 })
  }

  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  const dayOfWeek = new Date(date + 'T12:00:00').getDay()

  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!hours || hours.closed) {
    return NextResponse.json({ slots: [] })
  }

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('booking_date', date)
    .neq('status', 'annullata')

  const duration = service.duration_minutes
  const slots = []
  let [openH, openM] = hours.open_time.split(':').map(Number)
  const [closeH, closeM] = hours.close_time.split(':').map(Number)

  let current = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  while (current + duration <= closeMinutes) {
    const slotStart = current
    const slotEnd = current + duration

    const overlaps = existingBookings?.some((b) => {
      const [bsH, bsM] = b.start_time.split(':').map(Number)
      const [beH, beM] = b.end_time.split(':').map(Number)
      const bStart = bsH * 60 + bsM
      const bEnd = beH * 60 + beM
      return slotStart < bEnd && slotEnd > bStart
    })

    if (!overlaps) {
      const h = String(Math.floor(slotStart / 60)).padStart(2, '0')
      const m = String(slotStart % 60).padStart(2, '0')
      slots.push(`${h}:${m}`)
    }

    current += 30 // proponiamo uno slot ogni 30 minuti
  }

  return NextResponse.json({ slots })
}