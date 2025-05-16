const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const menuRoutes = require('./routes/menuRoutes');
const messageService = require('./services/messageService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://campusly.up.railway.app', // React uygulama URL'si
    methods: ['GET', 'POST'], 
    credentials: true, 
  },
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dosyaların kaydedileceği klasör
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Dosya adı
  },
});

const upload = multer({ storage });


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://campusly.up.railway.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/menus', menuRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Merhaba Dünya!');
});

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Kullanıcı ${userId} odaya katıldı`);
  });
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;
    try {
      const message = await messageService.createMessage(senderId, receiverId, content);
      io.to(receiverId).emit('newMessage', message);
      io.to(senderId).emit('newMessage', message);
    } catch (error) {
      socket.emit('error', { message: 'Mesaj gönderilemedi' });
    }
  });
  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
