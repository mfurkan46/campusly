const express = require('express');
const { getTrendingHashtags, getPostsByHashtag } = require('../controllers/exploreController');

const router = express.Router();

router.get('/trending', getTrendingHashtags); // /api/explore/trending
router.get('/hashtag/:hashtag', getPostsByHashtag); // /api/explore/hashtag/xx

module.exports = router;