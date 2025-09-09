"use client";

import {
  BarChart3,
  ShieldCheck,
  Layers,
  Smartphone,
  GraduationCap,
  Headphones,
} from "lucide-react";

const items = [
  {
    title: "Data‑Driven Insights",
    desc: "Performance data, risk analytics, and market intelligence for informed decisions.",
    Icon: BarChart3,
  },
  {
    title: "Fiduciary Approach",
    desc: "Unbiased advisory with complete transparency and zero conflicts of interest.",
    Icon: ShieldCheck,
  },
  {
    title: "Curated Portfolio",
    desc: "Handpicked PMS and AIF strategies rigorously evaluated for risk and return.",
    Icon: Layers,
  },
  {
    title: "Digital Experience",
    desc: "Seamless onboarding and real‑time portfolio tracking via our premium platform.",
    Icon: Smartphone,
  },
  {
    title: "Expert Research",
    desc: "In‑depth fund manager interviews, strategy analysis, and market outlooks.",
    Icon: GraduationCap,
  },
  {
    title: "Dedicated Support",
    desc: "Personal relationship manager and expert advisory at every step.",
    Icon: Headphones,
  },
];

export function WhyChoose() {
  return (
    <section className="section ">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-title text-brand">Why Choose PMSAIFGuru?</h2>
          <p className="mt-3 subtle">
            We combine cutting‑edge technology with deep market expertise to
            deliver superior investment outcomes for sophisticated investors.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, desc, Icon }) => (
            <div key={title} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-xl bg-gold-soft p-3">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-brand heading-sm-strong">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
