import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.token) {
      throw new Error('Registration succeeded but no token received');
    }
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('tokenTimestamp', Date.now());
    
    return {
      token: response.data.token,
      username: response.data.username,
      email: response.data.email
    };
    
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    const errorMessage = serverMessage || 'Registration failed. Please try again.';
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.token) {
      throw new Error('Login succeeded but no token received');
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('tokenTimestamp', Date.now());
    localStorage.setItem('userEmail', response.data.email); 

    return {
      token: response.data.token,
      email: response.data.email
    };

  } catch (error) {
    const serverMessage = error.response?.data?.message;
    const errorMessage = serverMessage || 'Login failed. Check your credentials.';
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};


export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  const timestamp = localStorage.getItem('tokenTimestamp');
  
  if (token && timestamp && (Date.now() - timestamp > 3600000)) {
    logoutUser();
    return null;
  }
  
  return token;
};

export const getWithAuth = async (url) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No valid authentication token available');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logoutUser();
    }
    console.error('Authenticated request failed:', error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTimestamp');
  localStorage.removeItem('userEmail');
  //navigate()~pages/login
};
export const isAuthenticated = () => {
  return !!getAuthToken();
};