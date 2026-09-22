import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email');
    }
  };

  return (
    <div className="surface mx-auto max-w-md rounded-[28px] p-7 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Account recovery</p><h1 className="mt-2 text-3xl font-black">Forgot password?</h1>
      <p className="mb-6 mt-2 text-sm text-slate-500">Enter your email and we will send a reset link.</p>
      {message && <p className="text-green-700 mb-4 text-sm">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="email" required placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-premium-accent" />
        <button type="submit" className="w-full bg-premium-900 text-white py-3 rounded-xl font-semibold">Send reset link</button>
      </form>
      <Link to="/login" className="block mt-5 text-sm text-premium-accent font-semibold">Back to login</Link>
    </div>
  );
};

export default ForgotPassword;