const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getWeeklyMenus = async () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); 
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  const menus = await prisma.menu.findMany({
    where: {
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    orderBy: { date: 'asc' },
  });

  return menus.map(menu => ({
    date: menu.date.toISOString().split('T')[0].split('-').reverse().join('.'),
    mainDish: { name: menu.mainDishName, calories: menu.mainDishCalories },
    sideDish: { name: menu.sideDishName, calories: menu.sideDishCalories },
    starter: { name: menu.starterName, calories: menu.starterCalories },
    extra: { name: menu.extraName, calories: menu.extraCalories },
  }));
};

const getMenuByDate = async (dateStr) => {
  const [day, month, year] = dateStr.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  const menu = await prisma.menu.findFirst({
    where: {
      date: {
        gte: date,
        lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1),
      },
    },
  });

  if (!menu) return null;

  return {
    date: menu.date.toISOString().split('T')[0].split('-').reverse().join('.'),
    mainDish: { name: menu.mainDishName, calories: menu.mainDishCalories },
    sideDish: { name: menu.sideDishName, calories: menu.sideDishCalories },
    starter: { name: menu.starterName, calories: menu.starterCalories },
    extra: { name: menu.extraName, calories: menu.extraCalories },
  };
};

const getNextAvailableMenuDate = async (currentDateStr) => {
  const [day, month, year] = currentDateStr.split('.').map(Number);
  const currentDate = new Date(year, month - 1, day);
  currentDate.setHours(0, 0, 0, 0);

  const nextMenu = await prisma.menu.findFirst({
    where: {
      date: {
        gt: currentDate,
      },
    },
    orderBy: { date: 'asc' },
  });

  if (!nextMenu) return null;

  return nextMenu.date.toISOString().split('T')[0].split('-').reverse().join('.');
};

module.exports = { getWeeklyMenus, getMenuByDate, getNextAvailableMenuDate };