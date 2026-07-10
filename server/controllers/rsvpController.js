const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// POST /api/events/:id/rsvp
exports.submitRsvp = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const { status }       = req.body;
    const user_id          = req.user.id;

    if (!['going', 'maybe', 'declined'].includes(status))
      return res.status(400).json({ message: 'Status must be going, maybe, or declined' });

    const existing = await pool.query('SELECT id FROM rsvps WHERE event_id=$1 AND user_id=$2', [event_id, user_id]);

    if (existing.rows.length) {
      await pool.query('UPDATE rsvps SET status=$1 WHERE event_id=$2 AND user_id=$3', [status, event_id, user_id]);
    } else {
      await pool.query(
        'INSERT INTO rsvps (id, event_id, user_id, status) VALUES ($1,$2,$3,$4)',
        [uuidv4(), event_id, user_id, status]
      );
    }

    res.json({ event_id, user_id, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/events/:id/guests
exports.getGuests = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, r.status FROM rsvps r
       JOIN users u ON r.user_id = u.id WHERE r.event_id = $1 ORDER BY r.created_at ASC`,
      [event_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
