import { Link } from 'react-router-dom';
import '../App.css';
import React, { useState, useEffect } from 'react';
import { getJourneyPlan, createJourneyPlan, updateJourneyPlan, deleteJourneyPlan } from '../services/journeyServices';

function Journey() {
  const [journeys, setJourneys] = useState([]);
  const [newJourney, setNewJourney] = useState({ 
    name: '', 
    locations: '', 
    start_date: '', 
    end_date: '', 
    activities: '', 
    description: '' 
  });
  const [editJourney, setEditJourney] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      const data = await getJourneyPlan();
      setJourneys(data);
    } catch (error) {
      console.error('Failed to fetch journeys:', error);
      setError('Failed to fetch journeys');
    }
  };

  const handleCreateJourney = async () => {
    try {
      const formattedJourney = {
        ...newJourney,
        locations: newJourney.locations.split(',').map(loc => loc.trim()),
        activities: newJourney.activities.split(',').map(act => act.trim())
      };
      const created = await createJourneyPlan(formattedJourney);
      setJourneys([...journeys, created]);
      setNewJourney({ name: '', locations: '', start_date: '', end_date: '', activities: '', description: '' });
      setError(null);
    } catch (error) {
      console.error('Failed to create journey:', error);
      setError('Failed to create journey');
    }
  };

  const handleUpdateJourney = async (id) => {
    try {
      if (!editJourney) return;

      const formattedJourney = {
        ...editJourney,
        locations: editJourney.locations.split(',').map(loc => loc.trim()),
        activities: editJourney.activities.split(',').map(act => act.trim())
      };

      const updated = await updateJourneyPlan(id, formattedJourney);
      setJourneys(journeys.map(j => (j.id === id ? updated : j)));
      setEditJourney(null);
      window.location.reload(); 
      setError(null);
    } catch (error) {
      console.error('Failed to update journey:', error);
      setError('Failed to update journey');
    }
  };

  const handleDeleteJourney = async (id) => {
    try {
      await deleteJourneyPlan(id);
      setJourneys(journeys.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete journey:', error);
      setError('Failed to delete journey');
    }
  };

  const cleanArrayDisplay = (arrayData) => {
    if (Array.isArray(arrayData)) {
      return arrayData.join(', ');
    }
    if (typeof arrayData === 'string') {
      return arrayData.replace(/[\[\]"]+/g, '').replace(/,/g, ', ');
    }
    return '';
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

      <h1>Journey Plan Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>{editJourney ? 'Edit Journey Plan' : 'Add a New Journey Plan'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={editJourney ? editJourney.name : newJourney.name}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, name: e.target.value })
              : setNewJourney({ ...newJourney, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Locations (comma separated)"
          value={editJourney ? editJourney.locations : newJourney.locations}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, locations: e.target.value })
              : setNewJourney({ ...newJourney, locations: e.target.value })
          }
        />
        <input
          type="date"
          value={editJourney ? editJourney.start_date : newJourney.start_date}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, start_date: e.target.value })
              : setNewJourney({ ...newJourney, start_date: e.target.value })
          }
        />
        <input
          type="date"
          value={editJourney ? editJourney.end_date : newJourney.end_date}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, end_date: e.target.value })
              : setNewJourney({ ...newJourney, end_date: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Activities (comma separated)"
          value={editJourney ? editJourney.activities : newJourney.activities}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, activities: e.target.value })
              : setNewJourney({ ...newJourney, activities: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={editJourney ? editJourney.description : newJourney.description}
          onChange={(e) =>
            editJourney
              ? setEditJourney({ ...editJourney, description: e.target.value })
              : setNewJourney({ ...newJourney, description: e.target.value })
          }
        />

        {editJourney ? (
          <>
            <button onClick={() => handleUpdateJourney(editJourney.id)}>Save Changes</button>
            <button onClick={() => setEditJourney(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={handleCreateJourney}>Add Journey</button>
        )}
      </div>

      <div>
        <h2>Journey Plans</h2>
        <ul>
          {journeys.map((j) => (
            <li key={j.id}>
              <strong>Name:</strong> {j.name} | <strong>Start:</strong> {j.start_date} | <strong>End:</strong> {j.end_date}<br />
              <strong>Locations:</strong> {cleanArrayDisplay(j.locations)}<br />
              <strong>Activities:</strong> {cleanArrayDisplay(j.activities)}<br />
              <strong>Description:</strong> {j.description}
              <div>
                <button onClick={() =>
                  setEditJourney({
                    id: j.id,
                    name: j.name || '',
                    locations: cleanArrayDisplay(j.locations),
                    start_date: j.start_date || '',
                    end_date: j.end_date || '',
                    activities: cleanArrayDisplay(j.activities),
                    description: j.description || ''
                  })
                }>Edit</button>
                <button onClick={() => handleDeleteJourney(j.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Journey;