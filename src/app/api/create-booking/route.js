import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { serviceId, date, startTime, name, phone, email } = body

  if (!serviceId || !date || !startTime || !name || !phone) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  const [h, m] = startTime.split(':').map(Number)
  const endMinutes = h * 60 + m + service.duration_minutes
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`

  const { error } = await supabase.from('bookings').insert({
    service_id: serviceId,
    booking_date: date,
    start_time: startTime,
    end_time: endTime,
    customer_name: name,
    customer_phone: phone,
    customer_email: email || null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}