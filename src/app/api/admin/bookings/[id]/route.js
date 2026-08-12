import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request, { params }) {
  const session = request.cookies.get('admin_session')?.value
  if (session !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { id } = params

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'annullata' })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}