const express = require('express');
const { getUserByUsername, searchUsers, followUser, unfollowUser, updateUserProfile, getFollowers, getFollowing } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

const router = express.Router();
router.get('/search', searchUsers);
router.get('/username/:username', getUserByUsername);
router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.patch('/profile', authMiddleware, upload.single('profileImage'), updateUserProfile);
router.get('/followers/:userId', authMiddleware, getFollowers);
router.get('/following/:userId', authMiddleware, getFollowing);

module.exports = router;