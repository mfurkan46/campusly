const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      studentId: true,
      bio: true,
      profileImage: true,
      createdAt: true,
      followers: true,
      following: true,
    },
  });
  if (!user) throw new Error('Böyle bir kullanıcı bulunamadı.');
  return user;
};

const searchUsers = async (query) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      username: true,
      profileImage: true,
    },
  });
  return users; 
};

const followUser = async (currentUserId, targetUserId) => {
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  
  if (!currentUser || !targetUser) throw new Error('Kullanıcı bulunamadı');
  if (currentUserId === targetUserId) throw new Error('Kendinizi takip edemezsiniz');
  if (currentUser.following.includes(targetUserId)) throw new Error('Zaten takip ediyorsunuz');
  
  await prisma.user.update({
    where: { id: currentUserId },
    data: { following: { push: targetUserId } },
  });
  
  await prisma.user.update({
    where: { id: targetUserId },
    data: { followers: { push: currentUserId } },
  });
  
  return { message: 'Kullanıcı takip edildi' };
};

const unfollowUser = async (currentUserId, targetUserId) => {
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  
  if (!currentUser || !targetUser) throw new Error('Kullanıcı bulunamadı');
  if (currentUserId === targetUserId) throw new Error('Kendinizi takipten çıkaramazsınız');
  if (!currentUser.following.includes(targetUserId)) throw new Error('Bu kullanıcıyı takip etmiyorsunuz');
  
  await prisma.user.update({
    where: { id: currentUserId },
    data: { following: { set: currentUser.following.filter((id) => id !== targetUserId) } },
  });
  
  await prisma.user.update({
    where: { id: targetUserId },
    data: { followers: { set: targetUser.followers.filter((id) => id !== currentUserId) } },
  });
  
  return { message: 'Takip bırakıldı' };
};

module.exports = { getUserByUsername, searchUsers, followUser, unfollowUser };