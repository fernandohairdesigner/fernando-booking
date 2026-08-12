'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/#filosofia', label: 'Filosofia' },
    { href: '/#servizi', label: 'Servizi' },
    { href: '/#contatti', label: 'Contatti' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-espresso/70 border-b border-avorio/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display italic text-xl text-avorio" onClick={() => setOpen(false)}>
          Fernando
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-body text-sm tracking-wide text-avorio/75">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-bronzo-light transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/prenota"
            className="bg-bronzo hover:bg-bronzo-light text-espresso px-5 py-2.5 rounded-full font-body text-sm font-semibold tracking-wide transition-colors duration-300"
          >
            Prenota
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Apri menu"
          >
            <span className={`block w-6 h-px bg-avorio transition-transform ${open ? 'rotate-45 translate-y-0.75' : ''}`} />
            <span className={`block w-6 h-px bg-avorio transition-transform ${open ? '-rotate-45 -translate-y-0.75' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col items-center gap-6 py-8 border-t border-avorio/10 font-body text-avorio/85">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-lg hover:text-bronzo-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}