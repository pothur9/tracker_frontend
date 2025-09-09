import Link from "next/link"
import { Phone, Mail, MessageCircle } from "lucide-react"

export function CTABand() {
  return (
    <section id="advisor" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-brand" aria-hidden />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "url('/images/cta-boardroom.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="section relative text-white">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-pretty text-3xl md:text-4xl font-semibold">
              Ready to Elevate Your Investment Strategy?
            </h2>
            <p className="mt-3 text-white/85">
              Join India&apos;s elite investors who trust PMSAIFGuru for superior returns and transparent advisory. Book
              your free consultation today.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="#contact" className="btn-accent">
                Book Free Consultation
              </Link>
              <Link href="#" className="btn-outline">
                Download Research Report
              </Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              <div className="card bg-white/5 border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" /> <span className="font-medium">Call us at</span>
                </div>
                <div className="text-white/90 mt-1">+91 98765 43210</div>
              </div>
              <div className="card bg-white/5 border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" /> <span className="font-medium">Email us at</span>
                </div>
                <div className="text-white/90 mt-1">hello@pmsaifguru.com</div>
              </div>
              <div className="card bg-white/5 border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4" /> <span className="font-medium">WhatsApp us</span>
                </div>
                <div className="text-white/90 mt-1">+91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
