const express = require('express');
const {
  createMessage,
  getConversation,
  getAllConversations,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createMessage);
router.get('/conversation/:otherUserId', authMiddleware, getConversation);
router.get('/', authMiddleware, getAllConversations);

module.exports = router;