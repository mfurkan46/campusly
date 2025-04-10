const messageService = require('../services/messageService');

const createMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  try {
    const message = await messageService.createMessage(senderId, parseInt(receiverId), content);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getConversation = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await messageService.getConversation(userId, parseInt(otherUserId));
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await messageService.getAllConversations(userId);
    res.json(conversations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  getConversation,
  getAllConversations,
};