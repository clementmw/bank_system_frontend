import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  X,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { handleAccountsDetails, handleTransactionHistory } from './Helper';

const TransactionsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [previousCursor, setPreviousCursor] = useState(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    transaction_type: '',
    status: '',
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
    search: ''
  });

  // Stats
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalTransactions: 0,
    pendingCount: 0
  });

  const transactionTypes = [
    { value: '', label: 'All Types' },
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'DEPOSIT', label: 'Deposit' },
    { value: 'WITHDRAWAL', label: 'Withdrawal' },
    { value: 'PAYMENT', label: 'Payment' },
    { value: 'REFUND', label: 'Refund' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REVERSED', label: 'Reversed' }
  ];

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

        if (accountsData.length > 0) {
          const primaryAccount = accountsData.find(acc => acc.is_primary);
          const defaultAccount = primaryAccount || accountsData[0];
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

  const fetchTransactions = async (cursor = null, isPrevious = false) => {
    if (!selectedAccount) return;

    try {
      setLoadingTransactions(true);
      setError('');

      const filterParams = { ...filters };
      if (cursor) {
        filterParams.cursor = cursor;
      }

      const response = await handleTransactionHistory(selectedAccount, filterParams);

      if (response.status === 200) {
        const data = response.data;
        setTransactions(data.results || []);
        setHasMore(data.has_more || false);
        setNextCursor(data.next || null);
        setPreviousCursor(data.previous || null);

        // Calculate stats
        calculateStats(data.results || []);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Unable to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const calculateStats = (txns) => {
    const currentAccount = accounts.find(acc => acc.account_number === selectedAccount);
    if (!currentAccount) return;

    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingCount = 0;

    txns.forEach(txn => {
      if (txn.trans_status === 'PENDING') {
        pendingCount++;
      }

      if (txn.trans_status === 'COMPLETED') {
        const amount = parseFloat(txn.amount || 0);
        const fee = parseFloat(txn.fee || 0);

        // Check if it's income (credit)
        if (txn.destination_account?.account_number === selectedAccount) {
          totalIncome += amount;
        }
        // Check if it's expense (debit)
        else if (txn.source_account?.account_number === selectedAccount) {
          totalExpenses += amount + fee;
        }
      }
    });

    setStats({
      totalIncome,
      totalExpenses,
      totalTransactions: txns.length,
      pendingCount
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setNextCursor(null);
    setPreviousCursor(null);
    fetchTransactions();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      transaction_type: '',
      status: '',
      start_date: '',
      end_date: '',
      min_amount: '',
      max_amount: '',
      search: ''
    });
    setNextCursor(null);
    setPreviousCursor(null);
  };

  const handleNextPage = () => {
    if (nextCursor && hasMore) {
      fetchTransactions(nextCursor, false);
    }
  };

  const handlePreviousPage = () => {
    if (previousCursor) {
      fetchTransactions(previousCursor, true);
    }
  };

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
      }),
      full: date.toLocaleString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getTransactionType = (transaction) => {
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
    return transaction.transaction_type || 'Transaction';
  };

  const getStatusConfig = (status) => {
    const configs = {
      COMPLETED: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Completed',
        iconColor: 'text-green-600'
      },
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'Pending',
        iconColor: 'text-yellow-600'
      },
      FAILED: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Failed',
        iconColor: 'text-red-600'
      },
      REVERSED: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle,
        label: 'Reversed',
        iconColor: 'text-gray-600'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Date', 'Reference', 'Type', 'Description', 'Amount', 'Fee', 'Status', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(txn => {
        const type = getTransactionType(txn);
        const amount = parseFloat(txn.amount || 0);
        const fee = parseFloat(txn.fee || 0);
        const { full } = formatDateTime(txn.created_at);

        return [
          `"${full}"`,
          txn.transaction_ref,
          type === 'credit' ? 'Credit' : 'Debit',
          `"${getTransactionDescription(txn)}"`,
          type === 'credit' ? amount : -amount,
          fee,
          txn.trans_status,
          '' // Balance can be calculated if needed
        ].join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${selectedAccount}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const currentAccountData = accounts.find(acc => acc.account_number === selectedAccount);

  // Skeleton Components
  const TransactionRowSkeleton = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-5 w-24 bg-gray-200 rounded ml-auto"></div>
          <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
          <div className="h-4 w-20 bg-gray-200 rounded ml-auto"></div>
        </div>
      </div>
    </div>
  );

  const StatsCardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-8 w-36 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-6 space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="w-48 h-10 bg-gray-200 rounded"></div>
              <div className="w-32 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Transactions List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Transactions</h3>
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
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Found</h3>
          <p className="text-gray-600 mb-4">Please open an account to view transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">View and manage all your transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.account_number}>
                  {account.account_type} - {account.account_number}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchTransactions()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Total Income</p>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentAccountData ? formatCurrency(stats.totalIncome, currentAccountData.currency) : 'KES 0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Credits received</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-red-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentAccountData ? formatCurrency(stats.totalExpenses, currentAccountData.currency) : 'KES 0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Including fees</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Net Flow</p>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-indigo-600" size={20} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${
              stats.totalIncome - stats.totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentAccountData 
                ? formatCurrency(stats.totalIncome - stats.totalExpenses, currentAccountData.currency)
                : 'KES 0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalIncome >= stats.totalExpenses ? 'Positive' : 'Negative'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.pendingCount > 0 ? `${stats.pendingCount} pending` : 'All completed'}
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by description or reference..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={20} />
                Filters
                {Object.values(filters).some(v => v !== '') && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>

              {Object.values(filters).some(v => v !== '') && (
                <button
                  onClick={() => {
                    clearFilters();
                    fetchTransactions();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                onClick={exportTransactions}
                disabled={transactions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={filters.transaction_type}
                  onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.min_amount}
                  onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.max_amount}
                  onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Transactions List */}
        {loadingTransactions ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some(v => v !== '')
                ? 'Try adjusting your filters to see more results'
                : 'No transactions available for this account'}
            </p>
            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={() => {
                  clearFilters();
                  fetchTransactions();
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const txnType = getTransactionType(transaction);
                const { date, time } = formatDateTime(transaction.created_at);
                const txnAmount = parseFloat(transaction.amount || 0);
                const txnFee = parseFloat(transaction.fee || 0);
                const statusConfig = getStatusConfig(transaction.trans_status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={transaction.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          txnType === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {txnType === 'credit' ? (
                            <ArrowDownLeft className="text-green-600" size={20} />
                          ) : (
                            <ArrowUpRight className="text-red-600" size={20} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 mb-1">
                            {getTransactionDescription(transaction)}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{date} • {time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400">Ref:</span>
                              <span className="font-mono text-xs">{transaction.transaction_ref}</span>
                            </div>
                            {transaction.transaction_type && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {transaction.transaction_type}
                              </span>
                            )}
                          </div>
                          {transaction.external_ref && (
                            <p className="text-xs text-gray-500 mt-1">
                              External Ref: {transaction.external_ref}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center justify-between lg:justify-end gap-6">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            txnType === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txnType === 'credit' ? '+' : '-'}
                            {formatCurrency(txnAmount, transaction.currency)}
                          </p>
                          {txnFee > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Fee: {formatCurrency(txnFee, transaction.currency)}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Additional details available
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {(hasMore || previousCursor) && (
              <div className="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <button
                  onClick={handlePreviousPage}
                  disabled={!previousCursor}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown size={20} className="rotate-90" />
                  Previous
                </button>

                <p className="text-sm text-gray-600">
                  Showing {transactions.length} transactions
                  {hasMore && ' • More available'}
                </p>

                <button
                  onClick={handleNextPage}
                  disabled={!hasMore || !nextCursor}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronDown size={20} className="-rotate-90" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;