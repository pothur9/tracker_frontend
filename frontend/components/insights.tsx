import Link from "next/link"
import Image from "next/image"

type Post = {
  tag: string
  date: string
  title: string
  excerpt: string
  author: string
  read: string
  image: string
}

const posts: Post[] = [
  {
    tag: "Market Outlook",
    date: "Dec 15, 2024",
    title: "Why 2024 is the Year for Alternative Investments",
    excerpt:
      "Market volatility creates unique opportunities in PMS and AIF strategies. Our analysis reveals key sectors poised for growth.",
    author: "PMSAIFGuru Research Team",
    read: "8 min read",
    image: "/images/insight-1.jpg",
  },
  {
    tag: "Fund Manager Interview",
    date: "Dec 12, 2024",
    title: "Exclusive: Rajesh Kumar on Value Investing in 2024",
    excerpt:
      "The veteran fund manager shares his insights on identifying undervalued stocks and building resilient portfolios in current market conditions.",
    author: "Priya Mehta, Senior Analyst",
    read: "12 min read",
    image: "/images/insight-2.jpg",
  },
  {
    tag: "Guru's View",
    date: "Dec 10, 2024",
    title: "The Future of Wealth Management: Digital Transformation",
    excerpt:
      "How technology is reshaping HNI investment strategies and what it means for the future of portfolio management services.",
    author: "Founder's Desk",
    read: "6 min read",
    image: "/images/insight-3.jpg",
  },
]

export function Insights() {
  return (
    <section id="insights" className="section">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center subtle max-w-2xl mx-auto">
          Stay ahead with our expert analysis, fund manager interviews, and market insights designed for sophisticated
          investors.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.title} className="card overflow-hidden">
              <Image
                src={p.image || "/placeholder.svg"}
                alt={p.title}
                width={640}
                height={220}
                className="w-full h-[220px] object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="badge-accent-soft">{p.tag}</span>
                  <span className="text-foreground/60">{p.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-brand font-medium">{p.author}</span>
                  <Link href="#" className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground">
                    {p.read} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="#" className="mt-8 btn-primary">
            Read More Insights →
          </Link>
        </div>
      </div>
    </section>
  )
}
