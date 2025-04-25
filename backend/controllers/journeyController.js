const { connectDB } = require('../db');

const getJourneyPlan = async (req, res) => {
  const user_id = req.user.id;

  try {
    const db = await connectDB();
    const [results] = await db.execute(
      `SELECT * FROM journey_plans WHERE user_id = ?`,
      [user_id]
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching journeys:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createJourneyPlan = async (req, res) => {
  const user_id = req.user.id;
  const { name, locations, start_date, end_date, activities, description } = req.body;

  if (!name || !locations || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await connectDB();

    const [result] = await db.execute(
      `INSERT INTO journey_plans 
        (user_id, name, locations, start_date, end_date, activities, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        JSON.stringify(locations),
        start_date,
        end_date,
        JSON.stringify(activities || []),
        description || ''
      ]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      name,
      locations,
      start_date,
      end_date,
      activities,
      description
    });
  } catch (err) {
    console.error('Error creating journey:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateJourneyPlan = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const { name, locations, start_date, end_date, activities, description } = req.body;

  try {
    const db = await connectDB();

    const [check] = await db.execute('SELECT * FROM journey_plans WHERE id = ? AND user_id = ?', [id, user_id]);
    if (check.length === 0) return res.status(403).json({ error: 'Not authorized to update this journey' });

    const [result] = await db.execute(
      `UPDATE journey_plans 
       SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ?
       WHERE id = ?`,
      [
        name,
        JSON.stringify(locations),
        start_date,
        end_date,
        JSON.stringify(activities || []),
        description || '',
        id
      ]
    );

    res.json({ message: 'Journey updated successfully' });
  } catch (err) {
    console.error('Error updating journey:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteJourneyPlan = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const db = await connectDB();

    const [check] = await db.execute('SELECT * FROM journey_plans WHERE id = ? AND user_id = ?', [id, user_id]);
    if (check.length === 0) return res.status(403).json({ error: 'Not authorized to delete this journey' });

    const [result] = await db.execute('DELETE FROM journey_plans WHERE id = ?', [id]);

    res.json({ message: 'Journey deleted successfully' });
  } catch (err) {
    console.error('Error deleting journey:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getJourneyPlan,
  createJourneyPlan,
  updateJourneyPlan,
  deleteJourneyPlan
};
