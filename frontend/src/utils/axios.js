import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, 
});

// Add JWT token automatically if exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // or get from context
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;