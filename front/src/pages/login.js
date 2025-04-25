import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { loginUser, registerUser } from '../services/loginServices';

function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', email: '', address: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleUserLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return setError('Please enter email and password.');

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.token);
      console.log('Logged in:', res.email);
      navigate('/home');
    } catch (err) {
      setError('Login failed. Please check credentials.',err);
    }
  };

  const handleCreateUser = async () => {
    const { email, password, username, address } = registerData;
    
    if (!email || !password || !username || !address) {
      return setError('Please fill all required fields (email, password, username)');
    }
  
    try {
      console.log('Attempting registration with:', registerData);
      const res = await registerUser(registerData);
      
      if (!res.token) {
        throw new Error('Server responded but no token received');
      }
      
      // Instead of navigating to home, show success message and switch to login
      setSuccessMessage('Registration successful! Please login with your credentials.');
      setError(null);
      setIsSignUp(false); // Switch back to login form
      setRegisterData({ username: '', password: '', email: '', address: '' }); // Clear form
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    }
  };

  return (
    <div className='client'>
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {isSignUp ? (
        <>
          <input
            type="text"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={registerData.address}
            onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
          />
          <div className="button-row">
            <button onClick={handleCreateUser}>Sign Up</button>
            <button onClick={() => {
              setIsSignUp(false);
              setError(null);
              setSuccessMessage(null);
            }}>Back to Login</button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <div className="button-row">
            <button onClick={handleUserLogin}>Login</button>
            <button onClick={() => {
              setIsSignUp(true);
              setError(null);
              setSuccessMessage(null);
            }}>Sign Up</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;