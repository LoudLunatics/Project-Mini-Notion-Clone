# Mini Notion Clone

Aplikasi pencatatan (note) berbasis web yang terinspirasi dari Notion, memungkinkan pengguna untuk membuat dan mengedit catatan menggunakan editor berbasis blok yang interaktif dan kolaboratif.

## ✨ Fitur Utama

-   **🔐 Autentikasi Aman**: Sistem registrasi dan login pengguna menggunakan JWT yang disimpan dalam *HTTP-Only Cookie*.
-   **📝 Editor Berbasis Blok**: Buat catatan dengan berbagai jenis blok konten.
    -   **Teks**: Paragraf dengan dukungan *rich text*.
    -   **Checklist**: Daftar tugas interaktif dengan *checkbox*.
    -   **Gambar**: Sisipkan gambar dari URL.
    -   **Kode**: Blok khusus untuk menampilkan cuplikan kode.
-   **✨ Drag & Drop**: Ubah urutan blok konten dengan mudah menggunakan *drag & drop*.
-   **💾 Autosave**: Semua perubahan pada catatan disimpan secara otomatis di latar belakang.
-   **👥 Kolaborasi Real-time (Bonus)**: Perubahan dari satu pengguna akan langsung terlihat oleh pengguna lain yang membuka catatan yang sama, berkat implementasi WebSocket.
-   **🕒 Riwayat Edit**: Lihat siapa yang terakhir mengedit catatan dan kapan.

## 🛠️ Teknologi yang Digunakan

-   **Frontend**:
    -   React (dengan Vite)
    -   Tailwind CSS
    -   React Hook Form (untuk semua formulir)
    -   Zustand (untuk *state management*)
    -   Tiptap (untuk *rich text editor*)
    -   Dnd-Kit (untuk *drag & drop*)
    -   Socket.io-client (untuk fitur *real-time*)
-   **Backend**:
    -   Node.js dengan Express.js / NestJS
    -   Prisma (atau ORM lain)
    -   PostgreSQL / MySQL
    -   Socket.io

## 🚀 Cara Menjalankan Proyek

### Prasyarat

-   Node.js (v18 atau lebih baru)
-   NPM atau Yarn
-   Server database (misalnya, PostgreSQL)

### 1. Backend

a. **Navigasi ke folder backend**:
   ```bash
   cd backend
   ```

b. **Install dependensi**:
   ```bash
   npm install
   ```

c. **Setup Environment Variables**:
   Buat file `.env` di dalam folder `backend` dan isi variabel yang dibutuhkan, seperti koneksi database dan rahasia JWT.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mini_notion"
   JWT_SECRET="rahasia-anda-yang-sangat-aman"
   COOKIE_SECRET="rahasia-cookie-yang-juga-aman"
   ```

d. **Jalankan Migrasi Database**:
   ```bash
   npx prisma migrate dev
   ```

e. **Jalankan server backend**:
   Server akan berjalan di `http://localhost:4000`.
   ```bash
   npm run dev
   ```

### 2. Frontend

a. **Buka terminal baru dan navigasi ke folder frontend**:
   ```bash
   cd frontend
   ```

b. **Install dependensi**:
   ```bash
   npm install
   ```

c. **Jalankan server frontend**:
   Aplikasi akan dapat diakses di `http://localhost:5173`.
   ```bash
   npm run dev
   ```

---

Setelah kedua server berjalan, buka `http://localhost:5173` di browser Anda untuk mulai menggunakan aplikasi.
