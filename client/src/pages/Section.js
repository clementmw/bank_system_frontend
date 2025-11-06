import React, { useState, useEffect } from 'react';
import { HiMiniCreditCard } from "react-icons/hi2";
import { FaMapPin } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbDeviceMobileQuestion } from "react-icons/tb";
import { FaShieldAlt, FaChartLine, FaUserCheck, FaAward, FaHeadset, FaCheckCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
// import transact from "../images/transact.jpg"
import AboutSection from '../components/Home/AboutSection';
import HeroSection from '../components/Home/HeroSection';
import FAQSection from '../components/Home/FAQSection';
import CTASection from '../components/Home/CTASection';
function Section() {
  const [button, setButton] = useState(false);

  useEffect(() => {
    if (button) {
      const targetSection = document.getElementById('howItWorksSection');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setButton(false);
  }, [button]);

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <HeroSection/>
      
      {/* Quick Actions Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-gray-600 text-lg">Manage your finances with ease</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <button className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-emerald-100 group-hover:bg-emerald-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <GiTakeMyMoney className="text-emerald-700" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Internet Banking</h3>
              <p className="text-gray-600 text-sm">Secure online access</p>
            </button>

            <button className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 group-hover:bg-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <HiMiniCreditCard className="text-blue-700" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cards Portal</h3>
              <p className="text-gray-600 text-sm">Manage your cards</p>
            </button>

            <button className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-100 group-hover:bg-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <FaMapPin className="text-purple-700" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Branch Locator</h3>
              <p className="text-gray-600 text-sm">Find us near you</p>
            </button>

            <button className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-orange-100 group-hover:bg-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <FaPhoneVolume className="text-orange-700" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm">24/7 support</p>
            </button>

            <button className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-teal-100 group-hover:bg-teal-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <TbDeviceMobileQuestion className="text-teal-700" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-gray-600 text-sm">Get instant answers</p>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
        <AboutSection/>

      {/* Features Section */}
      <section id='howItWorksSection' className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              <FaAward className="mr-2" size={16} />
              What Makes Us Special
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for Your 
              <span className="text-blue-600"> Financial Success</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of traditional banking values and innovative technology. 
              Every feature is designed with your financial wellbeing in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Unmatched Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your security is our top priority. We employ military-grade encryption, real-time fraud monitoring, 
                and biometric authentication to keep your funds and data absolutely secure.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChartLine className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Banking Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Harness the power of AI and machine learning for personalized financial insights, 
                automated savings, and intelligent spending recommendations tailored to your goals.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="text-white w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Always Accessible</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank seamlessly across all your devices with our award-winning mobile app and web platform. 
                Access your accounts 24/7 from anywhere in the world.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUserCheck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Every customer is unique. Our platform learns your preferences and adapts to provide 
                personalized services, tailored advice, and customized financial solutions.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHeadset className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our certified financial advisors and customer support team are available 24/7 to provide 
                expert guidance and immediate assistance whenever you need it.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaAward className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted by Millions</h3>
              <p className="text-gray-600 leading-relaxed">
                Join over 500,000 satisfied customers who trust us with their financial future. 
                Our track record of excellence spans over 25 years of reliable service.
              </p>
            </div>
          </div>
        </div>
      </section>
      <FAQSection/>

      {/* CTA Section */}
      <CTASection/>

    </div>
  );
}

export default Section;