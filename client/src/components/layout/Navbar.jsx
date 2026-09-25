import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingBag, Smartphone, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav = () => (
  <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
    <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
      <NavLink to="/products/new" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold ${isActive ? 'text-premium-accent' : 'text-slate-500'}`}>
        <Smartphone size={18} /> New Phones
      </NavLink>
      <NavLink to="/products/used" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold ${isActive ? 'text-premium-accent' : 'text-slate-500'}`}>
        <Smartphone size={18} /> Second Hand
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold ${isActive ? 'text-premium-accent' : 'text-slate-500'}`}>
        <User size={18} /> My Orders
      </NavLink>
      <NavLink to="/store" className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold ${isActive ? 'text-premium-accent' : 'text-slate-500'}`}>
        <Store size={18} /> Our Store
      </NavLink>
    </div>
  </div>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-5">
          <Link to="/products" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-premium-900 text-xs font-black tracking-[0.08em] text-white shadow-lg shadow-slate-900/10 sm:h-10 sm:w-10 sm:text-sm">
              KM
            </div>
            <span className="font-display text-sm font-black leading-tight tracking-tight text-premium-900 sm:text-lg">
              <span>Kanhaiya</span><span className="block sm:inline"> Mobile</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
            <NavLink to="/products/new" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              NEW PHONES
            </NavLink>
            <NavLink to="/products/used" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              SECOND HAND
            </NavLink>
            <NavLink to="/store" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              OUR STORE
            </NavLink>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <form onSubmit={submitSearch} className="hidden items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones"
                className="w-40 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
              />
            </form>
            <Link to="/wishlist" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-premium-accent sm:p-2.5" aria-label="Wishlist">
              <Heart size={19} />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-premium-accent sm:p-2.5" aria-label="Cart">
              <ShoppingBag size={19} />
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-premium-accent text-[10px] font-bold text-white">
                {count}
              </span>
            </Link>
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  to="/orders"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-slate-600 hover:border-premium-accent"
                >
                  <User size={18} />
                  <span className="text-sm font-bold">My Orders</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-full bg-premium-900 px-4 py-2 text-white hover:bg-premium-800"
                  >
                    <span className="text-sm font-bold">Admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm font-bold text-slate-400 hover:text-premium-900">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-2 text-slate-700 hover:border-premium-accent sm:gap-2 sm:px-3.5"
              >
                <User size={18} />
                <span className="text-xs font-bold sm:text-sm">Login</span>
              </Link>
            )}
            {isAuthenticated && (
              <button onClick={handleLogout} className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:border-premium-accent md:hidden">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
