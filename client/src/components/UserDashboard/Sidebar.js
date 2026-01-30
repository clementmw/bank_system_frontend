import React from 'react';
import { 
  Home,
  CreditCard,
  Send,
  Clock,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleLogoutUser } from './Helper';

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

const tokenData = localStorage.getItem('user');
const token = tokenData ? JSON.parse(tokenData).access : null;
const refreshToken = tokenData ? JSON.parse(tokenData).refresh : null;



  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/user-dashboard' },
    { icon: Send, label: 'Send Money', path: '/user-dashboard/send-money' },
    { icon: CreditCard, label: 'My Cards', path: '/user-dashboard/cards' },
    { icon: Clock, label: 'Transactions', path: '/user-dashboard/transactions' },
    { icon: Wallet, label: 'Accounts', path: '/user-dashboard/accounts' },
    { icon: TrendingUp, label: 'Analytics', path: '/user-dashboard/analytics' },
    { icon: FileText, label: 'Statements', path: '/user-dashboard/statements' },
  ];

  const bottomMenuItems = [
    { icon: User, label: 'KYC Profile', path: '/user-dashboard/kyc' },
    { icon: Settings, label: 'Settings', path: '/user-dashboard/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };
const handleLogout = async() => {
    try {
        // Read refresh token fresh from localStorage
        const tokenData = localStorage.getItem('user');
        const refreshToken = tokenData ? JSON.parse(tokenData).refresh : null;
        
        const response = await handleLogoutUser(refreshToken);
        if (response.status === 200){
            localStorage.removeItem('user');
            navigate('/login');
        }
    } catch (error) {
        console.error('Logout failed:', error);
        // Clear localStorage even if logout API fails
        localStorage.removeItem('user');
        navigate('/login');
    }
};

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
          lg:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-white" size={24} />
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-gray-900">Evergreen Bank</span>
            )}
          </div>
          
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${!isOpen && 'justify-center'}
                `}
                title={!isOpen ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Bottom Menu */}
          <div className="px-3 py-4 border-t border-gray-200 space-y-1">
            {bottomMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${!isOpen && 'justify-center'}
                `}
                title={!isOpen ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                text-red-600 hover:bg-red-50 transition-all duration-200
                ${!isOpen && 'justify-center'}
              `}
              title={!isOpen ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="truncate">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;