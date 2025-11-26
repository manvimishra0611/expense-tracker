import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL }); // note: api.get('/api/expenses') becomes GET http://localhost:5000/api/expenses
export default api;
