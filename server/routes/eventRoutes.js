const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');

router.post('/',        protect, ctrl.createEvent);
router.get('/',         protect, ctrl.getEvents);
router.get('/:id',      protect, ctrl.getEventById);
router.put('/:id',      protect, ctrl.updateEvent);
router.delete('/:id',   protect, ctrl.deleteEvent);

module.exports = router;
