import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CreditCard, 
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Briefcase,
  PiggyBank,
  X
} from 'lucide-react';
import { handleAccountOpening, handleAccountsDetails } from './Helper';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    account_type: '',
    currency: 'KES'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const accountTypes = [
    { 
      value: 'SAVINGS', 
      label: 'Savings Account',
      icon: PiggyBank,
      description: 'Earn interest on your savings',
      features: ['Interest earning', 'Daily limit: KES 100,000', 'Monthly limit: KES 1,000,000'],
      color: 'from-green-500 to-emerald-600'
    },
    { 
      value: 'FIXED_DEPOSIT', 
      label: 'Fixed Deposit Account',
      icon: TrendingUp,
      description: 'Higher interest rates with term commitment',
      features: ['Higher interest rates', 'Term-based deposits', 'Secure investment'],
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      value: 'BUSINESS', 
      label: 'Business Account',
      icon: Briefcase,
      description: 'Designed for business transactions',
      features: ['Higher transaction limits', 'Daily limit: KES 1,000,000', 'Business features'],
      color: 'from-purple-500 to-violet-600'
    }
  ];

  const currencies = [
    { value: 'KES', label: 'Kenyan Shilling (KES)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' }
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).access : null;

      const response = await handleAccountsDetails()

      if (response.status === 200) {
        const data = await response.data;
        setAccounts(data);
        
        // Initialize balance visibility state
        const initialShowBalance = {};
        data.forEach(acc => {
          initialShowBalance[acc.id] = true;
        });
        setShowBalance(initialShowBalance);
      } else {
        setError('Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).access : null;

      const response = await handleAccountOpening(
        formData.account_type,
        formData.currency
      )

      const data = await response.json();

      if (response.status === 201) {
        setSuccess(`Account created successfully! Account Number: ${data.account_number}`);
        setShowModal(false);
        setFormData({ account_type: '', currency: 'KES' });
        fetchAccounts(); // Refresh accounts list
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        console.log(data.error)
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBalance = (accountId) => {
    setShowBalance(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const formatCurrency = (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      PENDING_APPROVAL: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      SUSPENDED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.PENDING_APPROVAL;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getAccountTypeIcon = (type) => {
    const typeConfig = {
      SAVINGS: { icon: PiggyBank, color: 'from-green-500 to-emerald-600' },
      FIXED_DEPOSIT: { icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
      BUSINESS: { icon: Briefcase, color: 'from-purple-500 to-violet-600' }
    };

    return typeConfig[type] || typeConfig.SAVINGS;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Open New Account
        </button>
        <button
          onClick={() => fetchAccounts()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
          <p className="text-gray-600 mb-4">Open your first account to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Open Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const accountConfig = getAccountTypeIcon(account.account_type);
            const AccountIcon = accountConfig.icon;

            return (
              <div
                key={account.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${accountConfig.color} p-6 text-white`}>
                  <div className="flex justify-between items-start mb-4">
                    <AccountIcon size={32} />
                    {account.is_primary && (
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{account.account_type}</h3>
                  <p className="text-sm opacity-90">A/C: {account.account_number}</p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Balance */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Available Balance</span>
                      <button
                        onClick={() => toggleBalance(account.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {showBalance[account.id] ? (
                          <EyeOff size={16} className="text-gray-600" />
                        ) : (
                          <Eye size={16} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {showBalance[account.id]
                        ? formatCurrency(parseFloat(account.available_balance), account.currency)
                        : '••••••••'}
                    </p>
                    {account.balance !== account.available_balance && (
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {formatCurrency(parseFloat(account.balance), account.currency)}
                      </p>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Currency</span>
                      <span className="font-medium text-gray-900">{account.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Opened</span>
                      <span className="font-medium text-gray-900">
                        {new Date(account.opened_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Status</span>
                    {getStatusBadge(account.status)}
                  </div>

                  {/* Account Features */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex items-center gap-2 text-xs">
                      {account.allow_debit ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <XCircle size={14} className="text-red-600" />
                      )}
                      <span className="text-gray-700">Debit</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {account.allow_credit ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <XCircle size={14} className="text-red-600" />
                      )}
                      <span className="text-gray-700">Credit</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Open Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Open New Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Account Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Account Type *
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {accountTypes.map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, account_type: type.value })}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            formData.account_type === type.value
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                              <TypeIcon className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                              <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                              <ul className="space-y-1">
                                {type.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                                    <CheckCircle size={12} className="text-green-600" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="text-blue-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-2">Important Information</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Your KYC must be verified to open an account</li>
                        <li>Account will be pending approval initially</li>
                        <li>You'll receive a notification once approved</li>
                        <li>Transaction limits apply based on account type</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenAccount}
                disabled={!formData.account_type || submitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Open Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;