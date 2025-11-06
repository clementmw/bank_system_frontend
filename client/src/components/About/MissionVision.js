import React, { useState, useEffect, useRef } from 'react';
import { FaRocket, FaEye, FaHeart, FaShieldAlt, FaUsers, FaLightbulb } from 'react-icons/fa';

function MissionVision() {
  const [missionVisible, setMissionVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);

  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const valuesRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const missionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMissionVisible(true);
      }
    }, observerOptions);

    const visionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisionVisible(true);
      }
    }, observerOptions);

    const valuesObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setValuesVisible(true);
      }
    }, observerOptions);

    if (missionRef.current) missionObserver.observe(missionRef.current);
    if (visionRef.current) visionObserver.observe(visionRef.current);
    if (valuesRef.current) valuesObserver.observe(valuesRef.current);

    return () => {
      if (missionRef.current) missionObserver.unobserve(missionRef.current);
      if (visionRef.current) visionObserver.unobserve(visionRef.current);
      if (valuesRef.current) valuesObserver.unobserve(valuesRef.current);
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Mission Section */}
      <section ref={missionRef} className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mission Content - Left */}
            <div className={`transform transition-all duration-700 ${
              missionVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}>
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
                <FaRocket className="mr-2" size={16} />
                Our Mission
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Financial
                <span className="text-emerald-600"> Success</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                At Evergreen Bank, our mission is to provide accessible, innovative, and secure 
                banking solutions that empower individuals and businesses to achieve their 
                financial goals.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We are committed to building lasting relationships with our customers through 
                personalized service, cutting-edge technology, and unwavering dedication to 
                their financial well-being.
              </p>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trust & Security First</h3>
                  <p className="text-gray-600">Your financial security is our top priority, always.</p>
                </div>
              </div>
            </div>

            {/* Mission Image - Right (Expands on scroll) */}
            <div className={`relative transition-all duration-1000 ease-out ${
              missionVisible 
                ? 'w-full scale-100 opacity-100' 
                : 'w-1/2 scale-75 opacity-0'
            }`}>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaboration"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section ref={visionRef} className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Vision Image - Left (Expands on scroll) */}
            <div className={`relative transition-all duration-1000 ease-out order-2 lg:order-1 ${
              visionVisible 
                ? 'w-full scale-100 opacity-100' 
                : 'w-1/2 scale-75 opacity-0 ml-auto'
            }`}>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Future vision"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
            </div>

            {/* Vision Content - Right */}
            <div className={`transform transition-all duration-700 order-1 lg:order-2 ${
              visionVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                <FaEye className="mr-2" size={16} />
                Our Vision
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Leading the Future of
                <span className="text-blue-600"> Digital Banking</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                We envision a world where banking is seamless, intuitive, and accessible to 
                everyone, everywhere. Our vision is to be the most trusted and innovative 
                financial institution in the region.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Through continuous innovation and a customer-first approach, we aim to 
                revolutionize the banking experience and set new standards for excellence 
                in financial services.
              </p>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaLightbulb className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation Driven</h3>
                  <p className="text-gray-600">Pioneering solutions for tomorrow's challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className={`text-center mb-16 transform transition-all duration-700 ${
            valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              <FaHeart className="mr-2" size={16} />
              Our Core Values
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What We <span className="text-emerald-600">Stand For</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our values guide everything we do and shape the way we serve our customers
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}>
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-emerald-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                We operate with the highest ethical standards, ensuring transparency and 
                honesty in all our dealings.
              </p>
            </div>

            {/* Value 2 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FaUsers className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your success is our success. We prioritize your needs and work tirelessly 
                to exceed your expectations.
              </p>
            </div>

            {/* Value 3 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FaLightbulb className="text-purple-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We embrace change and continuously seek new ways to improve and enhance 
                your banking experience.
              </p>
            </div>

            {/* Value 4 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}>
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <FaHeart className="text-indigo-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to giving back and supporting the communities we serve 
                through various initiatives.
              </p>
            </div>

            {/* Value 5 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}>
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <FaRocket className="text-teal-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in everything we do, delivering quality services 
                that exceed industry standards.
              </p>
            </div>

            {/* Value 6 */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${
              valuesVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-orange-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accountability</h3>
              <p className="text-gray-600 leading-relaxed">
                We take ownership of our actions and are accountable to our customers, 
                stakeholders, and community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MissionVision;