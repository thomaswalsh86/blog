import axios from 'axios';
import { getAuthToken, logoutUser } from './loginServices'; // Reuse your auth utilities

const API_URL = 'http://localhost:5000/api/journey';

// In journeyServices.js
const authHeader = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // More descriptive error
    throw new Error('No authentication token found. Please login first.');
  }

  // Verify token expiration (if using JWT)
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  const ONE_HOUR = 3600000; // ms
  
  if (tokenTimestamp && (Date.now() - tokenTimestamp > ONE_HOUR)) {
    localStorage.removeItem('token');
    throw new Error('Session expired. Please login again.');
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getJourneyPlan = async () => {
  try {
    const config = await authHeader();
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logoutUser();
      window.location.reload(); // Force refresh to redirect to login
    }
    console.error('Journey fetch error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch journey plans');
  }
};

export const createJourneyPlan = async (journey) => {
  try {
    console.log('Creating journey:', journey); // Debug log
    const config = await authHeader();
    const response = await axios.post(API_URL, journey, config);
    return response.data;
  } catch (error) {
    console.error('Journey creation error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      `Failed to create journey: ${error.message}`
    );
  }
};

export const updateJourneyPlan = async (id, journey) => {
  try {
    const config = await authHeader();
    const response = await axios.put(`${API_URL}/${id}`, journey, config);
    return response.data;
  } catch (error) {
    console.error('Journey update error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      `Failed to update journey ${id}: ${error.message}`
    );
  }
};

export const deleteJourneyPlan = async (id) => {
  try {
    const config = await authHeader();
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Journey deletion error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete journey ${id}: ${error.message}`
    );
  }
};