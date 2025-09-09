import Link from "next/link"
import { Linkedin, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-xl font-semibold">PMSAIFGuru</div>
          <p className="mt-3 text-white/80 text-sm leading-relaxed">
            Your trusted partner for PMS & AIF investments. Research‑driven insights, transparent advisory, and superior
            returns for sophisticated investors.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
              <Linkedin className="size-4" />
            </Link>
            <Link href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
              <Twitter className="size-4" />
            </Link>
            <Link href="#" aria-label="YouTube" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
              <Youtube className="size-4" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Services</h4>
          <ul className="mt-3 space-y-2 text-white/85 text-sm">
            <li>
              <Link href="#" className="hover:underline">
                Portfolio Management Services
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Alternative Investment Funds
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Private Credit
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Wealth Advisory
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Resources</h4>
          <ul className="mt-3 space-y-2 text-white/85 text-sm">
            <li>
              <Link href="#funds" className="hover:underline">
                Fund Explorer
              </Link>
            </li>
            <li>
              <Link href="#insights" className="hover:underline">
                Research & Insights
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Educational Videos
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-white/85 text-sm">
            <li>
              <Link href="#about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Our Team
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-4 text-xs text-white/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} PMSAIFGuru. All rights reserved.</span>
          <span>Designed with care.</span>
        </div>
      </div>
    </footer>
  )
}
