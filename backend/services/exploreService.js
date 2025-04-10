const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTrendingHashtags = async (limit = 10) => {
  // Tüm postları al ve hashtag’leri say
  const posts = await prisma.post.findMany({
    where: { targetPostId: null },
    select: { hashtags: true },
  });

  // Hashtag’leri birleştirip say
  const hashtagCount = posts
    .flatMap((post) => post.hashtags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  // En çok kullanılanları sırala
  const trending = Object.entries(hashtagCount)
    .map(([name, postCount]) => ({ name: `#${name}`, postCount }))
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, limit);

  return trending;
};

const getPostsByHashtag = async (hashtag, limit = 10) => {
  const posts = await prisma.post.findMany({
    where: {
      hashtags: { has: hashtag }, // Dizi içinde belirli hashtag’i ara
      targetPostId: null,
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { username: true, profileImage: true, studentId: true } },
      comments: {
        include: { user: true },
      },
    },
  });
  return posts;
};

module.exports = { getTrendingHashtags, getPostsByHashtag };