const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong,
    toggleLike,
    addComment,
    getTrendingSongs,
} = require('../controllers/songController');

// Public routes
router.get('/', getAllSongs);
router.get('/trending', getTrendingSongs);
router.get('/:id', getSong);

// Protected routes
router.use(protect);

// Like and comment routes
router.post('/:id/like', toggleLike);
router.post('/:id/comments', addComment);

// Artist and admin routes
router.post('/', authorize('artist', 'admin'), createSong);
router.put('/:id', authorize('artist', 'admin'), updateSong);
router.delete('/:id', authorize('artist', 'admin'), deleteSong);

module.exports = router;
