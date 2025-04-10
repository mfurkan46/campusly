const express = require('express');
const { getUserByUsername, searchUsers, followUser, unfollowUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/search', searchUsers);
router.get('/username/:username', getUserByUsername);
router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);

module.exports = router;