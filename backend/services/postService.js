const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (userId, content, image, targetPostId, hashtags) => {
  console.log(`createPost Service - Parametreler: userId=${userId}, content=${content}, hashtags=${JSON.stringify(hashtags)}`);
  const data = {
    content,
    userId,
    image,
    hashtags: hashtags || [], 
  };

  if (targetPostId) {
    const targetPost = await prisma.post.findUnique({ where: { id: targetPostId } });
    if (!targetPost) throw new Error('Hedef post bulunamadı');
    data.targetPostId = targetPostId;
  }

  const post = await prisma.post.create({
    data,
    include: { user: true, comments: true },
  });

  return post;
};

const getPostsByUserId = async (userId) => {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      targetPostId: null,
    },
    include: {
      user: true,
      comments: {
        include: { user: true, comments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return posts;
};

const getPostById = async (postId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
      comments: {
        include: { user: true, comments: true },
      },
    },
  });

  if (!post) throw new Error('Post bulunamadı');

  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });

  return post;
};

const toggleStarPost = async (userId, postId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post bulunamadı');

  const isStarred = post.stars.includes(userId);
  const updatedStars = isStarred
    ? post.stars.filter((id) => id !== userId)
    : [...post.stars, userId];

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { stars: updatedStars },
    include: { user: true, comments: true },
  });

  return updatedPost;
};

const toggleBookmarkPost = async (userId, postId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post bulunamadı');

  const isBookmarked = post.bookmarks.includes(userId);
  const updatedBookmarks = isBookmarked
    ? post.bookmarks.filter((id) => id !== userId)
    : [...post.bookmarks, userId];

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { bookmarks: updatedBookmarks },
    include: { user: true, comments: true },
  });

  return updatedPost;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    where: { targetPostId: null },
    include: {
      user: true,
      comments: {
        include: { user: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return posts;
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
  toggleStarPost,
  toggleBookmarkPost,
  getAllPosts,
};