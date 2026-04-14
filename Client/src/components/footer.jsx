import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    const currentYear = new Date().getFullYear();
  return (
   <footer className="w-full bg-zinc-900 border-t border-zinc-800 px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Brand & Tagline */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-lg font-bold tracking-tight text-emerald-800">
            DevHive
          </span>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
            © 2026 DevHive. Built for the neon architect.
          </p>
        </div>

        {/* Right Side: Links */}
        <nav className="flex items-center gap-6">
          {["Privacy", "Terms", "Github", "Discord"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm text-zinc-400 transition-colors hover:text-emerald-500"
            >
              {item}
            </Link>
          ))}
        </nav>
        
      </div>
    </footer>
  )
}

export default Footer