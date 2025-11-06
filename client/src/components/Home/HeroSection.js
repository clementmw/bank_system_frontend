import React, { useState, useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-slate-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Content */}
         <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-16 lg:h-screen">
          <div className="max-w-2xl lg:flex-shrink-0">
            {/* Trust Badge - Animated */}
            <div 
              className={`flex items-center mb-6 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <FaShieldAlt className="text-emerald-600 mr-3" size={24} />
              <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">FDIC Insured • Secure Banking</span>
            </div>
            
            {/* Heading - Animated */}
            <h1 
              className={`text-5xl lg:text-7xl font-bold leading-tight mb-6 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <span className="text-black">Welcome to</span>
              <br />
              <span className="text-emerald-600 bg-clip-text">
                Evergreen Bank
              </span>
            </h1>
            
            {/* Description - Animated */}
            <div 
              className={`border-l-4 border-emerald-600 pl-6 mb-8 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <p className="text-slate-600 text-xl lg:text-2xl font-light leading-relaxed">
                Your trusted partner in financial excellence. Experience banking reimagined with 
                innovative digital solutions, and personalized service that puts your financial success first.
              </p>
            </div>

            {/* Buttons - Animated */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 mb-8 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Discover Our Services</span>
              </button>

              <button
                className="px-8 py-4 bg-emerald-500 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-emerald-800 transition-all duration-300 text-center"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators - Animated */}
            <div 
              className={`grid grid-cols-3 gap-6 pt-8 border-t border-slate-300 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">25+</div>
                <div className="text-slate-600 text-sm">Years Serving</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">500K+</div>
                <div className="text-slate-600 text-sm">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">A+</div>
                <div className="text-slate-600 text-sm">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Images with Oval Borders - Animated */}
          <div className="hidden lg:flex gap-4 items-center">
            {/* Image 1 - Left */}
            <div 
              className={`w-52 h-80 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              } group cursor-pointer`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0rounded-[15%] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500"></div>
                <div className="absolute inset-2 rounded-[15%] overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Banking consultation"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Image 2 - Middle (Lower) */}
            <div 
              className={`w-52 h-80 transform transition-all duration-700 mt-12 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              } group cursor-pointer`}
              style={{ transitionDelay: '450ms' }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0  rounded-[20%] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500"></div>
                <div className="absolute inset-2 rounded-[20%] overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Financial planning"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Image 3 - Right */}
            <div 
              className={`w-52 h-80 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              } group cursor-pointer`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0  rounded-[20%] transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-500"></div>
                <div className="absolute inset-2 rounded-[20%] overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Modern banking technology"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;