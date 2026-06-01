import axios from 'axios';

const API = axios.create({
  baseURL: 'https://buildtrack-backend-0lvc.onrender.com/api'
});

// Materials
export const getMaterials = () => API.get('/materials');
export const addMaterial = (data) => API.post('/materials', data);
export const updateMaterial = (id, data) => API.put(`/materials/${id}`, data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);

// Sites
export const getSites = () => API.get('/sites');
export const addSite = (data) => API.post('/sites', data);

// Vendors
export const getVendors = () => API.get('/vendors');
export const addVendor = (data) => API.post('/vendors', data);

// Transactions
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export default API;