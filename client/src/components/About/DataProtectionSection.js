import React, { useState, useEffect, useRef } from 'react';
import { FaLock, FaShieldAlt, FaCheckCircle, FaUserShield, FaBook, FaBell } from 'react-icons/fa';

function DataProtectionSection() {
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

  const protectionFeatures = [
    {
      icon: <FaLock size={20} />,
      title: "Encryption",
      description: "All sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols to prevent unauthorized access.",
      color: "emerald"
    },
    {
      icon: <FaUserShield size={20} />,
      title: "Access Controls",
      description: "We employ strict access controls to ensure that only authorized personnel have access to your information. Regular audits and monitoring help maintain this security.",
      color: "blue"
    },
    {
      icon: <FaCheckCircle size={20} />,
      title: "Compliance",
      description: "Evergreen Bank complies with all relevant data protection regulations, including GDPR, CCPA, and other local privacy laws, to ensure your data is handled responsibly.",
      color: "purple"
    },
    {
      icon: <FaShieldAlt size={20} />,
      title: "Regular Security Assessments",
      description: "We conduct regular security assessments and vulnerability testing to identify and address potential threats proactively.",
      color: "indigo"
    },
    {
      icon: <FaBook size={20} />,
      title: "Customer Education",
      description: "We believe in empowering our customers with knowledge about online security. Our resources and support team are always available to help you protect your information.",
      color: "teal"
    },
    {
      icon: <FaBell size={20} />,
      title: "Incident Response",
      description: "In the unlikely event of a data breach, we have a robust incident response plan to quickly contain and mitigate any potential impact on our customers.",
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color];
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div 
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4">
            <FaShieldAlt className="mr-2" size={16} />
            Your Security Matters
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Data <span className="text-emerald-600">Protection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trust is our responsibility. We implement multiple layers of security to keep your data safe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Side */}
          <div 
            className={`relative transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-20 opacity-0 scale-95'
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                alt="Data security and protection"
                src="https://images.unsplash.com/photo-1609770231080-e321deccc34c?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
              
              {/* Floating Badge */}
              {/* <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <FaShieldAlt className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Bank-Grade Security</div>
                    <div className="text-gray-600 text-sm">256-bit Encryption</div>
                  </div>
                </div>
              </div> */}
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Content Side */}
          <div 
            className={`transform transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              How do we protect your Data?
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At Evergreen Bank, we take data protection seriously. Our multi-layered security 
              approach ensures that your personal and financial information remains safe and 
              confidential at all times.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="text-2xl font-bold text-emerald-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="text-2xl font-bold text-emerald-600 mb-1">256-bit</div>
                <div className="text-sm text-gray-600">Encryption</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protectionFeatures.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border ${colors.border} transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.text}`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`mt-16 text-center transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have questions about our security measures?
            </h3>
            <p className="text-gray-600 mb-6">
              Our security team is here to answer any questions you may have about how we protect your data.
            </p>
            <button className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contact Security Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DataProtectionSection;