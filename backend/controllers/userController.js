const userService = require('../services/userService');

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await userService.getUserByUsername(username);
    res.json(user);
  } catch (error) {
    res.status(error.message === 'Böyle bir kullanıcı bulunamadı.' ? 404 : 500).json({ error: error.message });
  }
};

const searchUsers = async (req, res) => {
  const { query } = req.query;
  
  try {
    const users = await userService.searchUsers(query || '');
    
    res.json(users);
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};

const followUser = async (req, res) => {
  const currentUserId = req.user.id;
  const { targetUserId } = req.body;
  try {
    const result = await userService.followUser(currentUserId, parseInt(targetUserId));
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 400).json({ error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  const currentUserId = req.user.id;
  const { targetUserId } = req.body;
  try {
    const result = await userService.unfollowUser(currentUserId, parseInt(targetUserId));
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 400).json({ error: error.message });
  }
};

module.exports = { getUserByUsername, searchUsers, followUser, unfollowUser };