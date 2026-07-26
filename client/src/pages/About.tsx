import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero Banner */}
        <section className="bg-gray-100 text-gray-900 py-14 md:py-24">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">About Vertex</h1>
            <p className="text-lg md:text-xl text-gray-600">Your manufacturing solutions partner in China</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto px-6 md:px-8" style={{ maxWidth: '760px' }}>

            {/* Lead Paragraph */}
            <p className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed mb-12">
              Vertex Advanced Manufacturing is your manufacturing solutions partner in China.
            </p>

            {/* Gold divider */}
            <div className="w-12 h-0.5 bg-vertex-copper mb-12" />

            {/* Body paragraphs */}
            <div className="space-y-8">
              <p className="text-base md:text-[17px] text-gray-600 leading-[1.85]">
                We help <strong className="text-gray-900 font-semibold">engineers</strong>,{' '}
                <strong className="text-gray-900 font-semibold">product teams</strong>, and businesses bring ideas to life by connecting them with the right manufacturing processes, trusted production partners, and dedicated project support.
              </p>

              <p className="text-base md:text-[17px] text-gray-600 leading-[1.85]">
                Whether you're developing a new product, validating a prototype, or scaling up for production, we work with you to identify the most suitable{' '}
                <strong className="text-gray-900 font-semibold">manufacturing solution</strong> based on your design, quantity, budget, and timeline.
              </p>

              <p className="text-base md:text-[17px] text-gray-600 leading-[1.85]">
                Rather than promoting a single manufacturing process, we focus on recommending the right one. Through our carefully managed network of qualified manufacturing partners, we provide{' '}
                <strong className="text-gray-900 font-semibold">3D printing</strong>,{' '}
                <strong className="text-gray-900 font-semibold">CNC machining</strong>,{' '}
                <strong className="text-gray-900 font-semibold">tooling</strong>,{' '}
                <strong className="text-gray-900 font-semibold">injection molding</strong>, and low-volume production—all coordinated through one experienced team.
              </p>

              <p className="text-base md:text-[17px] text-gray-600 leading-[1.85]">
                From <strong className="text-gray-900 font-semibold">engineering review</strong> and{' '}
                <strong className="text-gray-900 font-semibold">DFM feedback</strong> to production coordination,{' '}
                <strong className="text-gray-900 font-semibold">quality control</strong>, and{' '}
                <strong className="text-gray-900 font-semibold">global logistics</strong>, Vertex simplifies manufacturing so you can focus on product innovation.
              </p>
            </div>

            {/* Ending Statement */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                From Prototype to Production.
              </p>
              <p className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#b8966e' }}>
                Manufacturing solutions you can rely on.
              </p>
            </div>

          </div>
        </section>

        {/* Service Process Section */}
        <section className="vertex-section-padding bg-gray-50">
          <div className="container">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Service Process</h2>
              <p className="text-lg text-gray-600">A streamlined journey from concept to delivery</p>
            </div>

            {/* Process Flow - Vertical on mobile, Horizontal on desktop */}
            <div className="max-w-6xl mx-auto">
              {/* Mobile: vertical steps */}
              <div className="flex flex-col gap-6 md:hidden">
                {[
                  { num: 1, title: 'Engineering Review & DFM', desc: 'Review your design and recommend the best manufacturing solution.' },
                  { num: 2, title: 'Production Planning', desc: 'Select the right manufacturing partners and coordinate production.' },
                  { num: 3, title: 'Quality Assurance', desc: 'Inspect every order to ensure reliable quality.' },
                  { num: 4, title: 'Global Delivery', desc: 'Manage packaging, logistics and worldwide shipment.' },
                ].map((step, i, arr) => (
                  <div key={step.num} className="flex items-start gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gray-800 text-white flex items-center justify-center text-xl font-bold shadow-md">
                        {step.num}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-0.5 h-8 bg-vertex-copper mt-2" />
                      )}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: horizontal timeline */}
              <div className="hidden md:block relative py-12">
                <svg className="absolute top-1/2 left-0 right-0 w-full h-12 transform -translate-y-1/2" viewBox="0 0 1000 50" preserveAspectRatio="none">
                  <line x1="0" y1="25" x2="1000" y2="25" stroke="#D4A574" strokeWidth="3" />
                  <polygon points="230,25 240,20 240,30" fill="#D4A574" />
                  <polygon points="500,25 510,20 510,30" fill="#D4A574" />
                  <polygon points="770,25 780,20 780,30" fill="#D4A574" />
                </svg>
                <div className="relative flex justify-between">
                  <div className="flex flex-col items-center w-1/4 px-2">
                    <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-gray-50 relative z-10">1</div>
                    <h3 className="text-base font-semibold text-black text-center mb-2">Engineering Review & DFM</h3>
                    <p className="text-sm text-black text-center">Review your design and recommend the best manufacturing solution.</p>
                  </div>
                  <div className="flex flex-col items-center w-1/4 px-2">
                    <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-gray-50 relative z-10">2</div>
                    <h3 className="text-base font-semibold text-black text-center mb-2">Production Planning</h3>
                    <p className="text-sm text-black text-center">Select the right manufacturing partners and coordinate production.</p>
                  </div>
                  <div className="flex flex-col items-center w-1/4 px-2">
                    <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-gray-50 relative z-10">3</div>
                    <h3 className="text-base font-semibold text-black text-center mb-2">Quality Assurance</h3>
                    <p className="text-sm text-black text-center">Inspect every order to ensure reliable quality.</p>
                  </div>
                  <div className="flex flex-col items-center w-1/4 px-2">
                    <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-gray-50 relative z-10">4</div>
                    <h3 className="text-base font-semibold text-black text-center mb-2">Global Delivery</h3>
                    <p className="text-sm text-black text-center">Manage packaging, logistics and worldwide shipment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
