import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi token JWT dari cookie.
 * Jika valid, data pengguna akan ditambahkan ke `req.user`.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 * @param {import('express').NextFunction} next - Fungsi next middleware.
 */
export const verifyToken = (req, res, next) => {
  // Mengambil token dari HTTP-Only Cookie yang dikirim oleh frontend
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Silakan login terlebih dahulu." });
  }

  try {
    // Memverifikasi apakah token tersebut sah dan dibuat oleh rahasia kita
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Menyisipkan data user (seperti id dan email) ke dalam request
    // agar bisa dipakai oleh Controller untuk mengecek kepemilikan data
    req.user = decoded; 
    
    // Jika aman, persilakan masuk ke Controller
    next();
  } catch (error) {
    return res.status(403).json({ message: "Sesi Anda telah kedaluwarsa atau token tidak valid." });
  }
};