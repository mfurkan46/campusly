const express = require('express');
const { getTrendingHashtags, getPostsByHashtag } = require('../controllers/exploreController');

const router = express.Router();

router.get('/trending', getTrendingHashtags); 
router.get('/hashtag/:hashtag', getPostsByHashtag); 

module.exports = router;