const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const { 
  createArtistRequest, 
  getAllRequests, 
  updateRequestStatus,
  getUserRequest 
} = require('../controllers/artistRequestController');

// Cấu hình multer để xử lý upload file
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// Routes
router.post('/', protect, upload.single('profileImage'), createArtistRequest);
router.get('/', protect, authorize('admin'), getAllRequests);
router.put('/:id', protect, authorize('admin'), updateRequestStatus);
router.get('/user', protect, getUserRequest);

module.exports = router; 