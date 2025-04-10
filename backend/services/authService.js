const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (email, username, password, studentId) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hash’le
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
    select: { id: true, username: true, email: true, studentId: true, createdAt: true },
  });
  if (!user) throw new Error('Kullanıcı bulunamadı');
  return user;
};

module.exports = { register, login,getMe };