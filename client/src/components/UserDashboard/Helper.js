// will handle all the communication routes to the backend
import axios from 'axios';

const ApiUrl = axios.create({
    baseURL: 'http://localhost:8000/api/v1.0/',
})


ApiUrl.interceptors.request.use(
    (config) => {
        // Read token fresh from localStorage for EACH request
        const tokenData = localStorage.getItem('user');
        const token = tokenData ? JSON.parse(tokenData).access : null;
        
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const handleSignup = async(email, password, phone_number, first_name, last_name, address) => {
    return ApiUrl.post('auth/register/', {email, password, phone_number, first_name, last_name, address})
}

export const handleLogin = async(email, password) => {
    return ApiUrl.post('auth/login/customer/', {email, password})
}

export const getKycdata = async() => {
    return ApiUrl.get('auth/kyc/')
}

export const handleKycUpload = async(formData) => {
    return ApiUrl.post('auth/kyc/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const handleKycDocumentUpdate = async(documentId, formData) => {
    return ApiUrl.patch(`auth/kyc/documents/${documentId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const handleLogoutUser = async(refresh) => {
    return ApiUrl.post('auth/logout/', {refresh})
}

// accounts routes

export const handleAccountsDetails = async() => {
    return ApiUrl.get('accounts/create/account/')
}

export const handleAccountOpening = async(account_type,currency) => {
    return ApiUrl.post('accounts/create/account/', {account_type, currency})
}

// transaction routes 
export const handleInternalTransfer = async() => {
    return ApiUrl.post('transactions/internal_transfer/')
}

export const handleTransactionHistory = async(account_number, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
    if (filters.status) params.append('status', filters.status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.min_amount) params.append('min_amount', filters.min_amount);
    if (filters.max_amount) params.append('max_amount', filters.max_amount);
    if (filters.search) params.append('search', filters.search);
    if (filters.cursor) params.append('cursor', filters.cursor);
    
    const queryString = params.toString();
    const url = queryString 
        ? `transactions/history/${account_number}?${queryString}`
        : `transactions/history/${account_number}`;
    
    return ApiUrl.get(url);
}

// Get transaction statistics (you may need to create this endpoint)
export const handleTransactionStats = async(account_number, period = 'month') => {
    return ApiUrl.get(`transactions/stats/${account_number}?period=${period}`);
}