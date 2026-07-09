import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axios.instance';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  /**
   * Mengirim data login ke server dan menangani respons.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await axiosInstance.post('/auth/login', data);
      login(response.data.user); 
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Login gagal:", error);
      setServerError(error.response?.data?.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk ke Mini Notion</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register("password", { required: "Password wajib diisi" })} 
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          {serverError && <span className="text-red-500 text-xs mt-1 text-center block">{serverError}</span>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Continue with Email'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
}