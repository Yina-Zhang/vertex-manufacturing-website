import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';

/**
 * Header Component - Navigation bar for Vertex website
 * Design: Precision & Craft - Professional, clean navigation with Vertex branding
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Why Vertex', href: '/why-vertex' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663721880165/e72ycqGG8W9hJvw2RydPCE/vertex-logo-G7rT2qqWsHHMPtRoxZ6ccN.webp"
            alt="Vertex Logo"
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-vertex-steel">VERTEX</span>
            <span className="text-xs text-vertex-copper font-semibold">Manufacturing</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-vertex-dark hover:text-vertex-sky transition-colors relative group">
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-vertex-copper group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTA Button - Desktop */}
        <a href="/contact" className="hidden md:block vertex-button-primary">
          Get a Quote
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-3 hover:bg-gray-100 rounded transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-medium text-vertex-dark hover:text-vertex-sky transition-colors py-3 border-b border-gray-100 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              className="vertex-button-primary inline-block text-center mt-4 py-4 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Get a Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
