import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component - Company information and links
 * Design: Precision & Craft - Professional footer with contact info and navigation
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-900">
      <div className="container vertex-section-padding">
        <div className="vertex-grid-3 mb-10 md:mb-12 gap-10 md:gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663721880165/e72ycqGG8W9hJvw2RydPCE/vertex-logo-G7rT2qqWsHHMPtRoxZ6ccN.webp"
                alt="Vertex Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">VERTEX</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your manufacturing solutions partner in China. From prototype to production, we deliver manufacturing solutions you can rely on.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-gray-700 hover:text-vertex-copper transition-colors">Home</a>
              </li>
              <li>
                <a href="/services" className="text-gray-700 hover:text-vertex-copper transition-colors">Services</a>
              </li>
              <li>
                <a href="/portfolio" className="text-gray-700 hover:text-vertex-copper transition-colors">Portfolio</a>
              </li>
              <li>
                <a href="/why-vertex" className="text-gray-700 hover:text-vertex-copper transition-colors">Why Vertex</a>
              </li>
              <li>
                <a href="/about" className="text-gray-700 hover:text-vertex-copper transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-700 hover:text-vertex-copper transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0 text-gray-700" />
                <a href="mailto:hello@vertexadvancedmanufacturing.com" className="text-gray-700 hover:text-vertex-copper transition-colors">
                  hello@vertexadvancedmanufacturing.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1 flex-shrink-0 text-gray-700" />
                <div>
                  <a href="tel:+8617373129234" className="text-gray-700 hover:text-vertex-copper transition-colors">
                    +86 17373129234
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">Available on WhatsApp &amp; WeChat</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-700" />
                <span className="text-gray-700">Shenzhen, China</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4 md:gap-0">
            <p>&copy; {currentYear} Vertex Advanced Manufacturing. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-vertex-copper transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-vertex-copper transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
