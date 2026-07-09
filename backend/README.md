# Mini Notion Clone - Backend

Ini adalah server backend untuk aplikasi Mini Notion Clone. Dibangun menggunakan Node.js, Express, dan Prisma, backend ini menyediakan RESTful API untuk otentikasi pengguna, manajemen catatan, serta kolaborasi real-time menggunakan WebSocket.

## ✨ Fitur Utama

- **API RESTful**: Endpoint yang jelas untuk operasi CRUD pada catatan dan blok.
- **Otentikasi Aman**: Menggunakan JWT (JSON Web Token) yang disimpan dalam HTTP-Only Cookie untuk keamanan.
- **Otorisasi**: Middleware memastikan setiap pengguna hanya dapat mengakses dan memodifikasi data miliknya sendiri.
- **Kolaborasi Real-time**: Implementasi Socket.IO untuk memungkinkan beberapa pengguna mengedit catatan yang sama secara bersamaan.
- **Histori & Autosave**: Mencatat waktu dan pengguna terakhir yang mengedit, serta menyediakan endpoint yang mendukung fitur autosave dari frontend.
- **Database Relasional**: Dikelola oleh Prisma dengan skema yang jelas untuk `User`, `Note`, dan `Block`.

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Real-time**: Socket.IO
- **Otentikasi**: JSON Web Token (JWT), bcrypt.js
- **Middleware**: `cors`, `cookie-parser`

---

## 🚀 Panduan Instalasi dan Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan server backend di lingkungan lokal Anda.

### 1. Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut:
- Node.js (v18 atau lebih baru direkomendasikan)
- NPM atau Yarn
- Server Database MySQL yang sedang berjalan

### 2. Instalasi

a. **Clone Repository**

```bash
git clone <URL_REPOSITORY_GITLAB_ANDA>
cd <NAMA_FOLDER_PROYEK>/backend
```

b. **Install Dependensi**

Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan.

```bash
npm install
```

### 3. Konfigurasi Lingkungan

a. **Buat file `.env`**

Buat file baru bernama `.env` di dalam direktori `backend/`.

b. **Isi Variabel Lingkungan**

Salin dan tempel konten berikut ke dalam file `.env` Anda, lalu sesuaikan nilainya.

```env
# URL Koneksi Database MySQL Anda
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/mini_notion"

# Kunci rahasia untuk menandatangani JWT. Ganti dengan string acak yang kuat.
JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN"
```

### 4. Migrasi Database

Prisma akan membaca file `schema.prisma` dan membuat tabel yang diperlukan di database Anda.

```bash
npx prisma migrate dev
```

### 5. Menjalankan Server

Gunakan perintah berikut untuk memulai server dalam mode pengembangan (development). Server akan otomatis restart jika ada perubahan pada file.

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`. Anda siap untuk menghubungkannya dengan aplikasi frontend!