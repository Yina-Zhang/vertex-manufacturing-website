import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Portfolio() {
  const caseStudies = [
    {
      id: 1,
      title: "Humanoid Robot Shell Components",
      category: "3D Printing",
      image: "/images/robot-shell.jpg.jpg",
      description: "SLA & SLS 3D printed robot exterior shell parts",
      details: "Designed and produced humanoid robot face and body shell components using SLA and SLS 3D printing. Materials include clear resin for transparent face panels, high-performance engineering resin for structural covers, and black nylon (PA12) for durable structural parts. Complex geometries achieved with high surface quality.",
      materials: "Clear Resin, Engineering Resin, Nylon PA12",
      process: "SLA & SLS 3D Printing",
      timeline: "3 weeks",
      volume: "30 sets"
    },
    {
      id: 2,
      title: "Custom IEM & Hearing Aid Shells",
      category: "3D Printing",
      image: "/images/hearing-aid.jpg",
      description: "LCD 3D printed custom in-ear device housings",
      details: "Produced custom-fit in-ear monitor (IEM) and hearing aid shells using LCD 3D printing technology. Materials include engineering resins and flexible elastomers (Shore 40A silicone-like TPU) for comfortable, skin-safe wearables. Batch production with consistent dimensional accuracy for perfect ear canal fit.",
      materials: "Flexible Elastomer (Shore 40A TPU)",
      process: "LCD 3D Printing",
      timeline: "2 weeks",
      volume: "200 units"
    },
    {
      id: 3,
      title: "Automotive Engine Components",
      category: "Injection Molding",
      image: "/images/automotive-parts.jpg",
      description: "Production-scale injection molded engine parts",
      details: "Designed and manufactured injection molds for automotive engine components including brackets, housings, and structural parts. Produced 50,000 units in 3 production runs with consistent quality and 2% defect rate.",
      materials: "PA66 with glass fiber reinforcement",
      process: "Injection Molding",
      timeline: "12 weeks (mold + production)",
      volume: "50,000 units"
    },
    {
      id: 4,
      title: "Aerospace Aluminum Components",
      category: "CNC Machining",
      image: "/images/aerospace-parts.jpg",
      description: "High-precision aerospace-grade parts",
      details: "Machined complex aluminum components for aerospace structural assemblies. Maintained aerospace quality standards with full traceability and certification documentation. Tight tolerances achieved with 5-axis CNC machining.",
      materials: "Aluminum 6061",
      process: "5-axis CNC Machining",
      timeline: "8 weeks",
      volume: "200 units"
    },
    {
      id: 5,
      title: "Custom Rubber Seals & Gaskets",
      category: "Vacuum Casting",
      image: "/images/rubber-seals.jpg",
      description: "Specialized elastomer components via vacuum casting",
      details: "Produced custom TPU seals and gaskets with complex geometries using vacuum casting. Achieved tight tolerances and excellent chemical resistance for industrial applications. Flexible materials with Shore hardness ranging from 40A to 90A.",
      materials: "TPU",
      process: "Vacuum Casting",
      timeline: "5 weeks",
      volume: "10,000 units"
    },
    {
      id: 6,
      title: "Metal 3D Printing Components",
      category: "3D Printing",
      image: "/images/metal-3d-printing.jpg",
      description: "High-performance metal additive manufacturing",
      details: "Produced complex aluminum components using selective laser melting (SLM) technology. Delivered 100 units with intricate internal geometries impossible with traditional machining. Reduced weight by 35% while maintaining structural integrity.",
      materials: "Aluminum 6061",
      process: "SLM 3D Printing",
      timeline: "6 weeks",
      volume: "100 units"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gray-100 text-gray-900 py-14 md:py-24">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">Our Portfolio</h1>
            <p className="text-lg md:text-xl text-gray-700">Showcasing successful projects across industries and manufacturing processes</p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="vertex-section-padding bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8">
              {caseStudies.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {/* Image/Icon */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-vertex-sky text-white text-sm font-semibold rounded">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-black mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>

                    {/* Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Process:</span>
                        <span className="text-black font-semibold">{project.process}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Materials:</span>
                        <span className="text-black font-semibold">{project.materials}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Volume:</span>
                        <span className="text-black font-semibold">{project.volume}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="text-black font-semibold">{project.timeline}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{project.details}</p>

                    {/* CTA */}
                    <a
                      href="/contact"
                      className="inline-block w-full text-center px-4 py-2 bg-vertex-sky text-white font-semibold rounded hover:bg-blue-600 transition-colors"
                    >
                      Similar Project?
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Vertex */}
        <section className="vertex-section-padding bg-gray-50">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 md:mb-12 text-center">Why Our Clients Choose Vertex</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-vertex-copper mb-4">500+</div>
                <h3 className="text-xl font-bold text-black mb-2">Successful Projects</h3>
                <p className="text-gray-700">Completed projects across diverse industries and manufacturing processes</p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-vertex-copper mb-4">98%</div>
                <h3 className="text-xl font-bold text-black mb-2">Quality Pass Rate</h3>
                <p className="text-gray-700">Consistent quality standards with rigorous inspection and testing</p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <div className="text-4xl font-bold text-vertex-copper mb-4">5+</div>
                <h3 className="text-xl font-bold text-black mb-2">Years Experience</h3>
                <p className="text-gray-700">Trusted by international companies for precision manufacturing</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="vertex-section-padding bg-gray-900 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8 text-gray-200">Let's discuss how Vertex can help bring your ideas to life</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-vertex-sky text-white font-semibold rounded hover:bg-blue-600 transition-colors"
              >
                Get a Quote
              </a>
              <a
                href="/services"
                className="inline-block px-8 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
              >
                Explore Services
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
