const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadsongs } = require('../controllers/songController');

const { getallsongs } = require('../controllers/songController');
const { likeOrUnlikeSong } = require('../controllers/songController');

const { getLikedSongs } = require('../controllers/songController');




router.post('/uploads', authMiddleware,upload.single('song'),uploadsongs);
router.get('/', getallsongs);
router.put('/:id/like',authMiddleware, likeOrUnlikeSong);
router.get('/liked', authMiddleware, getLikedSongs);

module.exports = router;
    