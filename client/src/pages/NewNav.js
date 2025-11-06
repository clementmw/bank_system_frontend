import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaLock, FaUser, FaChevronDown, FaTimes, FaBars} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function NewNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const servicesDropdown = [
    { name: 'Personal Banking', href: '#', desc: 'Checking, Savings, Loans' },
    { name: 'Business Banking', href: '#', desc: 'Commercial Solutions' },
    { name: 'Investment Services', href: '#', desc: 'Wealth Management' },
    { name: 'Digital Banking', href: '#', desc: 'Online & Mobile' }
  ];

  return (
    <>
      {/* Top Bar */}

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to='/' className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                  <FaShieldAlt className="text-white" size={24} />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Evergreen Bank
                  </span>
                  <div className="text-xs text-gray-500 font-medium">Your Trusted Financial Partner</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to='/about'
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-emerald-600" 
              >
                About Us
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => toggleDropdown('services')}
                >
                  Services
                  <FaChevronDown className={`ml-1 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} size={12} />
                </button>
                
                {activeDropdown === 'services' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Our Services</h3>
                      <p className="text-sm text-gray-600">Comprehensive banking solutions</p>
                    </div>
                    {servicesDropdown.map((item, index) => (
                      <a 
                        key={index}
                        href={item.href}
                        className="block px-4 py-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-emerald-600">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <Link to='#'
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-emerald-600" 
              >
                Rates & Fees
              </Link>
              
              <Link to='/contact'
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-emerald-600" 
              >
                Contact
              </Link>
              
              <Link to='/FrequentQA'
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2 border-b-2 border-transparent hover:border-emerald-600" 
              >
                Support
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login"
                  className="flex items-center px-6 py-2.5 text-emerald-700 font-semibold rounded-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
                >
                  <FaLock className="mr-2" size={14} />
                  Secure Login
                </Link>
                
                <Link to ="/register"
                  className="flex items-center px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaUser className="mr-2" size={14} />
                  Open Account
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={toggleMenu}
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4 bg-white">
              <nav className="space-y-4">
                <Link to ="/about"
                  className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200" 
                >
                  About Us
                </Link>
                
                <div className="px-4">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Services</div>
                  <div className="space-y-2 ml-4">
                    {servicesDropdown.map((item, index) => (
                      <Link to={item.href}
                        key={index}
                        className="block py-2 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <Link to="#"
                  
                  className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200" 
                  >
                  Rates & Fees

                  </Link>
                
                
                <Link to='/contact'
                  className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200" 
                >
                  Contact
                </Link>
                
                <Link to = "/FrequentQA"
                  className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-all duration-200" 
                >
                  Support
                </Link>
                
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link to = "/login"
                    className="flex items-center justify-center w-full px-4 py-3 text-emerald-700 font-semibold rounded-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <FaLock className="mr-2" size={14} />
                    Secure Login
                  </Link>
                  
                  <Link to = "/register"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg"
                                    >
                    <FaUser className="mr-2" size={14} />
                    Open Account
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default NewNav;