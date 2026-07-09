import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

/**
 * Mendaftarkan user baru.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// REGISTRASI USER BARU
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    // Cek apakah email sudah ada di database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar. Silakan login." });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Registrasi berhasil.", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server saat registrasi." });
  }
};

/**
 * Melakukan login user dan mengirimkan JWT via HTTP-Only cookie.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Akun tidak ditemukan." });
    }

    // Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = generateToken(user.id, user.email);

    // Kirim token ke dalam HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Hanya true jika di hosting
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
    });

    res.status(200).json({ 
      message: "Login berhasil.", 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat login." });
  }
};

/**
 * Melakukan logout user dengan membersihkan cookie token.
 * @param {import('express').Request} req - Object request Express.
 * @param {import('express').Response} res - Object response Express.
 */
// LOGOUT USER
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout berhasil." });
};