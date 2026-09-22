import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="surface mx-auto max-w-md rounded-[28px] p-7 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Join the store</p><h1 className="mt-2 text-3xl font-black">Create account</h1><p className="mt-2 text-sm text-slate-500">Save favourites, track orders, and checkout faster.</p>
      {error && <p className="mb-4 mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-premium-accent"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-premium-accent"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-premium-accent"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
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
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-premium-accent font-semibold">Login</Link>
      </p>
    </div>
  );
};

export default Register;
