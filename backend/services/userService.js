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
      faculty: true,
    },
  });
  if (!user) throw new Error('Böyle bir kullanıcı bulunamadı.');
  return user;
};

const searchUsers = async (query) => {
  if (!query || query.trim().length < 2) return []; 
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { studentId: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      studentId: true,
      profileImage: true,
    },
    take: 10, 
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

const updateUserProfile = async (userId, data) => {
  const { username, bio, profileImage, faculty, department } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Kullanıcı bulunamadı');

  if (username && username !== user.username) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) throw new Error('Bu kullanıcı adı zaten kullanılıyor');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username: username !== undefined ? username : user.username,
      bio: bio !== undefined ? bio : user.bio,
      profileImage: profileImage !== undefined ? profileImage : user.profileImage,
      faculty: faculty !== undefined ? faculty : user.faculty,
      department: department !== undefined ? department : user.department,
    },
    select: {
      id: true,
      username: true,
      bio: true,
      profileImage: true,
      faculty: true,
      department: true,
      createdAt: true,
      followers: true,
      following: true,
    },
  });

  return updatedUser;
};

const getFollowers = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { followers: true },
    });

    if (!user) throw new Error('Kullanıcı bulunamadı');

    if (!user.followers || user.followers.length === 0) {
      return [];
    }


    const followers = await prisma.user.findMany({
      where: {
        id: { in: user.followers },
      },
      select: {
        id: true,
        username: true,
        studentId: true,
        profileImage: true,
      },
    });

    return followers;
  } catch (error) {
    throw error.message === 'Kullanıcı bulunamadı' ? error : new Error('Veritabanı hatası');
  }
};

const getFollowing = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true },
    });

    if (!user) throw new Error('Kullanıcı bulunamadı');


    if (!user.following || user.following.length === 0) {
      return [];
    }


    const following = await prisma.user.findMany({
      where: {
        id: { in: user.following },
      },
      select: {
        id: true,
        username: true,
        studentId: true,
        profileImage: true,
      },
    });

    return following;
  } catch (error) {
    throw error.message === 'Kullanıcı bulunamadı' ? error : new Error('Veritabanı hatası');
  }
};

module.exports = { getUserByUsername, searchUsers, followUser, unfollowUser, updateUserProfile , getFollowers, getFollowing };