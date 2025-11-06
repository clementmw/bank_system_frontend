import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaShieldAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';

function CTASection() {
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
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 overflow-hidden">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            className={`transform transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6">
              <FaCheckCircle className="mr-2" size={16} />
              Join 500K+ Happy Customers
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Experience
              <br />
              <span className="text-emerald-200">Banking Excellence?</span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Start your journey with Evergreen Bank today and discover why thousands 
              trust us with their financial future.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FaShieldAlt className="text-white" size={18} />
                </div>
                <span className="text-lg">Bank-grade security & encryption</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FaChartLine className="text-white" size={18} />
                </div>
                <span className="text-lg">Competitive interest rates</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <FaCheckCircle className="text-white" size={18} />
                </div>
                <span className="text-lg">24/7 customer support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <span className="relative flex items-center justify-center">
                  Open Account Today
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                </span>
              </button>

              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                Schedule Consultation
              </button>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div 
            className={`relative transform transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">25+</div>
                <div className="text-white/80 text-sm">Years of Excellence</div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300 mt-8">
                <div className="text-4xl font-bold text-white mb-2">500K+</div>
                <div className="text-white/80 text-sm">Active Customers</div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2">A+</div>
                <div className="text-white/80 text-sm">Safety Rating</div>
              </div>

              {/* Card 4 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300 mt-8">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm">Support Available</div>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;