"use client"

import Image from "next/image"
import { Star } from "lucide-react"

export function TrustStats() {
  return (
    <section className="section">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: headline + stats */}
          <div>
            <h2 className="section-title">
              Trusted by India&apos;s <span className="text-gold">Elite</span> Investors
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-6 max-w-lg">
              {[
                { k: "₹2,500+ Cr", v: "Assets Under Advisory" },
                { k: "500+", v: "HNI Clients" },
                { k: "50+", v: "Curated Strategies" },
                { k: "15%", v: "Avg Annual Returns" },
              ].map((s) => (
                <div key={s.k} className="card p-5">
                  <div className="text-2xl font-bold text-brand">{s.k}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={`/avatars/client-${i}.jpg`}
                    alt="Client avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-border object-cover"
                  />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-brand">500+ Happy Clients</span>
                <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 fill-gold text-gold" /> 4.9/5 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Right: testimonials */}
          <div className="grid gap-5">
            {[
              {
                quote:
                  "“PMSAIFGuru helped us diversify into alternative investments with transparency and excellent returns.”",
                name: "Rajesh Sharma",
                title: "Family Office CEO",
              },
              {
                quote:
                  "“The digital platform makes it effortless to track my PMS investments from Singapore. Highly recommended!”",
                name: "Priya Mehta",
                title: "NRI Investor",
              },
              {
                quote: "“Their research‑driven approach and unbiased advice helped me reach my wealth goals faster.”",
                name: "Amit Patel",
                title: "Serial Entrepreneur",
              },
            ].map((t) => (
              <blockquote key={t.name} className="card p-6">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold" />
                  ))}
                </div>
                <p className="mt-3 text-pretty">{t.quote}</p>
                <footer className="mt-4 text-sm">
                  <span className="font-semibold text-brand">{t.name}</span>
                  <span className="text-muted-foreground"> — {t.title}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
