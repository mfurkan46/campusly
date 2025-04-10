const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMessage = async (senderId, receiverId, content) => {
  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
    include: {
      sender: { select: { id: true, username: true, profileImage: true } },
      receiver: { select: { id: true, username: true } },
    },
  });
  return message;
};

const getConversation = async (userId, otherUserId) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: { select: { id: true, username: true, profileImage: true } },
      receiver: { select: { id: true, username: true } },
    },
  });
  return messages;
};

const getAllConversations = async (userId) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { id: true, username: true, profileImage: true } },
      receiver: { select: { id: true, username: true, profileImage: true } },
    },
  });

  const conversations = [];
  const seen = new Set();
  for (const msg of messages) {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!seen.has(otherUserId)) {
      seen.add(otherUserId);
      conversations.push({
        otherUser: msg.senderId === userId ? msg.receiver : msg.sender,
        lastMessage: msg.content,
        timestamp: msg.createdAt,
      });
    }
  }
  return conversations;
};

module.exports = {
  createMessage,
  getConversation,
  getAllConversations,
};