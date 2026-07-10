const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/aiController');
const protect  = require('../middleware/authMiddleware');

router.post('/suggestions', protect, ctrl.getSuggestions);

module.exports = router;
