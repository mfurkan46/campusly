const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const messageService = require('./services/messageService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://campusly-pi.vercel.app', // React uygulama URL'si
    methods: ['GET', 'POST'], 
    credentials: true, 
  },
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:3000',
  'https://campusly-pi.vercel.app' 
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

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
