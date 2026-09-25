import { Link, Outlet } from 'react-router-dom';
import Navbar, { MobileBottomNav } from './Navbar';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const Layout = () => (
  <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
    <Navbar />
    <main className="page-enter mx-auto max-w-7xl px-4 py-7 pb-24 sm:px-6 lg:px-10 lg:py-10 lg:pb-10">
      <Outlet />
    </main>
    <MobileBottomNav />
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium-900 text-lg font-black text-white">M</div>
            <span className="font-display text-lg font-black tracking-tight">KANHAIYA MOBILE</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">Premium new and certified second-hand smartphones, selected with care in Bhilai.</p>
          <div className="mt-5 flex gap-3">
            <a href="https://www.instagram.com/kanhaiya__mobile_bhilai/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-slate-200 p-2.5 text-slate-500 hover:border-premium-accent hover:text-premium-accent"><FaInstagram size={17} /></a>
            <a href="https://www.youtube.com/@kanhaiyamobile" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-slate-200 p-2.5 text-slate-500 hover:border-premium-accent hover:text-premium-accent"><FaYoutube size={17} /></a>
          </div>
        </div>
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Shop</p><div className="mt-4 space-y-3 text-sm text-slate-600"><Link className="block hover:text-premium-accent" to="/products/new">New Phones</Link><Link className="block hover:text-premium-accent" to="/products/used">Second Hand</Link></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Support</p><div className="mt-4 space-y-3 text-sm text-slate-600"><Link className="block hover:text-premium-accent" to="/store">Our Store</Link><span className="block">Shipping & returns</span><span className="block">Warranty information</span></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Visit</p><p className="mt-4 text-sm leading-6 text-slate-600">Beside India Coffee House<br />Shop No 101, Supela<br />Bhilai, Chhattisgarh</p></div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} Kanhaiya Mobile. All rights reserved.</div>
    </footer>
  </div>
);

export default Layout;
