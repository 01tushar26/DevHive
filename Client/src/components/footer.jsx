import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    const currentYear = new Date().getFullYear();
  return (
   <footer className="w-full bg-surface-container-low border-t border-outline-variant/10 px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Brand & Tagline */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-lg font-bold tracking-tight text-primary-container font-headline">
            DevHive
          </span>
          <p className="text-[11px] text-outline uppercase tracking-wider font-medium">
            © 2026 DevHive. Built for the neon architect.
          </p>
        </div>

        {/* Right Side: Links */}
        <nav className="flex items-center gap-6">
          {["Privacy", "Terms", "Github", "Discord"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary-container"
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