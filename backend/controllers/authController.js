const authService = require('../services/authService');

const register = async (req, res) => {
  const { email, username, password, studentId } = req.body;
  try {
    const user = await authService.register(email, username, password, studentId);
    const {token } = await authService.login(email, password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 1000, 
    });
    res.status(201).json({
      message: 'Kayıt başarılı ve giriş yapıldı',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.login(email, password);
    
    
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 1000, 
    });

    res.json({
      message: 'Giriş başarılı',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id); 
    res.json(user);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : 500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Kullanıcı bulunamadı' ? 404 : error.message === 'Mevcut şifre yanlış' ? 401 : 500).json({ error: error.message });
  }
};

module.exports = { register, login, getMe, changePassword };