import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Send, 
  Download, 
  TrendingUp, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Settings,
  Clock,
  PiggyBank,
  Wallet,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleAccountsDetails, handleTransactionHistory } from './Helper';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await handleAccountsDetails();

      if (response.status === 200) {
        const accountsData = response.data;
        setAccounts(accountsData);
        
        // Set primary account as default, or first account
        const primaryAccount = accountsData.find(acc => acc.is_primary);
        const defaultAccount = primaryAccount || accountsData[0];
        
        if (defaultAccount) {
          setSelectedAccount(defaultAccount.account_number);
        }
      } else {
        setError('Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Unable to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!selectedAccount) return;

    try {
      setLoadingTransactions(true);
      const response = await handleTransactionHistory(selectedAccount, {});

      if (response.status === 200) {
        const data = response.data;
        // Get only the first 5 transactions for dashboard
        setTransactions(data.results.slice(0, 5));
        
        // Calculate stats from all transactions
        calculateStats(data.results);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const calculateStats = (allTransactions) => {
    const currentAccount = accounts.find(acc => acc.account_number === selectedAccount);
    if (!currentAccount) return;

    // Get current month's transactions
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthTransactions = allTransactions.filter(txn => {
      const txnDate = new Date(txn.created_at);
      return txnDate >= firstDayOfMonth;
    });

    // Calculate income (credits to this account)
    const income = monthTransactions
      .filter(txn => 
        txn.destination_account?.account_number === selectedAccount && 
        txn.trans_status === 'COMPLETED'
      )
      .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);

    // Calculate expenses (debits from this account)
    const expenses = monthTransactions
      .filter(txn => 
        txn.source_account?.account_number === selectedAccount && 
        txn.trans_status === 'COMPLETED'
      )
      .reduce((sum, txn) => sum + parseFloat(txn.amount || 0) + parseFloat(txn.fee || 0), 0);

    setStats({
      income,
      expenses,
      totalTransactions: monthTransactions.length
    });
  };

  const quickActions = [
    { 
      icon: Send, 
      label: 'Send Money', 
      color: 'bg-blue-500', 
      action: () => navigate('/user-dashboard/send-money')
    },
    { 
      icon: Download, 
      label: 'Statements', 
      color: 'bg-green-500', 
      action: () => navigate('/user-dashboard/statements')
    },
    { 
      icon: CreditCard, 
      label: 'My Cards', 
      color: 'bg-purple-500', 
      action: () => navigate('/user-dashboard/cards')
    },
    { 
      icon: Wallet, 
      label: 'Accounts', 
      color: 'bg-indigo-500', 
      action: () => navigate('/user-dashboard/accounts')
    }
  ];

  const formatCurrency = (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-KE', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-KE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getTransactionType = (transaction) => {
    // Determine if this is a credit or debit for the current account
    if (transaction.destination_account?.account_number === selectedAccount) {
      return 'credit';
    } else if (transaction.source_account?.account_number === selectedAccount) {
      return 'debit';
    }
    return 'unknown';
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.description) {
      return transaction.description;
    }
    
    const type = getTransactionType(transaction);
    if (type === 'credit') {
      return `Received from ${transaction.source_account?.account_number || 'External'}`;
    } else if (type === 'debit') {
      return `Sent to ${transaction.destination_account?.account_number || 'External'}`;
    }
    return transaction.transaction_type;
  };

  const currentAccountData = accounts.find(acc => acc.account_number === selectedAccount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAccounts}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Found</h3>
          <p className="text-gray-600 mb-4">Please open an account to get started</p>
          <button
            onClick={() => navigate('/user-dashboard/accounts')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Open Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Refresh */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back!</p>
          </div>
          <button
            onClick={() => {
              fetchAccounts();
              if (selectedAccount) fetchTransactions();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Balance Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-indigo-200 text-sm mb-1">Available Balance</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold">
                      {showBalance && currentAccountData
                        ? formatCurrency(parseFloat(currentAccountData.available_balance), currentAccountData.currency)
                        : '••••••••'}
                    </h2>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {currentAccountData && currentAccountData.balance !== currentAccountData.available_balance && (
                    <p className="text-indigo-200 text-sm mt-2">
                      Total: {showBalance ? formatCurrency(parseFloat(currentAccountData.balance), currentAccountData.currency) : '••••••••'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedAccount || ''}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {accounts.map((account) => (
                      <option 
                        key={account.id} 
                        value={account.account_number} 
                        className="text-gray-900"
                      >
                        {account.account_type} - {account.account_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentAccountData && (
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Account Number</p>
                    <p className="text-lg font-mono">{currentAccountData.account_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-sm mb-1">Account Type</p>
                    <p className="text-lg font-medium">{currentAccountData.account_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-sm mb-1">Currency</p>
                    <p className="text-lg font-medium">{currentAccountData.currency}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`${action.color} w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button 
                  onClick={() => navigate('/user-dashboard/transactions')}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  View All
                </button>
              </div>

              {loadingTransactions ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">No recent transactions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const txnType = getTransactionType(transaction);
                    const { date, time } = formatDateTime(transaction.created_at);
                    const txnAmount = parseFloat(transaction.amount);
                    
                    return (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            txnType === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {txnType === 'credit' ? (
                              <ArrowDownLeft className="text-green-600" size={20} />
                            ) : (
                              <ArrowUpRight className="text-red-600" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getTransactionDescription(transaction)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{date} • {time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Ref: {transaction.transaction_ref}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            txnType === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txnType === 'credit' ? '+' : '-'}
                            {formatCurrency(txnAmount, transaction.currency)}
                          </p>
                          {parseFloat(transaction.fee || 0) > 0 && (
                            <p className="text-xs text-gray-500">
                              Fee: {formatCurrency(parseFloat(transaction.fee), transaction.currency)}
                            </p>
                          )}
                          <p className={`text-xs mt-1 ${
                            transaction.trans_status === 'COMPLETED' ? 'text-green-600' :
                            transaction.trans_status === 'PENDING' ? 'text-yellow-600' :
                            transaction.trans_status === 'FAILED' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {transaction.trans_status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Income This Month</p>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentAccountData ? formatCurrency(stats.income, currentAccountData.currency) : 'KES 0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {stats.totalTransactions} transactions
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Expenses This Month</p>
                  <BarChart3 className="text-red-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentAccountData ? formatCurrency(stats.expenses, currentAccountData.currency) : 'KES 0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Including fees
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Net Flow</p>
                  <PiggyBank className="text-indigo-500" size={20} />
                </div>
                <p className={`text-2xl font-bold ${
                  stats.income - stats.expenses >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentAccountData 
                    ? formatCurrency(stats.income - stats.expenses, currentAccountData.currency) 
                    : 'KES 0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.income >= stats.expenses ? 'Positive' : 'Negative'} cash flow
                </p>
              </div>
            </div>

            {/* Account Status */}
            {currentAccountData && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentAccountData.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      currentAccountData.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentAccountData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Primary Account</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentAccountData.is_primary ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Opened</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(currentAccountData.opened_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/user-dashboard/statements')}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm">Statement Download</span>
                  <Download size={16} />
                </button>
                <button 
                  onClick={() => navigate('/user-dashboard/transactions')}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm">Transaction History</span>
                  <Clock size={16} />
                </button>
                <button 
                  onClick={() => navigate('/user-dashboard/settings')}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm">Account Settings</span>
                  <Settings size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;