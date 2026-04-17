import React, { useState } from 'react';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight, FaBuilding, FaUserCircle } from 'react-icons/fa';
import login from '../images/loginpg.jpg';
import { handleLogin } from './Helper';
import { useNavigate } from 'react-router-dom';
import { handleLoginEmployee } from './OrganisationDashboard/OrgHelper';

// ─── User type toggle ────────────────────────────────────────────────────────
// 'customer' → uses handleLogin           → navigates to /user-dashboard
// 'staff'    → uses handleLoginEmployee   → navigates to /org-dashboard/:dept
// ─────────────────────────────────────────────────────────────────────────────

function LoginPage() {
  const [userType, setUserType]         = useState('customer'); // 'customer' | 'staff'
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Normalise whatever department string the backend sends
  // into the route segment used in the frontend
  const deptRouteMap = {
    finance:            'finance',
    hr:                 'hr',
    it:                 'it',
    'it/tech':          'it',
    compliance:         'compliance',
    legal:              'compliance',
    operations:         'operations',
    ops:                'operations',
    customer_service:   'customer-service',
    'customer-service': 'customer-service',
    cs:                 'customer-service',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      if (userType === 'staff') {
        // ── Staff path ───────────────────────────────────────────────────────
        const response = await handleLoginEmployee(formData.email, formData.password);

        if (response.status === 200) {
          // Store under 'org_user' — matches the interceptor key in your Helper.js
          localStorage.setItem('org_user', JSON.stringify({
            user:       response.data.user,
            access:     response.data.access,
            refresh:    response.data.refresh,
            department: response.data.user.profile.department.name, // e.g. "finance", "hr"
            role:       response.data.user.role_name,        // e.g. "manager", "analyst"
          }));

          const dept = deptRouteMap[response.data.user.profile.department.name?.toLowerCase()]
            ?? response.data.user.profile.department.name;
          navigate(`/org-dashboard/${dept}`);
        }

      } else {
        // ── Customer path ────────────────────────────────────────────────────
        const response = await handleLogin(formData.email, formData.password);

        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify({
            user:       response.data.user,
            access:     response.data.access,
            refresh:    response.data.refresh,
            kyc_status: response.data.kyc_status,
          }));

          navigate(
            response.data.kyc_status === 'INCOMPLETE'
              ? '/user-dashboard/kyc-onboarding'
              : '/user-dashboard/'
          );
        }
      }

    } catch (err) {
      const msg =
        err?.response?.data?.detail   ||
        err?.response?.data?.message  ||
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const isStaff = userType === 'staff';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">

          {/* ── Left panel ──────────────────────────────────────────────── */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 flex flex-col justify-center items-center overflow-hidden">
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

            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                {isStaff ? 'Staff Portal' : 'Welcome Back!'}
              </h1>
              <p className="text-white/90 text-lg max-w-md mx-auto">
                {isStaff
                  ? 'Access the Evergreen Bank internal dashboard. Your credentials are provided by your administrator.'
                  : 'Access your Evergreen Bank account securely and manage your finances with ease.'}
              </p>
              <div className="mt-8">
                <img
                  src={login}
                  alt="Banking illustration"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            <div className="absolute top-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>

          {/* ── Right panel ─────────────────────────────────────────────── */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">

              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Sign In</h2>
                <p className="text-gray-500 text-sm">Choose your account type to continue</p>
              </div>

              {/* ── User type toggle ───────────────────────────────────── */}
              <div className="flex rounded-xl border border-gray-200 p-1 mb-6 bg-gray-50">
                <button
                  type="button"
                  onClick={() => { setUserType('customer'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${!isStaff
                      ? 'bg-white text-emerald-700 shadow-sm border border-gray-200'
                      : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaUserCircle size={15} />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setUserType('staff'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${isStaff
                      ? 'bg-white text-emerald-700 shadow-sm border border-gray-200'
                      : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaBuilding size={14} />
                  Staff
                </button>
              </div>

              {/* Staff notice */}
              {isStaff && (
                <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                  <span className="font-semibold">Staff access only.</span> Use the credentials
                  provided by your system administrator.
                </div>
              )}

              {/* ── Form ──────────────────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 text-sm"
                      placeholder={isStaff ? 'staff@evergreenbank.com' : 'you@example.com'}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    {/* Hide forgot-password for staff — IT handles resets */}
                    {!isStaff && (
                      <a href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Forgot?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200 text-sm"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me — customers only */}
                {!isStaff && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me for 30 days
                    </label>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-black font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isStaff ? 'Access Staff Portal' : 'Sign In'}
                      <FaArrowRight size={14} />
                    </span>
                  )}
                </button>

                {/* Register link — customers only */}
                {!isStaff && (
                  <>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-4 bg-white text-gray-400">New to Evergreen Bank?</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <a
                        href="/register"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                      >
                        Create an account
                        <FaArrowRight size={12} />
                      </a>
                    </div>
                  </>
                )}
              </form>

              {/* Help */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 text-center">
                  Need help?{' '}
                  <a href="mailto:evergreenbank7@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    evergreenbank7@gmail.com
                  </a>
                  {isStaff && (
                    <span className="block mt-1 text-gray-400">
                      For account issues, contact your IT administrator.
                    </span>
                  )}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;