const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, latitude, longitude, start_date, end_date, visibility, category, cover_image } = req.body;
    if (!title || !start_date || !end_date) return res.status(400).json({ message: 'Title, start_date, end_date required' });

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO events (id, title, description, location, latitude, longitude, start_date, end_date, visibility, category, cover_image, host_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [id, title, description, location, latitude || null, longitude || null, start_date, end_date, visibility || 'public', category || 'Other', cover_image || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { search, category, visibility } = req.query;
    let query = `
      SELECT e.*, u.name AS host_name,
        (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.status = 'going')::int AS rsvp_count
      FROM events e
      JOIN users u ON e.host_id = u.id
      WHERE e.in_trash = FALSE
    `;
    const params = [];
    let i = 1;
    if (search)     { query += ` AND (e.title ILIKE $${i} OR e.description ILIKE $${i})`; params.push(`%${search}%`); i++; }
    if (category)   { query += ` AND e.category = $${i}`;    params.push(category);   i++; }
    if (visibility) { query += ` AND e.visibility = $${i}`;  params.push(visibility); i++; }
    else            { query += ` AND (e.visibility = 'public' OR e.host_id = $${i})`; params.push(req.user.id); i++; }
    query += ' ORDER BY e.start_date ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const evResult = await pool.query(
      `SELECT e.*, u.name AS host_name FROM events e
       JOIN users u ON e.host_id = u.id WHERE e.id = $1 AND e.in_trash = FALSE`,
      [id]
    );
    if (!evResult.rows.length) return res.status(404).json({ message: 'Event not found' });

    const rsvpResult = await pool.query('SELECT status FROM rsvps WHERE event_id = $1 AND user_id = $2', [id, req.user.id]);
    const imgResult  = await pool.query('SELECT * FROM gallery WHERE event_id = $1 ORDER BY created_at ASC', [id]);

    res.json({ event: evResult.rows[0], myRsvp: rsvpResult.rows[0]?.status || null, images: imgResult.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await pool.query('SELECT host_id FROM events WHERE id = $1', [id]);
    if (!ev.rows.length)               return res.status(404).json({ message: 'Event not found' });
    if (ev.rows[0].host_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, description, location, latitude, longitude, start_date, end_date, visibility, category, cover_image } = req.body;
    const result = await pool.query(
      `UPDATE events SET title=$1, description=$2, location=$3, latitude=$4, longitude=$5,
       start_date=$6, end_date=$7, visibility=$8, category=$9, cover_image=$10
       WHERE id=$11 RETURNING *`,
      [title, description, location, latitude, longitude, start_date, end_date, visibility, category, cover_image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await pool.query('SELECT host_id FROM events WHERE id = $1', [id]);
    if (!ev.rows.length)               return res.status(404).json({ message: 'Event not found' });
    if (ev.rows[0].host_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await pool.query('UPDATE events SET in_trash = TRUE WHERE id = $1', [id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
