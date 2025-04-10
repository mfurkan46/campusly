const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Çerezden token’ı al
  if (!token) return res.status(401).json({ error: 'Token gereklidir' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgilerini req’e ekle
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

module.exports = authMiddleware;