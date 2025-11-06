import React, { useEffect, useRef, useState } from 'react';
import { FaAward, FaCheckCircle, FaShieldAlt, FaChartLine } from 'react-icons/fa';

function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div>
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Images Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Image 1 - Top Left */}
                <div 
                  className={`transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <img
                    alt="Banking consultation"
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Image 2 - Top Right */}
                <div 
                  className={`transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  } mt-8`}
                  style={{ transitionDelay: '250ms' }}
                >
                  <img
                    alt="Financial planning"
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Image 3 - Bottom Spanning Both Columns */}
                <div 
                  className={`col-span-2 transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <img
                    alt="Modern banking technology"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    className="w-full h-56 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>

              {/* Award Badge */}
              <div 
                className={`absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
                }`}
                style={{ transitionDelay: '550ms' }}
              >
                <div className="flex items-center">
                  <FaAward className="text-emerald-600 mr-3" size={24} />
                  <div>
                    <div className="font-bold text-gray-900">Award Winning</div>
                    <div className="text-gray-600 text-sm">Service Excellence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
                <FaCheckCircle className="mr-2" size={16} />
                Why Choose Evergreen Bank
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Banking Excellence 
                <span className="text-emerald-600"> Redefined</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We combine decades of banking expertise with cutting-edge technology to deliver 
                unparalleled financial services. Your success is our mission, and your trust is our foundation.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <FaShieldAlt className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bank-Grade Security</h3>
                    <p className="text-gray-600">256-bit encryption and multi-factor authentication</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <FaChartLine className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Smart Financial Tools</h3>
                    <p className="text-gray-600">AI-powered insights and personalized recommendations</p>
                  </div>
                </div>
              </div>

              <button
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Start Banking Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutSection;