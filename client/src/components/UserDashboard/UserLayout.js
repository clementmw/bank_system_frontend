// handle the routing in the user dashboard
import { useState, useEffect } from 'react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Menu, Bell, User, X } from 'lucide-react';
import KYCOnboarding from './KYCOnboarding';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import AccountManagement from './AccountManagement';
import KYCDocumentsView from './KYCDocumentsView';
import TransactionsPage from './TransactionsPage';

function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : { first_name: 'User' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-20'}
        `}
      >
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} className="text-gray-600" />
              </button>

              {/* Desktop: Empty space to push user info to right */}
              <div className="flex-1" />

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="text-indigo-600" size={20} />
                  </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 text-gray-600"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile User Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="kyc" element={<KYCDocumentsView />} />
            <Route path="kyc-onboarding" element={<KYCOnboarding />} />
            <Route path='accounts' element = {<AccountManagement/>}/>
            <Route path='transactions' element = {<TransactionsPage/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default UserLayout;