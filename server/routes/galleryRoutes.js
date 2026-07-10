const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/galleryController');
const protect = require('../middleware/authMiddleware');

router.post('/gallery/upload',       protect, ctrl.uploadImage);
router.get('/gallery/:eventId',      protect, ctrl.getGallery);
router.delete('/gallery/:imageId',   protect, ctrl.deleteImage);

module.exports = router;
