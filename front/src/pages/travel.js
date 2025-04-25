import { Link } from 'react-router-dom';
import '../App.css';
import React, { useState, useEffect } from 'react';
import { 
  getTravelLogs, 
  createTravelLog, 
  updateTravelLog, 
  deleteTravelLog 
} from '../services/travelServices';

function Travel() {
  const [travelLogs, setTravelLogs] = useState([]);
  const [newTravelLog, setNewTravelLog] = useState({ 
    title: '', 
    description: '', 
    start_date: '', 
    end_date: '',
    tags: '' 
  });
  const [editTravelLog, setEditTravelLog] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetchTravelLogs();
  }, []);

  const fetchTravelLogs = async () => {
    try {
      const data = await getTravelLogs();
      setTravelLogs(data);
    } catch (error) {
      console.error('Failed to fetch travel logs:', error);
      setError('Failed to fetch travel logs');
    }
  };

  const handleCreateTravelLog = async () => {
    try {
      const formattedLog = {
        ...newTravelLog,
        tags: newTravelLog.tags.split(',').map(tag => tag.trim())
      };
      const createdLog = await createTravelLog(formattedLog);
      setTravelLogs([...travelLogs, createdLog]);
      setNewTravelLog({ 
        title: '', 
        description: '', 
        start_date: '', 
        end_date: '',
        tags: '' 
      });
      setError(null);
    } catch (error) {
      console.error('Failed to create travel log:', error);
      setError('Failed to create travel log');
    }
  };

  const handleUpdateTravelLog = async (id) => {
    try {
      if (!editTravelLog) return;
      
      const formattedLog = {
        ...editTravelLog,
        tags: editTravelLog.tags.split(',').map(tag => tag.trim())
        
      };
      
      const updatedLog = await updateTravelLog(id, formattedLog);
      setTravelLogs(travelLogs.map(log => (log.id === id ? updatedLog : log)));
      setEditTravelLog(null);
      setError(null);
      window.location.reload(); 
    } catch (error) {
      console.error('Failed to update travel log:', error);
      setError('Failed to update travel log');
    }
  };

  const handleDeleteTravelLog = async (id) => {
    try {
      await deleteTravelLog(id);
      setTravelLogs(travelLogs.filter(log => log.id !== id));
    } catch (error) {
      console.error('Failed to delete travel log:', error);
      setError('Failed to delete travel log');
    }
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

      <h1>Travel Log Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>{editTravelLog ? 'Edit Travel Log' : 'Add a New Travel Log'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={editTravelLog ? editTravelLog.title : newTravelLog.title}
          onChange={(e) =>
            editTravelLog
              ? setEditTravelLog({ ...editTravelLog, title: e.target.value })
              : setNewTravelLog({ ...newTravelLog, title: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={editTravelLog ? editTravelLog.description : newTravelLog.description}
          onChange={(e) =>
            editTravelLog
              ? setEditTravelLog({ ...editTravelLog, description: e.target.value })
              : setNewTravelLog({ ...newTravelLog, description: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Start Date"
          value={editTravelLog ? editTravelLog.start_date : newTravelLog.start_date}
          onChange={(e) =>
            editTravelLog
              ? setEditTravelLog({ ...editTravelLog, start_date: e.target.value })
              : setNewTravelLog({ ...newTravelLog, start_date: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="End Date"
          value={editTravelLog ? editTravelLog.end_date : newTravelLog.end_date}
          onChange={(e) =>
            editTravelLog
              ? setEditTravelLog({ ...editTravelLog, end_date: e.target.value })
              : setNewTravelLog({ ...newTravelLog, end_date: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={editTravelLog ? editTravelLog.tags : newTravelLog.tags}
          onChange={(e) =>
            editTravelLog
              ? setEditTravelLog({ ...editTravelLog, tags: e.target.value })
              : setNewTravelLog({ ...newTravelLog, tags: e.target.value })
          }
        />

        {editTravelLog ? (
          <>
            <button onClick={() => handleUpdateTravelLog(editTravelLog.id)}>Save Changes</button>
            <button onClick={() => setEditTravelLog(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={handleCreateTravelLog}>Add Travel Log</button>
        )}
      </div>

      <div>
        <h2>Travel Logs</h2>
        <ul>
          {travelLogs.map((log) => (
            <li key={log.id}>
              <strong>Title:</strong> {log.title} | <strong>Start:</strong> {log.start_date} | <strong>End:</strong> {log.end_date}<br />
              <strong>Description:</strong> {log.description}<br />
              <strong>Tags:</strong> {String(log.tags).replace(/[\[\]"]+/g, '').replace(/,/g, ', ')}
              <div>
                <button onClick={() =>
                  setEditTravelLog({
                    id: log.id,
                    title: log.title || '',
                    description: log.description || '',
                    start_date: log.start_date || '',
                    end_date: log.end_date || '',
                    tags: Array.isArray(log.tags) ? log.tags.join(', ') : log.tags || ''
                  })
                }>Edit</button>
                <button onClick={() => handleDeleteTravelLog(log.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Travel;