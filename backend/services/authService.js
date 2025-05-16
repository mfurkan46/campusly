const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (email, username, password, studentId) => {
  const hashedPassword = await bcrypt.hash(password, 10); 
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      studentId,
    },
  });
  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Kullanıcı bulunamadı');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Geçersiz şifre');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, studentId: true, createdAt: true, bio: true, profileImage: true, followers: true, following: true, faculty: true },
  });
  if (!user) throw new Error('Kullanıcı bulunamadı');
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new Error('Mevcut şifre yanlış');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword === user.password) throw new Error('Yeni şifre mevcut şifre ile aynı olamaz');
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Şifre başarıyla değiştirildi' };
  } catch (error) {
    throw error;
  }
};

module.exports = { register, login, getMe, changePassword };