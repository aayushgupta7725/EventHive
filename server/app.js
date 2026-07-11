const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
dotenv.config();

const authRoutes    = require('./routes/authRoutes');
const eventRoutes   = require('./routes/eventRoutes');
const rsvpRoutes    = require('./routes/rsvpRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const aiRoutes      = require('./routes/aiRoutes');

const app = express();

app.use((req, res, next) => {
  console.log('>>> Incoming:', req.method, req.url);
  next();
});
// ── Middleware ────────────────────────────────────────
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:5173';
app.use(cors({ 
  origin: [clientUrl, 'https://eventhive-sage.vercel.app'], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'EventHive API', version: '1.0.0' }));

// ── Routes ────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', rsvpRoutes);
app.use('/api', galleryRoutes);
app.use('/api/ai', aiRoutes);

// ── 404 handler ───────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;


app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => console.log(`\x1b[32m✔ EventHive API running on http://localhost:${PORT}\x1b[0m`));

module.exports = app;
