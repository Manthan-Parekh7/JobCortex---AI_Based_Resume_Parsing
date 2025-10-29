// src/api/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // important: send HttpOnly cookies
    headers: { "Content-Type": "application/json" },
});

// Global error handler: unwrap message if backend sends { message }
api.interceptors.response.use(
    (res) => {
        console.log("Axios Interceptor - Response success:", res);
        return res;
    },
    (err) => {
        console.error("Axios Interceptor - Response error:", err);
        const message = err.response?.data?.message || err.response?.statusText || err.message || "Network error";
        console.log("Axios Interceptor - Extracted message:", message);
        return Promise.reject({ success: false, message: message });
    }
);

// Helper functions (return res.data)
export const loginUser = (credentials) => api.post("/auth/login", credentials).then((r) => r.data);
export const signupUser = (data) => api.post("/auth/signup", data).then((r) => r.data);
export const verifyOtpApi = (data) => api.post("/auth/verify-otp", data).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const logoutUser = () => api.post("/auth/logout").then((r) => r.data);

// Candidate API calls
export const getJobs = (params) => api.get("/candidate/jobs", { params }).then((r) => r.data);
export const getJobDetails = (jobId) => api.get(`/candidate/jobs/${jobId}`).then((r) => r.data);
export const updateApplication = (appId, data) => api.put(`/candidate/applications/${appId}`, data).then(r => r.data);
export const withdrawApplication = (appId) => api.put(`/candidate/applications/${appId}`, { status: 'withdrawn' }).then(r => r.data);
export const deleteApplication = (appId) => api.delete(`/candidate/applications/${appId}`).then(r => r.data);

export default api;
