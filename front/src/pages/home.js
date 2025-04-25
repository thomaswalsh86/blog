import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { logoutUser } from '../services/loginServices'; 

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='client'>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Menu'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/home" onClick={toggleSidebar}>Home</Link></li>
          <li><Link to="/journey" onClick={toggleSidebar}>Journey</Link></li>
          <li><Link to="/travel" onClick={toggleSidebar}>Travel Log</Link></li>
        </ul>
      </div>

      <h1>Blog Dashboard</h1>
      <div className="main-buttons-container">
        <button className="item" onClick={() => navigate('/journey')}>Journey Plans </button>
        <button className="item" onClick={() => navigate('/travel')}>Travel Logs</button>
        <button className="item" onClick={() => {logoutUser();navigate('/');}}>Logout</button>
      </div>
    </div>
  );
}

export default Home;