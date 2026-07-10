const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/rsvpController');
const protect = require('../middleware/authMiddleware');

router.post('/events/:id/rsvp',   protect, ctrl.submitRsvp);
router.get('/events/:id/guests',  protect, ctrl.getGuests);

module.exports = router;
