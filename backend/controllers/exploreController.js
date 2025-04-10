const exploreService = require('../services/exploreService');

const getTrendingHashtags = async (req, res) => {
  try {
    const trends = await exploreService.getTrendingHashtags();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostsByHashtag = async (req, res) => {
  const { hashtag } = req.params;
  try {
    const posts = await exploreService.getPostsByHashtag(hashtag);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTrendingHashtags, getPostsByHashtag };