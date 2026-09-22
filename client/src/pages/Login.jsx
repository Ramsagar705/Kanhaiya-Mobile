import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@mobishop.com', password: 'admin123' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const finishLogin = (user) => navigate(user?.role === 'admin' ? '/admin' : (location.state?.from || '/'));

  const onGoogleSuccess = async ({ credential }) => {
    setError('');
    try {
      finishLogin(await loginWithGoogle(credential));
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      finishLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="surface mx-auto max-w-md rounded-[28px] p-7 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Your account</p><h1 className="mt-2 text-3xl font-black">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to continue shopping smarter.</p>
      {error && <p className="mb-4 mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-premium-accent"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-premium-accent"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="w-full bg-premium-900 text-white py-3 rounded-xl font-semibold">
          Login
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" /> OR <span className="h-px flex-1 bg-gray-200" />
      </div>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <div className="flex justify-center"><GoogleLogin onSuccess={onGoogleSuccess} onError={() => setError('Google login failed')} /></div>
      ) : (
        <p className="text-xs text-gray-400 text-center">Google login needs VITE_GOOGLE_CLIENT_ID configured.</p>
      )}
      <Link to="/forgot-password" className="mt-5 block text-center text-sm font-bold text-premium-accent">
        Forgot your password?
      </Link>
      <p className="mt-4 text-sm text-gray-500">
        New here? <Link to="/register" className="text-premium-accent font-semibold">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
