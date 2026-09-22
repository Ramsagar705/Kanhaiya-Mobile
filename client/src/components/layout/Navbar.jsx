import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between gap-5">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium-900 text-sm font-black tracking-[0.08em] text-white shadow-lg shadow-slate-900/10">
              KM
            </div>
            <span className="hidden font-display text-lg font-black tracking-tight text-premium-900 sm:block">Kanhaiya Mobile</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
            <NavLink to="/products/new" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              NEW PHONES
            </NavLink>
            <NavLink to="/products/used" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              SECOND HAND
            </NavLink>
            <NavLink to="/deals" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              BEST DEALS
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `transition-colors hover:text-premium-accent ${isActive ? 'text-premium-accent' : ''}`}>
              CONTACT
            </NavLink>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <form onSubmit={submitSearch} className="hidden items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones"
                className="w-40 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
              />
            </form>
            <Link to="/wishlist" className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-premium-accent" aria-label="Wishlist">
              <Heart size={19} />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-premium-accent" aria-label="Cart">
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
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 hover:border-premium-accent md:flex"
              >
                <User size={18} />
                <span className="text-sm font-bold">Account</span>
              </Link>
            )}
            <button className="rounded-full p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="space-y-3 border-t border-slate-100 pb-5 pt-4 md:hidden">
            <form onSubmit={submitSearch} className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search size={18} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones"
                className="w-full bg-transparent px-2 text-sm outline-none"
              />
            </form>
            <Link to="/products/new" onClick={() => setOpen(false)} className="block py-1 font-bold">
              New Phones
            </Link>
            <Link to="/products/used" onClick={() => setOpen(false)} className="block py-1 font-bold">
              Second Hand
            </Link>
            <Link to="/deals" onClick={() => setOpen(false)} className="block py-1 font-bold">
              Best Deals
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="block py-1 font-bold">
              Contact Us
            </Link>
            <Link to="/orders" onClick={() => setOpen(false)} className="block py-1 font-bold">
              My Orders
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block py-1 font-bold">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block py-1 text-left font-bold">
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="block py-1 font-bold">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
