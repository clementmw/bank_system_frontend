import axios from 'axios';
import { Eclipse } from 'lucide-react';

const ApiUrl = axios.create({
    baseURL: 'http://localhost:8001/api/v1.0/',
})


ApiUrl.interceptors.request.use(
    (config) => {
        // Read token fresh from localStorage for EACH request
        const tokenData = localStorage.getItem('org_user');
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


export const handleLoginEmployee = async(email, password) => {
    return ApiUrl.post('auth/login/staff/', {email, password})
}

export const handleLogoutEmployee = async(refresh,session_id) => {
    return ApiUrl.post('auth/logout/staff/', {refresh,session_id})
}

export const handleCreateEmployee = async(form) => {
    return ApiUrl.post('auth/employee/creation/', {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role_name: form.role_name,
        employment_type: form.employment_type,
        job_title: form.job_title,
        date_of_hire: form.date_of_hire,
        department: form.department,
        salary: form.salary,
        pay_frequency:form.pay_frequency,
        allowances:form.allowances,
        bank_name:form.bank_name,
        account_number: form.account_number,
        manager: form.manager,
        phone_number: form.phone_number,
        address: form.address,
        emergency_contact: form.emergency_contact,
        emergency_email:form.emergency_email,
        emergency_contact:form.emergency_contact       

})
}


 export const handleGetEmployees = async(params) => {
     return ApiUrl.get(`auth/employee/creation/?${params}`)
 }

 export const handleGetKyc = async() => {
    return ApiUrl.get(`auth/employee/kyc/review/`)
}

