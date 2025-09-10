"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = [
    { href: "#funds", label: "Fund Explorer" },
    { href: "#insights", label: "Insights & Research" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className=" z-40 w-full bg-background/80 backdrop-blur border-b border-black/5">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold text-brand text-lg">
          PMSAIFGuru
          <span className="sr-only">Home</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-foreground/80 hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="rounded-full">
            Client Login
          </Button>
          <Link href="#advisor" className="btn-accent">
            Talk to Advisor
          </Link>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-black/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-background">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm py-1">
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" className="flex-1 rounded-full">
                Client Login
              </Button>
              <Link
                href="#advisor"
                className={cn("btn-accent w-full text-center")}
              >
                Talk to Advisor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
