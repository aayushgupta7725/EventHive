const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// POST /api/gallery/upload  (URL stored after Firebase upload on client)
exports.uploadImage = async (req, res) => {
  try {
    const { event_id, image_url, storage_path } = req.body;
    if (!event_id || !image_url) return res.status(400).json({ message: 'event_id and image_url required' });

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO gallery (id, event_id, image_url, storage_path, uploaded_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id, event_id, image_url, storage_path || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Gallery upload error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/gallery/:eventId
exports.getGallery = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*, u.name AS uploaded_by_name FROM gallery g
       JOIN users u ON g.uploaded_by = u.id WHERE g.event_id = $1 ORDER BY g.created_at ASC`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/gallery/:imageId
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const result = await pool.query('SELECT uploaded_by FROM gallery WHERE id = $1', [imageId]);
    if (!result.rows.length) return res.status(404).json({ message: 'Image not found' });
    if (result.rows[0].uploaded_by !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    await pool.query('DELETE FROM gallery WHERE id = $1', [imageId]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
