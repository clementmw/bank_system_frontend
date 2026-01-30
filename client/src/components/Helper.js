import axios from 'axios';

const ApiUrl = axios.create({
    baseURL: 'http://localhost:8000/api/v1.0/',
})


export const handleSignup = async(email,password,phone_number,first_name,last_name,address)=>{
    return ApiUrl.post('auth/register/',{email,password,phone_number,first_name,last_name,address})
}


export  const handleLogin = async(email,password)=>{
    return ApiUrl.post('auth/login/customer/',{email,password})
}