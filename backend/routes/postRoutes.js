const express = require('express');
const {
  createPost,
  getPostsByUserId,
  getPostById,
  toggleStarPost,
  toggleBookmarkPost,
  getAllPosts,
  getBookmarkedPosts,
  incrementPostView,
  getPostsByAlgorithm,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/algorithm', authMiddleware, getPostsByAlgorithm);
router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUserId);
router.get('/:postId', getPostById);
router.post('/:postId/star', authMiddleware, toggleStarPost);
router.post('/:postId/bookmark', authMiddleware, toggleBookmarkPost);
router.get('/bookmarked/:userId', getBookmarkedPosts);
router.post('/:postId/view', incrementPostView);

module.exports = router;