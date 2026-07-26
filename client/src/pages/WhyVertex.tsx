import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, Users, Cog, CheckCircle } from 'lucide-react';

export default function WhyVertex() {
  const reasons = [
    {
      title: 'Fast Quotation & Response',
      description: 'Get engineering feedback and quotations quickly, helping you move projects forward without delays.',
      detail: 'Within 24 hours',
      icon: Zap,
      color: 'text-vertex-copper'
    },
    {
      title: 'Dedicated Project Manager',
      description: 'From technical discussions and supplier coordination to production tracking and shipping, you work with one dedicated project manager throughout the entire process.',
      detail: 'Single point of contact',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Flexible Manufacturing Capacity',
      description: 'Leverage a broad range of manufacturing capabilities to support prototypes, low-volume production, and scale-up projects.',
      detail: 'Prototypes to mass production',
      icon: Cog,
      color: 'text-green-500'
    },
    {
      title: 'Full Project Ownership',
      description: 'We manage every stage from prototype development to final delivery, reducing your workload and ensuring smooth execution.',
      detail: 'End-to-end management',
      icon: CheckCircle,
      color: 'text-purple-500'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gray-100 text-gray-900 py-14 md:py-24">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">Why Choose Vertex</h1>
            <p className="text-lg md:text-xl text-gray-700">One contact, full project ownership.</p>
          </div>
        </section>
        <section className="vertex-section-padding bg-white">
          <div className="container">
            <div className="space-y-6 md:space-y-8">
              {reasons.map((reason, idx) => {
                const IconComponent = reason.icon;
                return (
                  <div key={idx} className="border-l-4 border-vertex-copper pl-5 md:pl-8 py-4">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 ${reason.color}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                        <p className="text-gray-700 mb-3 leading-relaxed">{reason.description}</p>
                        <p className="text-sm font-semibold text-vertex-copper uppercase tracking-wide">{reason.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white vertex-section-padding">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Vertex Difference?</h2>
            <p className="text-gray-300 mb-8 text-lg">Get your project started with a dedicated team that cares about your success.</p>
            <a href="/contact" className="inline-block bg-vertex-copper text-gray-900 font-bold py-4 px-8 rounded hover:bg-opacity-90 transition-all uppercase tracking-wide">
              Get a Quote Today →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
