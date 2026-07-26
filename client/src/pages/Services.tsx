import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, Box, Wrench, Zap, Sparkles } from 'lucide-react';

export default function Services() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: '3D Printing',
      icon: 'box',
      description: 'Advanced 3D printing solutions for prototyping and production',
      details: {
        whatCanWeMake: ['Functional prototypes', 'Appearance models', 'End-use parts', 'Low-volume Production'],
        materials: ['Resin', 'Nylon', 'TPU', 'Metal', 'And more'],
        technologies: ['SLA', 'SLS', 'MJF', 'FDM', 'SLM', 'LCD', 'DLP'],
        surfaceFinishing: ['Painting', 'Sandblasting', 'Dyeing', 'Polishing', 'And More'],
        leadTime: '7–10 days for prototypes'
      }
    },
    {
      id: 2,
      title: 'CNC Machining',
      icon: 'wrench',
      description: 'Precision machining for metals and plastics',
      details: {
        materials: {
          metals: ['Aluminum 6061', 'Aluminum 7075', 'Stainless Steel 304', 'Stainless Steel 316', 'Brass', 'Copper', 'Titanium', 'And More'],
          plastics: ['POM', 'ABS', 'Nylon', 'PTFE', 'Acrylic', 'PEEK', 'And More']
        },
        applications: ['Precision Components', 'Functional Prototypes', 'Production Parts'],
        tolerance: 'Up to ±0.1 mm'
      }
    },
    {
      id: 3,
      title: 'Tooling & Injection Molding',
      icon: 'zap',
      description: 'Injection molds and specialized tooling services',
      details: {
        services: ['Injection Mold', 'Stamping Mold', 'Foam & Fiberglass Sculpture', 'Vacuum Casting'],
        productionVolume: ['Prototype (10–100 pcs)', 'Low-volume (100–10,000 pcs)', 'Mass Production (10,000+ pcs)'],
        materials: ['ABS', 'PP', 'PC', 'PA', 'TPU', 'And More'],
        applications: ['Consumer Products', 'Industrial Components', 'Automotive Parts', 'Electronic Enclosures', 'Exhibited artworks']
      }
    },
    {
      id: 4,
      title: 'Surface Finishing & Assembly',
      icon: 'sparkles',
      description: 'Professional finishing and assembly services',
      details: {
        surfaceFinishing: ['Sandblasting', 'Bead Blasting', 'Anodizing', 'Painting', 'Powder Coating', 'Polishing'],
        secondaryOperations: ['Laser Engraving', 'Silk Screening', 'Heat Treatment'],
        assemblyServices: ['Mechanical Assembly', 'Packaging', 'Labeling', 'Quality Inspection']
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gray-100 text-gray-900 py-14 md:py-24">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">Our Services</h1>
            <p className="text-lg md:text-xl text-gray-700">Comprehensive manufacturing solutions tailored to your needs</p>
          </div>
        </section>
        <section className="vertex-section-padding bg-white">
          <div className="container">
            <div className="space-y-5 md:space-y-4">
              {services.map((service) => (
                <div key={service.id} className="vertex-card cursor-pointer p-5 md:p-6" onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {service.icon === 'box' && <Box size={32} className="text-vertex-copper" />}
                        {service.icon === 'wrench' && <Wrench size={32} className="text-vertex-copper" />}
                        {service.icon === 'zap' && <Zap size={32} className="text-vertex-copper" />}
                        {service.icon === 'sparkles' && <Sparkles size={32} className="text-vertex-copper" />}
                        <h3 className="vertex-heading-3">{service.title}</h3>
                      </div>
                      <p className="vertex-body-secondary">{service.description}</p>
                    </div>
                    <ChevronDown size={24} className={`text-vertex-copper flex-shrink-0 transition-transform ${expandedService === service.id ? "rotate-180" : ""}`} />
                  </div>

                  {expandedService === service.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      {/* 3D Printing */}
                      {service.id === 1 && (
                        <>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What can we make?</h4>
                            <p className="text-gray-700">{(service.details.whatCanWeMake as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                            <p className="text-gray-700">{(service.details.materials as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Available Technologies</h4>
                            <p className="text-gray-700">{(service.details.technologies as string[]).join(' | ')}</p>
                            <p className="text-gray-600 text-xs mt-1">These technologies allow us to create parts with different properties - from flexible rubber-like materials to rigid metals.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Surface Finishing</h4>
                            <p className="text-gray-700">{(service.details.surfaceFinishing as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Lead Time</h4>
                            <p className="text-gray-700">{service.details.leadTime as string}</p>
                          </div>
                        </>
                      )}

                      {/* CNC Machining */}
                      {service.id === 2 && (
                        <>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-gray-800">Metals</p>
                                <p className="text-gray-700">{(service.details.materials as any).metals.join(' | ')}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">Plastics</p>
                                <p className="text-gray-700">{(service.details.materials as any).plastics.join(' | ')}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
                            <p className="text-gray-700">{(service.details.applications as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Tolerance</h4>
                            <p className="text-gray-700">{service.details.tolerance as string}</p>
                            <p className="text-gray-600 text-xs mt-1">This means we can create parts with extremely high precision - perfect for components that need to fit together perfectly.</p>
                          </div>
                        </>
                      )}

                      {/* Tooling & Molding */}
                      {service.id === 3 && (
                        <>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                            <p className="text-gray-700">{(service.details.services as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Production Volume</h4>
                            <p className="text-gray-700">{(service.details.productionVolume as string[]).join(' | ')}</p>
                            <p className="text-gray-600 text-xs mt-1">Whether you need just a few samples or thousands of units, we have the right solution for your volume.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                            <p className="text-gray-700">{(service.details.materials as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
                            <p className="text-gray-700">{(service.details.applications as string[]).join(' | ')}</p>
                          </div>
                        </>
                      )}

                      {/* Surface Finishing & Assembly */}
                      {service.id === 4 && (
                        <>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Surface Finishing</h4>
                            <p className="text-gray-700">{(service.details.surfaceFinishing as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Secondary Operations</h4>
                            <p className="text-gray-700">{(service.details.secondaryOperations as string[]).join(' | ')}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Assembly Services</h4>
                            <p className="text-gray-700">{(service.details.assemblyServices as string[]).join(' | ')}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
