import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mancante' }, { status: 400 })
  }

  const { data } = await supabaseAdmin
    .from('bookings')
    .select('*, services(name)')
    .eq('cancel_token', token)
    .single()

  return NextResponse.json({ booking: data || null })
}

export async function POST(request) {
  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: 'Token mancante' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'annullata' })
    .eq('cancel_token', token)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}