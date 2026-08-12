import { Fraunces, Manrope } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Fernando Hair Designer — Prenota il tuo appuntamento online",
  description:
    "Prenota online il tuo appuntamento da Fernando Hair Designer a Lecce/Cavallino. Taglio, colore, piega e altri servizi, in pochi clic.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}