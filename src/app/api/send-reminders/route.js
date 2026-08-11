import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request) {
  // Protezione: solo Vercel (con il segreto giusto) può chiamare questa API
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split('T')[0]

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .eq('booking_date', tomorrowDate)
    .eq('status', 'confermata')
    .eq('reminder_sent', false)
    .not('customer_email', 'is', null)

  let sentCount = 0

  for (const b of bookings || []) {
    try {
      await resend.emails.send({
        from: 'Fernando Hair Designer <onboarding@resend.dev>',
        to: b.customer_email,
        subject: 'Promemoria: il tuo appuntamento è domani ✂️',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Ti aspettiamo domani!</h2>
            <p>Ciao ${b.customer_name},</p>
            <p>Ti ricordiamo il tuo appuntamento:</p>
            <ul>
              <li><strong>Servizio:</strong> ${b.services?.name}</li>
              <li><strong>Ora:</strong> ${b.start_time}</li>
            </ul>
            <p>A domani da Fernando Hair Designer!</p>
            <p style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/annulla/${b.cancel_token}" style="color: #666;">
                Non puoi venire? Clicca qui per disdire
              </a>
            </p>
          </div>
        `,
      })
      await supabase.from('bookings').update({ reminder_sent: true }).eq('id', b.id)
      sentCount++
    } catch (e) {
      console.error(`Errore invio promemoria a ${b.customer_email}:`, e)
    }
  }

  return NextResponse.json({ success: true, sent: sentCount })
}