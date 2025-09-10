import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/95" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/images/hero-blue.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="section">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="text-pretty text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Invest Smarter with <span className="text-gold">PMS &amp; AIFs</span>
              </h1>
              <p className="mt-4 max-w-lg text-white/85 leading-relaxed">
                Access curated portfolio management services and alternative investment funds with research‑driven
                insights and transparent advisory.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link href="#funds" className="btn-accent">
                  Explore Strategies
                </Link>
                <Link href="#advisor" className="btn-hero-outline">
                  Talk to an Advisor
                </Link>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/85 text-sm">
                <li>• Research‑driven</li>
                <li>• Curated Funds</li>
                <li>• Transparent Advisory</li>
              </ul>

              <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
                <div className="card-muted px-4 py-3 text-center text-white/90">
                  <div className="text-lg font-semibold">50+</div>
                  <div className="text-xs opacity-90">Curated Strategies</div>
                </div>
                <div className="card-muted px-4 py-3 text-center text-white/90">
                  <div className="text-lg font-semibold">₹2,500+ Cr</div>
                  <div className="text-xs opacity-90">Assets Advised</div>
                </div>
                <div className="card-muted px-4 py-3 text-center text-white/90">
                  <div className="text-lg font-semibold">4.9/5</div>
                  <div className="text-xs opacity-90">Client Rating</div>
                </div>
              </div>
            </div>

            <div className="card bg-white/95 p-2 md:p-3">
              <Image
                src="/images/hero-blue.jpg"
                alt="Advisor reviewing portfolio dashboards"
                width={760}
                height={520}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
