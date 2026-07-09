# Mini Notion Clone

## GitLab Repository (Private - Wajib)

Project ini dibuat dan dikelola di **GitLab** dengan repository **private**.  
Backend terdapat di folder `backend/` dan frontend di folder `frontend/`.

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js (v18 atau lebih baru)
- Database MySQL atau PostgreSQL yang sudah berjalan
- NPM atau Yarn

---

### 1. Backend

```bash
cd backend

npm install
Buat file .env di dalam folder backend:
envDATABASE_URL="mysql://root:password@localhost:3306/mini_notion"

JWT_SECRET="GANTI_DENGAN_KUNCI_RAHASIA_ANDA_YANG_SANGAT_PANJANG_DAN_AMAN"
COOKIE_SECRET="rahasia-cookie-yang-juga-sangat-aman"
Bash# Jalankan migrasi database
npx prisma migrate dev

# Jalankan server backend
npm run dev
Backend berjalan di http://localhost:5000

2. Frontend
Bashcd frontend

npm install

# Jalankan server frontend
npm run dev
Frontend berjalan di http://localhost:5173

Setelah kedua server berjalan, buka browser dan akses http://localhost:5173.
