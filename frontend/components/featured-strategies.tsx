import Link from "next/link";
import ParallaxSection from "@/components/ui/parallax-section";

type Strategy = {
  name: string;
  manager: string;
  aum: string;
  metrics: { value: string; label: string }[];
  category: string;
  risk: "Low" | "Moderate" | "High";
  min: string;
};

const strategies: Strategy[] = [
  {
    name: "Alpha Growth PMS",
    manager: "Rajesh Kumar",
    aum: "₹850 Cr",
    metrics: [
      { value: "18.5%", label: "1 Year" },
      { value: "16.2%", label: "3 Years" },
      { value: "14.8%", label: "5 Years" },
    ],
    category: "Large Cap Growth",
    risk: "Moderate",
    min: "₹50 Lakh",
  },
  {
    name: "ValueMax AIF Category II",
    manager: "Priya Sharma",
    aum: "₹420 Cr",
    metrics: [
      { value: "22.1%", label: "1 Year" },
      { value: "19.8%", label: "3 Years" },
      { value: "17.5%", label: "5 Years" },
    ],
    category: "Value Investing",
    risk: "High",
    min: "₹1 Cr",
  },
  {
    name: "TechFocus PMS",
    manager: "Amit Patel",
    aum: "₹680 Cr",
    metrics: [
      { value: "25.3%", label: "1 Year" },
      { value: "21.7%", label: "3 Years" },
      { value: "19.2%", label: "5 Years" },
    ],
    category: "Technology",
    risk: "High",
    min: "₹25 Lakh",
  },
];

// Sparkline for quick performance glance
function Sparkline({ points }: { points: number[] }) {
  const w = 120;
  const h = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(0.001, max - min);
  const stepX = w / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={d} className="stroke-brand" strokeWidth="2" fill="none" />
      {/* faint baseline */}
      <line
        x1="0"
        y1={h - 1}
        x2={w}
        y2={h - 1}
        className="stroke-border"
        strokeWidth="1"
      />
    </svg>
  );
}

function riskClasses(risk: Strategy["risk"]) {
  if (risk === "High") return "bg-red-50 text-red-700 border-red-200";
  if (risk === "Moderate")
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export function FeaturedStrategies() {
  const parseVals = (m: Strategy["metrics"]) =>
    m.map((x) => Number.parseFloat(x.value.replace("%", "")));
  return (
    <ParallaxSection
      bgSrc="/images/strategy-1.jpg"
      speed={0.22}
      overlayClassName="bg-black/12"
    >
      <section id="funds" className="section bg-transparent relative z-10">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="section-title">Featured Investment Strategies</h2>
            <p className="mt-3 subtle max-w-2xl mx-auto">
              Handpicked PMS and AIF strategies from India&apos;s top fund
              managers, delivering consistent alpha for our clients.
            </p>
          </div>

          {/* make columns equal height to avoid misalignment */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {strategies.map((s) => (
              <article
                key={s.name}
                className="card p-5 md:p-6 transition-all hover:shadow-xl hover:-translate-y-1 ring-1 ring-transparent hover:ring-brand/30 h-full flex flex-col overflow-hidden"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-foreground clamp-2 hyphens-auto">
                      {s.name}
                    </h3>
                    <p className="text-sm text-foreground/70 truncate">
                      by {s.manager}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-foreground/60">AUM</span>
                    <div className="mt-0.5 inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 whitespace-nowrap">
                      <span className="font-semibold text-brand">{s.aum}</span>
                    </div>
                  </div>
                </div>

                {/* KPI row with sparkline */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {s.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-md border border-border bg-background px-3 py-3 text-center"
                    >
                      <div className="text-base font-bold text-accent">
                        {m.value}
                      </div>
                      <div className="text-xs text-foreground/65 whitespace-nowrap">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-md border border-border bg-muted/40 p-2">
                  <Sparkline points={parseVals(s.metrics)} />
                </div>

                {/* Meta */}
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 min-w-0">
                    <dt className="text-foreground/70">Category</dt>
                    <dd className="font-medium text-right truncate">
                      {s.category}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                    <dt className="text-foreground/70">Risk</dt>
                    <dd
                      className={`font-medium rounded-full border px-2 py-0.5 whitespace-nowrap ${riskClasses(
                        s.risk
                      )}`}
                    >
                      {s.risk}
                    </dd>
                  </div>
                  <div className="col-span-2 flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                    <dt className="text-foreground/70">Min Investment</dt>
                    <dd className="font-semibold whitespace-nowrap">{s.min}</dd>
                  </div>
                </dl>

                <Link
                  href="#"
                  className="mt-5 w-full btn-primary text-center mt-auto"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="#funds" className="mt-8 btn-accent">
              Explore All Funds →
            </Link>
          </div>
        </div>
      </section>
    </ParallaxSection>
  );
}
