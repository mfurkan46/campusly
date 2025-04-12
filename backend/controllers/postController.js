const postService = require('../services/postService');

const createPost = async (req, res) => {
  const { content, image, targetPostId, hashtags } = req.body;
  const userId = req.user.id;

  try {
    const post = await postService.createPost(userId, content, image, targetPostId, hashtags);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await postService.getPostsByUserId(parseInt(userId));
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostById(parseInt(postId));
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleStarPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const updatedPost = await postService.toggleStarPost(userId, parseInt(postId));
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleBookmarkPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const updatedPost = await postService.toggleBookmarkPost(userId, parseInt(postId));
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
  toggleStarPost,
  toggleBookmarkPost,
  getAllPosts,
};