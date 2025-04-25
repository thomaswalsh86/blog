const { connectDB } = require('../db');

const getTravelLogsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await connectDB();
    const [results] = await db.execute('SELECT * FROM travel_logs WHERE user_id = ?', [userId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching user travel logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTravelLog = async (req, res) => {
  const user_id = req.user.id; 
  const { title, description, start_date, end_date, post_date, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  try {
    const db = await connectDB();
    const [result] = await db.execute(
      `INSERT INTO travel_logs 
       (user_id, title, description, start_date, end_date, post_date, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        description || null,
        start_date || null,
        end_date || null,
        post_date || new Date(),
        JSON.stringify(tags || [])
      ]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      title,
      description,
      start_date,
      end_date,
      post_date,
      tags
    });
  } catch (err) {
    console.error('Error creating travel log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTravelLog = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { title, description, start_date, end_date, post_date, tags } = req.body;

  try {
    const db = await connectDB();

    const [check] = await db.execute('SELECT * FROM travel_logs WHERE id = ? AND user_id = ?', [id, user_id]);
    if (check.length === 0) return res.status(403).json({ error: 'Not authorized to update this log' });

    const [result] = await db.execute(
      `UPDATE travel_logs 
       SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ?
       WHERE id = ?`,
      [
        title,
        description,
        start_date,
        end_date,
        post_date || new Date(),
        JSON.stringify(tags || []),
        id
      ]
    );

    res.json({ message: 'Travel log updated successfully' });
  } catch (err) {
    console.error('Error updating travel log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTravelLog = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const db = await connectDB();

    const [check] = await db.execute('SELECT * FROM travel_logs WHERE id = ? AND user_id = ?', [id, user_id]);
    if (check.length === 0) return res.status(403).json({ error: 'Not authorized to delete this log' });

    const [result] = await db.execute('DELETE FROM travel_logs WHERE id = ?', [id]);
    res.json({ message: 'Travel log deleted successfully' });
  } catch (err) {
    console.error('Error deleting travel log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTravelLogsByUser,
  createTravelLog,
  updateTravelLog,
  deleteTravelLog
};
