import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request) {
  const session = request.cookies.get('admin_session')?.value
  if (session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, services(name)')
    .eq('status', 'confermata')
    .gte('booking_date', new Date().toISOString().split('T')[0])
    .order('booking_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings: data })
}