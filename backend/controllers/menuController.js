const menuService = require('../services/menuService');

const getWeeklyMenus = async (req, res) => {
  try {
    const menus = await menuService.getWeeklyMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const menu = await menuService.getMenuByDate(date);
    if (!menu) {
      return res.status(404).json({ error: 'Menü bulunamadı' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNextAvailableMenuDate = async (req, res) => {
  const { date } = req.params;
  try {
    const nextDate = await menuService.getNextAvailableMenuDate(date);
    if (!nextDate) {
      return res.status(404).json({ error: 'Sonraki menü bulunamadı' });
    }
    res.json({ nextDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getWeeklyMenus, getMenuByDate, getNextAvailableMenuDate };