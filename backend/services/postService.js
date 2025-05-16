const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (userId, content, image, targetPostId, hashtags) => {
  if (!userId || !content) throw new Error('Kullanıcı ID veya içerik eksik');

  const data = {
    content,
    userId: parseInt(userId),
    image,
    hashtags: hashtags || [],
  };

  if (targetPostId) {
    const parsedTargetPostId = parseInt(targetPostId);
    if (isNaN(parsedTargetPostId)) throw new Error(`Geçersiz hedef Post ID: ${targetPostId}`);
    const targetPost = await prisma.post.findUnique({ where: { id: parsedTargetPostId } });
    if (!targetPost) throw new Error('Hedef post bulunamadı');
    data.targetPostId = parsedTargetPostId;
  }

  const post = await prisma.post.create({
    data,
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
  });

  return post;
};

const getPostsByUserId = async (userId) => {
  if (!userId) throw new Error('Kullanıcı ID eksik');
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) throw new Error(`Geçersiz Kullanıcı ID: ${userId}`);

  return prisma.post.findMany({
    where: { userId: parsedUserId, targetPostId: null },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getPostById = async (postId) => {
  if (!postId) throw new Error('Post ID eksik');
  const parsedPostId = parseInt(postId);
  if (isNaN(parsedPostId)) throw new Error(`Geçersiz Post ID: ${postId}`);

  const post = await prisma.post.findUnique({
    where: { id: parsedPostId },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
  });

  if (!post) throw new Error(`Post bulunamadı: ID=${parsedPostId}`);
  return post;
};

const toggleStarPost = async (userId, postId) => {
  if (!userId || !postId) throw new Error('Kullanıcı ID veya Post ID eksik');
  const parsedPostId = parseInt(postId);
  if (isNaN(parsedPostId)) throw new Error(`Geçersiz Post ID: ${postId}`);

  const post = await prisma.post.findUnique({ where: { id: parsedPostId } });
  if (!post) throw new Error(`Post bulunamadı: ID=${parsedPostId}`);

  const isStarred = post.stars.includes(userId);
  const updatedStars = isStarred
    ? post.stars.filter((id) => id !== userId)
    : [...post.stars, userId];

  return prisma.post.update({
    where: { id: parsedPostId },
    data: { stars: updatedStars },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
  });
};

const toggleBookmarkPost = async (userId, postId) => {
  if (!userId || !postId) throw new Error('Kullanıcı ID veya Post ID eksik');
  const parsedPostId = parseInt(postId);
  if (isNaN(parsedPostId)) throw new Error(`Geçersiz Post ID: ${postId}`);

  const post = await prisma.post.findUnique({ where: { id: parsedPostId } });
  if (!post) throw new Error(`Post bulunamadı: ID=${parsedPostId}`);

  const isBookmarked = post.bookmarks.includes(userId);
  const updatedBookmarks = isBookmarked
    ? post.bookmarks.filter((id) => id !== userId)
    : [...post.bookmarks, userId];

  return prisma.post.update({
    where: { id: parsedPostId },
    data: { bookmarks: updatedBookmarks },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
  });
};

const getAllPosts = async () => {
  return prisma.post.findMany({
    where: { targetPostId: null },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getBookmarkedPosts = async (userId) => {
  if (!userId) throw new Error('Kullanıcı ID eksik');
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) throw new Error(`Geçersiz Kullanıcı ID: ${userId}`);

  return prisma.post.findMany({
    where: { bookmarks: { has: parsedUserId }, targetPostId: null },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const incrementPostView = async (postId) => {
  if (!postId) throw new Error('Post ID eksik');
  const parsedPostId = parseInt(postId);
  if (isNaN(parsedPostId)) throw new Error(`Geçersiz Post ID: ${postId}`);

  const post = await prisma.post.findUnique({ where: { id: parsedPostId } });
  if (!post) throw new Error(`Post bulunamadı: ID=${parsedPostId}`);

  return prisma.post.update({
    where: { id: parsedPostId },
    data: { views: { increment: 1 } },
    include: {
      user: {
        select: { id: true, username: true, studentId: true, profileImage: true },
      },
      comments: { include: { user: true, comments: true } },
    },
  });
};

const getPostsByAlgorithm = async (userId, skip = 0, take = 5) => {
  if (!userId) throw new Error('Kullanıcı ID eksik');
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) throw new Error(`Geçersiz Kullanıcı ID: ${userId}`);

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsedUserId },
      select: { id: true, following: true, faculty: true, department: true, followers: true },
    });

    if (!user) throw new Error(`Kullanıcı bulunamadı: ID=${parsedUserId}`);

    const totalPosts = await prisma.post.count({
      where: { targetPostId: null },
    });

    const posts = await prisma.post.findMany({
      where: { targetPostId: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            studentId: true,
            profileImage: true,
            faculty: true,
            department: true,
            followers: true,
          },
        },
        comments: { include: { user: true } },
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: { createdAt: 'desc' },
    });



    const sortedPosts = posts.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;


      if (user.following && user.following.includes(a.userId)) scoreA += 1000;
      if (user.following && user.following.includes(b.userId)) scoreB += 1000;


      const commonFollowersA =
        user.following?.filter((followId) => a.user.followers?.includes(followId))?.length || 0;
      const commonFollowersB =
        user.following?.filter((followId) => b.user.followers?.includes(followId))?.length || 0;
      scoreA += commonFollowersA * 100;
      scoreB += commonFollowersB * 100;


      if (user.faculty && a.user.faculty === user.faculty) scoreA += 300;
      if (user.faculty && b.user.faculty === user.faculty) scoreB += 300;
      if (user.department && a.user.department === user.department) scoreA += 500;
      if (user.department && b.user.department === user.department) scoreB += 500;


      const hoursSincePostA = (new Date() - new Date(a.createdAt)) / (1000 * 60 * 60);
      const hoursSincePostB = (new Date() - new Date(b.createdAt)) / (1000 * 60 * 60);
      const timeScoreA = Math.exp(-hoursSincePostA / 48) * 500;
      const timeScoreB = Math.exp(-hoursSincePostB / 48) * 500;

      // 5. Etkileşim faktörü
      const interactionScoreA =
        (a.stars?.length || 0) * 20 + 
        (a.comments?.length || 0) * 30 + 
        (a.views || 0) * 5; 
      const interactionScoreB =
        (b.stars?.length || 0) * 20 +
        (b.comments?.length || 0) * 30 +
        (b.views || 0) * 5;

     
      scoreA += timeScoreA + interactionScoreA;
      scoreB += timeScoreB + interactionScoreB;

      
      const maxScore = Math.max(scoreA, scoreB, 1);
      scoreA = (scoreA / maxScore) * 1000;
      scoreB = (scoreB / maxScore) * 1000;

      return scoreB - scoreA; 
    });

    return { posts: sortedPosts, totalPosts };
  } catch (error) {
    console.error('getPostsByAlgorithm hatası:', error.message);
    throw new Error(`Postlar alınamadı: ${error.message}`);
  }
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
  toggleStarPost,
  toggleBookmarkPost,
  getAllPosts,
  getBookmarkedPosts,
  incrementPostView,
  getPostsByAlgorithm,
};