const express = require('express');
const { getWeeklyMenus, getMenuByDate, getNextAvailableMenuDate } = require('../controllers/menuController');

const router = express.Router();

router.get('/weekly', getWeeklyMenus);
router.get('/date/:date', getMenuByDate);
router.get('/next/:date', getNextAvailableMenuDate);

module.exports = router;