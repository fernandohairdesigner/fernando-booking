import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('price', { ascending: true })

  if (servicesError) {
    console.error('ERRORE SUPABASE SERVICES:', JSON.stringify(servicesError))
  }
  console.log('Servizi trovati:', services?.length ?? 'null')

  return (
    <main className="bg-espresso text-avorio">
      {/* Hero */}
      <section className="relative h-screen min-h-170 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2000&auto=format&fit=crop"
          alt="Interno del salone"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/60 to-espresso/20" />
        <div className="absolute inset-0 bg-espresso/20" />

        <div className="relative z-10 px-6 md:px-12 pb-20 md:pb-28 w-full">
          <div className="max-w-5xl mx-auto">
            <p className="font-body uppercase tracking-[0.35em] text-bronzo-light text-xs md:text-sm mb-6">
              Lecce · Cavallino — Dal taglio alla trasformazione
            </p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
              Fernando
              <br />
              <span className="italic text-bronzo-light">Hair Designer</span>
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/prenota"
                className="bg-bronzo hover:bg-bronzo-light text-espresso px-8 py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300"
              >
                Prenota il tuo appuntamento
              </Link>
              <Link
                href="/#servizi"
                className="text-avorio/85 hover:text-avorio border-b border-avorio/40 hover:border-avorio pb-1 font-body text-sm tracking-wide transition-colors"
              >
                Scopri i servizi ↓
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Striscia scorrevole */}
      <div className="bg-bronzo text-espresso py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee">
          {Array(2).fill(0).map((_, i) => (
            <span key={i} className="inline-flex items-center font-body font-semibold tracking-[0.2em] text-xs uppercase">
              {['Taglio', 'Colore', 'Piega', 'Barba', 'Trattamenti'].map((t) => (
                <span key={t} className="mx-6 flex items-center gap-6">
                  {t} <span className="opacity-60">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Filosofia */}
      <section id="filosofia" className="px-6 md:px-12 py-24 md:py-36">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative h-95 md:h-120 rounded-sm overflow-hidden order-2 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1400&auto=format&fit=crop"
              alt="Dettaglio lavoro del salone"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs md:text-sm mb-6">
              La filosofia
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6">
              Ogni taglio racconta
              <span className="italic text-bronzo-light"> una storia</span>
            </h2>
            <p className="text-avorio/80 font-body leading-relaxed max-w-md">
              Nel cuore del Salento, uniamo tecnica e attenzione ai dettagli per
              creare uno stile che ti somiglia davvero — un&apos;esperienza curata
              dal primo consulto fino all&apos;ultimo tocco di forbice.
            </p>
          </div>
        </div>
      </section>

      {/* Servizi — lista editoriale */}
      <section id="servizi" className="px-6 md:px-12 py-24 md:py-36 bg-espresso-light">
        <div className="max-w-4xl mx-auto">
          <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs md:text-sm mb-4 text-center">
            Il listino
          </p>
          <h2 className="font-display italic text-3xl md:text-5xl mb-16 text-center">
            I nostri servizi
          </h2>

          <div>
            {services?.map((s, i) => (
              <div
                key={s.id}
                className="group flex items-center justify-between gap-6 py-6 border-b border-avorio/10 hover:border-bronzo/50 transition-colors duration-300"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-body text-bronzo/70 text-sm w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-avorio group-hover:text-bronzo-light transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-avorio/55 text-xs mt-1 font-body tracking-wide">
                      {s.duration_minutes} min
                    </p>
                  </div>
                </div>
                <span className="font-display italic text-xl md:text-2xl text-bronzo-light whitespace-nowrap">
                  € {s.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citazione */}
      <section className="px-6 py-24 md:py-32 text-center">
        <p className="font-display italic text-2xl md:text-4xl max-w-2xl mx-auto leading-snug text-avorio/95">
          &ldquo;La bellezza autentica nasce dove la tecnica incontra la cura per
          il dettaglio.&rdquo;
        </p>
        <p className="font-body text-bronzo text-sm tracking-[0.2em] uppercase mt-6">
          — Fernando
        </p>
      </section>

      {/* Contatti */}
      <section id="contatti" className="px-6 md:px-12 py-24 md:py-32 bg-espresso-light">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-body uppercase tracking-[0.3em] text-bronzo text-xs md:text-sm mb-4">
            Vieni a trovarci
          </p>
          <h2 className="font-display italic text-3xl md:text-5xl mb-10">
            Dove siamo
          </h2>

          <div className="space-y-3 font-body text-avorio/85 mb-10">
            <p>Via Roma 66, Cavallino (LE)</p>
            <a href="tel:+390000000000" className="block hover:text-bronzo-light transition-colors">
              +39 000 000 0000
            </a>
            <p className="text-avorio/55 text-sm">Mar–Sab, orari da confermare</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/prenota"
              className="bg-bronzo hover:bg-bronzo-light text-espresso px-8 py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300"
            >
              Prenota ora
            </Link>
            <a
              href="https://wa.me/390000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-avorio/25 text-avorio/85 hover:border-bronzo-light hover:text-bronzo-light px-8 py-4 rounded-full font-body font-semibold tracking-wide transition-colors duration-300"
            >
              Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-avorio/10 px-6 py-12 text-center">
        <p className="font-display italic text-lg text-avorio/70">
          Fernando Hair Designer
        </p>
        <p className="text-avorio/45 text-xs mt-3 font-body tracking-wide">
          © {new Date().getFullYear()} — Tutti i diritti riservati
        </p>
      </footer>
    </main>
  )
}