import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import semua Routes
import authRoutes from './src/routes/authRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';
import blockRoutes from './src/routes/blockRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

// Konfigurasi Middleware
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
})); 
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/blocks', blockRoutes);

// Endpoint tes
app.get('/api/ping', (req, res) => {
  res.json({ message: "Server Backend Express Menyala Sempurna!" });
});

// ================== LOGIKA WEBSOCKET ==================
io.on('connection', (socket) => {
  console.log('Seorang user terhubung:', socket.id);

  /**
   * Event 'join-note': Klien bergabung ke sebuah "room" spesifik berdasarkan noteId.
   * Ini memastikan pembaruan hanya dikirim ke klien yang membuka catatan yang sama.
   */
  socket.on('join-note', (noteId) => {
    socket.join(noteId);
    console.log(`User ${socket.id} bergabung ke room note ${noteId}`);
  });

  /**
   * Event 'send-changes': Menerima perubahan dari satu klien
   * dan menyiarkannya ke semua klien lain di room yang sama.
   */
  socket.on('send-changes', (data) => {
    socket.to(data.noteId).emit('receive-changes', data.blocks);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});