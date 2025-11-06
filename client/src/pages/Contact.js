import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';

function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulated API call - replace with actual axios call
    // axios.post('/contact', { full_name: fullName, email, message })
    //   .then(() => {
    setFullName('');
    setEmail('');
    setMessage('');
    setError('');
    setSuccess('Message successfully sent! We\'ll get back to you soon.');
    
    setTimeout(() => setSuccess(''), 5000);
    //   })
    //   .catch((error) => {
    //     const errorMsg = error.response?.data?.error || 'An error occurred';
    //     setError(errorMsg);
    //     setTimeout(() => setError(''), 5000);
    //   });
  };

  const contactInfo = [
    {
      icon: <FaPhone size={24} />,
      title: "Phone",
      details: "1-800-123-4567",
      subtitle: "Mon-Fri 8am-6pm",
      color: "emerald"
    },
    {
      icon: <FaEnvelope size={24} />,
      title: "Email",
      details: "evergreenbank7@gmail.com",
      subtitle: "24/7 Support",
      color: "blue"
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: "Location",
      details: "123 Bank Street, Suite 100",
      subtitle: "Nairobi, Kenya",
      color: "purple"
    },
    {
      icon: <FaClock size={24} />,
      title: "Working Hours",
      details: "Monday - Friday: 8AM - 6PM",
      subtitle: "Saturday: 9AM - 2PM",
      color: "indigo"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: { gradient: 'from-emerald-400 to-emerald-600' },
      blue: { gradient: 'from-blue-400 to-blue-600' },
      purple: { gradient: 'from-purple-400 to-purple-600' },
      indigo: { gradient: 'from-indigo-400 to-indigo-600' }
    };
    return colors[color];
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 py-24 overflow-hidden">
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

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6">
            <FaComments className="mr-2" size={16} />
            We're Here to Help
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Get in Touch with Us
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Have questions or need assistance? Our team is ready to help you with any inquiries about our banking services.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const colors = getColorClasses(info.color);
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center mb-4 text-white`}>
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                  <p className="text-gray-600 text-sm">{info.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image and Info */}
            <div 
              className={`transform transition-all duration-700 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
              }`}
            >
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="Customer service"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
                </div>

                <div className="bg-slate-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Contact Us?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-emerald-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Quick response within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-emerald-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Expert assistance from our team</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-emerald-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Personalized solutions for your needs</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-emerald-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">Secure and confidential communication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div 
              className={`transform transition-all duration-700 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="bg-slate-50 p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and our team will get back to you shortly.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                    {success}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="email"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <FaComments className="text-gray-400" size={18} />
                      </div>
                      <textarea
                        rows="5"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
                        placeholder="How can we help you?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaPaperPlane className="mr-2" size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Branch
            </h2>
            <p className="text-xl text-gray-600">
              Stop by and speak with our team in person
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white text-center">
              <FaMapMarkerAlt className="mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">Main Branch</h3>
              <p className="text-lg">123 Bank Street, Suite 100</p>
              <p className="text-lg">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;