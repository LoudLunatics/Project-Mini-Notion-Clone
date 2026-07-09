import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.instance';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  /**
   * Mengirim data registrasi ke server dan menangani respons.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await axiosInstance.post('/auth/register', data);
      // Setelah berhasil register, arahkan ke halaman login untuk masuk
      navigate('/login');
    } catch (error) {
      console.error("Registrasi gagal:", error);
      setServerError(error.response?.data?.message || "Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Buat Akun Baru</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input 
              type="text" 
              placeholder="Full Name" 
              {...register("name", { required: "Nama wajib diisi" })} 
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
          </div>

          <div>
            <Input 
              type="email" 
              placeholder="Email address" 
              {...register("email", { required: "Email wajib diisi" })} 
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <Input 
              type="password" 
              placeholder="Password" 
              {...register("password", { required: "Password wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })} 
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          {serverError && <span className="text-red-500 text-xs mt-1 text-center block">{serverError}</span>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Mendaftarkan...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Masuk di sini</a>
        </p>
      </div>
    </div>
  );
}