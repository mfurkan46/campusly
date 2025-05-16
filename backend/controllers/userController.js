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

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, bio, faculty, department } = req.body;
  let profileImage = req.body.profileImage; 


  if (req.file) {
    profileImage = `/uploads/${req.file.filename}`; 
  }

  try {
    const updatedUser = await userService.updateUserProfile(userId, {
      username,
      bio,
      profileImage,
      faculty,
      department,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 400).json({ error: error.message });
  }
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await userService.getFollowers(parseInt(userId));
    res.json(followers);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 500).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;
  try {
    const following = await userService.getFollowing(parseInt(userId));
    res.json(following);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 500).json({ error: error.message });
  }
};

module.exports = { getUserByUsername, searchUsers, followUser, unfollowUser, updateUserProfile , getFollowers, getFollowing };