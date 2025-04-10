const express = require('express');
const { createPost, getPostsByUserId, getPostById, toggleStarPost, toggleBookmarkPost,getAllPosts,} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get("/", getAllPosts);
router.get('/user/:userId', getPostsByUserId);
router.get('/:postId', getPostById);
router.post('/:postId/star', authMiddleware, toggleStarPost);
router.post('/:postId/bookmark', authMiddleware, toggleBookmarkPost);


module.exports = router;