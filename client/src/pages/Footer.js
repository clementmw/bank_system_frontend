import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <FaShieldAlt className="text-white" size={20} />
              </div>
              <h5 className="text-2xl font-bold text-white">Evergreen Bank</h5>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Providing reliable and innovative banking services since 2001. Your trusted partner in financial excellence.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                <FaLinkedinIn size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-bold mb-6 text-white">Quick Links</h5>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/FrequentQA" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-lg font-bold mb-6 text-white">Resources</h5>
            <ul className="space-y-3">
              <li>
                <a href="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Blog
                </a>
              </li>
              <li>
                <a href="/rates" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Rates
                </a>
              </li>
              <li>
                <a href="/locations" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Locations
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-lg font-bold mb-6 text-white">Get In Touch</h5>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaMapMarkerAlt className="text-emerald-400" size={16} />
                </div>
                <div className="text-gray-400 text-sm">
                  123 Bank Street, Suite 100<br />
                  Nairobi, Kenya
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaEnvelope className="text-emerald-400" size={16} />
                </div>
                <div className="text-gray-400 text-sm">
                  evergreenbank7@gmail.com
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <FaPhone className="text-emerald-400" size={16} />
                </div>
                <div className="text-gray-400 text-sm">
                  1-800-123-4567
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Evergreen Bank. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;