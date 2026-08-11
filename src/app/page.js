import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default async function Home() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('price', { ascending: true })

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Fernando Hair Designer
          </h1>
          <p className="mt-4 text-neutral-300 text-lg">
            Prenota il tuo appuntamento online, in pochi secondi.
          </p>
          <Link
            href="/prenota"
            className="inline-block mt-8 bg-white text-neutral-900 px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition"
          >
            Prenota ora
          </Link>
        </div>
      </section>

      {/* Servizi */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-10 text-center">
          I nostri servizi
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services?.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition"
            >
              <h3 className="font-medium text-neutral-900 text-lg">{s.name}</h3>
              <p className="text-neutral-500 text-sm mt-1">{s.duration_minutes} min</p>
              <p className="text-neutral-900 font-semibold mt-3">€{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contatti */}
      <section className="bg-white border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Dove siamo</h2>
          <p className="text-neutral-500">Lecce / Cavallino (LE)</p>
        </div>
      </section>
    </main>
  )
}