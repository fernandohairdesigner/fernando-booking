import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const body = await request.json()
  const { serviceId, date, startTime, name, phone, email } = body

  if (!serviceId || !date || !startTime || !name || !phone) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const { data: service } = await supabase
    .from('services')
    .select('name, duration_minutes')
    .eq('id', serviceId)
    .single()

 const [h, m] = startTime.split(':').map(Number)
  const endMinutes = h * 60 + m + service.duration_minutes
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`

  // Controllo anti-doppia-prenotazione: verifica che nessuno abbia preso questo slot nel frattempo
  const { data: conflicting } = await supabase
    .from('bookings')
    .select('id, start_time, end_time')
    .eq('booking_date', date)
    .neq('status', 'annullata')

  const hasConflict = conflicting?.some((b) => {
    const [bsH, bsM] = b.start_time.split(':').map(Number)
    const [beH, beM] = b.end_time.split(':').map(Number)
    const bStart = bsH * 60 + bsM
    const bEnd = beH * 60 + beM
    const newStart = h * 60 + m
    const newEnd = endMinutes
    return newStart < bEnd && newEnd > bStart
  })

  if (hasConflict) {
    return NextResponse.json(
      { error: 'Questo orario è appena stato prenotato da qualcun altro. Scegline un altro.' },
      { status: 409 }
    )
  }

  const { data: newBooking, error } = await supabase
    .from('bookings')
    .insert({
      service_id: serviceId,
      booking_date: date,
      start_time: startTime,
      end_time: endTime,
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const dataFormattata = new Date(date + 'T12:00:00').toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Email al cliente (solo se ha inserito l'email)
  if (email) {
    try {
      await resend.emails.send({
        from: 'Fernando Hair Designer <onboarding@resend.dev>',
        to: email,
        subject: 'Prenotazione confermata ✂️',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Prenotazione confermata!</h2>
            <p>Ciao ${name},</p>
            <p>Il tuo appuntamento è confermato:</p>
            <ul>
              <li><strong>Servizio:</strong> ${service.name}</li>
              <li><strong>Data:</strong> ${dataFormattata}</li>
              <li><strong>Ora:</strong> ${startTime}</li>
            </ul>
            <p>Ti aspettiamo da Fernando Hair Designer!</p>
            <p style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/annulla/${newBooking.cancel_token}" style="color: #666;">
                Vuoi disdire? Clicca qui
              </a>
            </p>
          </div>
        `,
      })
    } catch (e) {
      console.error('Errore invio email cliente:', e)
    }
  }

  // Notifica al salone (sostituisci con la vera email del salone quando la sai)
  try {
    await resend.emails.send({
      from: 'Prenotazioni Sito <onboarding@resend.dev>',
      to: 'info.riccardodeblasi@gmail.com',
      subject: `Nuova prenotazione: ${name}`,
      html: `
        <p>Nuova prenotazione ricevuta dal sito:</p>
        <ul>
          <li><strong>Cliente:</strong> ${name}</li>
          <li><strong>Telefono:</strong> ${phone}</li>
          <li><strong>Servizio:</strong> ${service.name}</li>
          <li><strong>Data:</strong> ${dataFormattata}</li>
          <li><strong>Ora:</strong> ${startTime}</li>
        </ul>
      `,
    })
  } catch (e) {
    console.error('Errore invio notifica salone:', e)
  }

  return NextResponse.json({ success: true })
}