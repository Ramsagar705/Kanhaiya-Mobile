import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      await login(data.user.email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="surface mx-auto max-w-md rounded-[28px] p-7 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Account recovery</p><h1 className="mt-2 text-3xl font-black">Set a new password</h1>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} required minLength={6} placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-premium-accent" />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide new password' : 'Show new password'} title={showPassword ? 'Hide new password' : 'Show new password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input type={showConfirmPassword ? 'text' : 'password'} required minLength={6} placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-premium-accent" />
          <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'} title={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="w-full bg-premium-900 text-white py-3 rounded-xl font-semibold">Reset password</button>
      </form>
    </div>
  );
};

export default ResetPassword;