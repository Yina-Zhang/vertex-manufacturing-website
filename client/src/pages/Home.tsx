import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, Box, Wrench, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Home Page - Hero section and key value propositions
 * Design: Precision & Craft - Bold hero with industrial aesthetic
 */
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [expandedService, setExpandedService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: '3D Printing',
      icon: 'box',
      description: 'Advanced 3D printing solutions for prototyping and production',
      details: 'From functional prototypes to end-use parts, we offer SLA, SLS, MJF, FDM, SLM, LCD, and DLP technologies with materials including resin, nylon, TPU, and metal. Lead time: 7-10 days for prototypes.',
    },
    {
      id: 2,
      title: 'CNC Machining',
      icon: 'wrench',
      description: 'Precision machining for metals and plastics',
      details: 'We machine aluminum, stainless steel, brass, copper, titanium, and various plastics with tolerances up to ±0.1mm. Perfect for precision components, functional prototypes, and production parts.',
    },
    {
      id: 3,
      title: 'Tooling & Molding',
      icon: 'zap',
      description: 'Injection molds and specialized tooling services',
      details: 'From prototype (10-100 pcs) to mass production (10,000+ pcs), we handle injection molds, stamping molds, vacuum casting, and more. Materials include ABS, PP, PC, PA, TPU, and beyond.',
    },
    {
      id: 4,
      title: 'Surface Finishing',
      icon: 'sparkles',
      description: 'Professional finishing and assembly services',
      details: 'Sandblasting, anodizing, painting, powder coating, polishing, laser engraving, silk screening, and complete assembly services with quality inspection.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative py-20 md:py-40 overflow-hidden"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663721880165/e72ycqGG8W9hJvw2RydPCE/hero-background-industrial-fhA9NMD7rUHE95iGkZb5wp.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="container relative z-10">
            <div className="max-w-2xl">
              <div className="mb-6 inline-block">
                <div className="vertex-divider" />
              </div>

              <h1 className="vertex-heading-1 text-white mb-5">
                Manufacturing Solutions That Fit Your Project
              </h1>

              <p className="text-lg sm:text-xl text-gray-100 mb-5 leading-relaxed">
                From Prototype to Production
              </p>

              <p className="text-base sm:text-lg text-gray-200 mb-7">
                3D Printing | CNC Machining | Tooling | Rapid Prototyping
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="text-sm text-gray-100 font-medium">
                  ✓ Fast Quotations
                </div>
                <div className="text-sm text-gray-100 font-medium">
                  ✓ Engineering Support
                </div>
                <div className="text-sm text-gray-100 font-medium">
                  ✓ Production Management
                </div>
                <div className="text-sm text-gray-100 font-medium">
                  ✓ Global Delivery
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="vertex-button-primary bg-vertex-sky hover:bg-blue-600 text-center py-4 text-base">
                  Get a Quote
                </Link>
                <Link href="/contact" className="vertex-button-primary bg-vertex-sky hover:bg-blue-600 text-center py-4 text-base">
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="vertex-section-padding bg-gray-900 text-white">
          <div className="container">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4">
                <div className="vertex-divider mx-auto" />
              </div>
              <h2 className="vertex-heading-2 text-white mb-4">Our Services</h2>
              <p className="text-gray-200 max-w-2xl mx-auto">
                Comprehensive manufacturing solutions tailored to your needs
              </p>
            </div>

            {/* Services Grid */}
            <div className="space-y-3 md:space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="vertex-card cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-750"
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {service.icon === 'box' && <Box size={32} className="text-vertex-copper flex-shrink-0" />}
                      {service.icon === 'wrench' && <Wrench size={32} className="text-vertex-copper flex-shrink-0" />}
                      {service.icon === 'zap' && <Zap size={32} className="text-vertex-copper flex-shrink-0" />}
                      {service.icon === 'sparkles' && <Sparkles size={32} className="text-vertex-copper flex-shrink-0" />}
                      <div>
                        <h3 className="vertex-heading-3 text-white mb-2">{service.title}</h3>
                        <p className="text-gray-300">{service.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`text-vertex-copper flex-shrink-0 transition-transform duration-300 ${
                        expandedService === service.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Expandable Details */}
                  {expandedService === service.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="vertex-body text-gray-200">{service.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/services" className="inline-block px-8 py-3 border-2 border-vertex-copper text-vertex-copper font-semibold rounded transition-all duration-200 hover:bg-vertex-copper hover:text-white active:scale-95">
                Explore All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Why Vertex Section */}
        <section className="vertex-section-padding bg-gray-50">
          <div className="container">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4">
                <div className="vertex-divider mx-auto" />
              </div>
              <h2 className="vertex-heading-2 mb-4">Why Choose Vertex</h2>
              <p className="vertex-body-secondary max-w-2xl mx-auto">
                One contact. Full project ownership. From quotation to delivery.
              </p>
            </div>

            <div className="vertex-grid-2 gap-10 md:gap-12">
              <div>
                <div className="text-5xl font-bold text-vertex-copper mb-4">⚡</div>
                <h3 className="vertex-heading-3 mb-3">Fast Quotation & Response</h3>
                <p className="vertex-body">
                  Get engineering feedback and quotations quickly, helping you move projects forward without delays.
                </p>
              </div>

              <div>
                <div className="text-5xl font-bold text-vertex-copper mb-4">👤</div>
                <h3 className="vertex-heading-3 mb-3">Dedicated Project Manager</h3>
                <p className="vertex-body">
                  From technical discussions to production tracking and shipping, you work with one dedicated project manager throughout the entire process.
                </p>
              </div>

              <div>
                <div className="text-5xl font-bold text-vertex-copper mb-4">🔄</div>
                <h3 className="vertex-heading-3 mb-3">Flexible Manufacturing Capacity</h3>
                <p className="vertex-body">
                  Leverage a broad range of manufacturing capabilities to support prototypes, low-volume production, and scale-up projects.
                </p>
              </div>

              <div>
                <div className="text-5xl font-bold text-vertex-copper mb-4">🎯</div>
                <h3 className="vertex-heading-3 mb-3">Full Project Ownership</h3>
                <p className="vertex-body">
                  We manage every stage from prototype development to final delivery, reducing your workload and ensuring smooth execution.
                </p>
              </div>
            </div>

            <div className="mt-10 md:mt-16 p-6 md:p-8 bg-white rounded-lg border-l-4 border-vertex-copper">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                One Contact. Full Project Ownership. From Quotation to Delivery.
              </p>
              <p className="vertex-body-secondary">
                You communicate directly with an engineer who manages your project from start to finish — not a traditional trading agent.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="vertex-section-padding bg-white">
          <div className="container">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4">
                <div className="vertex-divider mx-auto" />
              </div>
              <h2 className="vertex-heading-2 mb-4">Customer Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real projects, real results. See how we've helped companies bring their products to market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Case 1 */}
              <div className="vertex-card bg-gray-50 border border-gray-200">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-vertex-sky/10 text-vertex-sky text-base font-semibold rounded">
                    3D Printing
                  </div>
                </div>
                <h3 className="vertex-heading-3 mb-3">Aerospace Titanium Components</h3>
                <p className="text-gray-700 mb-4">
                  Produced high-precision titanium parts for aerospace applications using advanced 3D printing technology. Complex geometries that traditional machining cannot achieve.
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-900">"Perfect fit for our requirements"</p>
                  <p className="text-sm text-gray-600">— Chief Engineer, Aerospace Company</p>
                </div>
              </div>

              {/* Case 2 */}
              <div className="vertex-card bg-gray-50 border border-gray-200">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-vertex-sky/10 text-vertex-sky text-base font-semibold rounded">
                    CNC Machining
                  </div>
                </div>
                <h3 className="vertex-heading-3 mb-3">Anodized Lab Equipment Parts</h3>
                <p className="text-gray-700 mb-4">
                  Machined aluminum 6061 laboratory equipment components with black anodized finish. Corrosion-resistant, precise tolerances, delivered on schedule.
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-900">"Excellent surface finish and accuracy"</p>
                  <p className="text-sm text-gray-600">— Lab Director, Research Institute</p>
                </div>
              </div>

              {/* Case 3 */}
              <div className="vertex-card bg-gray-50 border border-gray-200">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-vertex-sky/10 text-vertex-sky text-base font-semibold rounded">
                    Injection Molding
                  </div>
                </div>
                <h3 className="vertex-heading-3 mb-3">Connector Housing Production</h3>
                <p className="text-gray-700 mb-4">
                  Designed and manufactured injection molds for connector housing shells. Delivered 5,000 units with consistent quality and tight dimensional tolerances.
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-900">"Reliable partner for production scaling"</p>
                  <p className="text-sm text-gray-600">— Operations Manager, Electronics Manufacturer</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-vertex-sky/5 rounded-lg border border-vertex-sky/20">
              <p className="text-center text-lg text-gray-900">
                <span className="font-semibold">100+ projects completed</span> • <span className="font-semibold">98% on-time delivery</span> • <span className="font-semibold">Zero quality complaints</span>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="vertex-section-padding bg-gray-900 text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Upload your files and tell us about your requirements. We'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-block px-10 py-4 bg-vertex-sky text-white font-semibold rounded hover:bg-blue-600 transition-colors">
                Get a Quote
              </Link>
              <Link href="/services" className="inline-block px-10 py-4 bg-vertex-sky text-white font-semibold rounded hover:bg-blue-600 transition-colors">
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
