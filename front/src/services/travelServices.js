import axios from 'axios';

const API_URL = 'http://localhost:5000/api/travel';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token, please login.');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };
  

  export const getTravelLogs = async () => {
    const config = authHeader();
    const response = await axios.get(API_URL, config);
    return response.data;
  };
  
  export const createTravelLog = async (travel) => {
    const config = authHeader();
    const response = await axios.post(API_URL, travel, config);
    return response.data;
  };
  
  export const updateTravelLog = async (id, travel) => {
    const config = authHeader();
    const response = await axios.put(`${API_URL}/${id}`, travel, config);
    return response.data;
  };
  
  export const deleteTravelLog = async (id) => {
    const config = authHeader();
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  };
  