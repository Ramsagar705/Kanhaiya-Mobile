import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setError('Could not load products. Is the backend running?'));
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);

  const heroProduct = featured[0] || products[0];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[28px] bg-[#10182e] px-6 py-12 text-white shadow-2xl shadow-slate-900/10 sm:px-10 md:px-16 md:py-16">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-200"><span className="h-1.5 w-1.5 rounded-full bg-indigo-300" /> New & certified used</p>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Find the perfect phone.<br /><span className="text-indigo-300">Without the guesswork.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Shop flagship smartphones and professionally inspected second-hand devices with transparent condition grades.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products/new" className="rounded-full bg-white px-5 py-3 text-sm font-black text-premium-900 hover:bg-indigo-100">Shop new phones <ArrowRight className="ml-2 inline" size={16} /></Link>
              <Link to="/products/used" className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Explore second hand</Link>
            </div>
          </div>
          <div className="relative flex min-h-72 items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-indigo-400/15 blur-2xl" />
            {heroProduct ? <img src={heroProduct.images?.[0]} alt={heroProduct.title} className="relative z-10 h-64 w-full object-contain drop-shadow-2xl sm:h-80" /> : <div className="relative z-10 text-center text-slate-400">Your next phone<br />starts here.</div>}
            <div className="absolute right-0 top-4 z-20 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md"><p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Curated pick</p><p className="mt-1 text-sm font-bold">{heroProduct?.title || 'Premium devices'}</p></div>
            {heroProduct && <div className="absolute bottom-2 left-2 z-20 rounded-2xl bg-white p-3 text-slate-900 shadow-xl"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">From</p><p className="text-lg font-black">₹{Number(heroProduct.price).toLocaleString()}</p></div>}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[[BadgeCheck, 'Genuine products', '100% verified devices'], [ShieldCheck, 'Warranty support', 'On selected phones'], [Truck, 'Fast delivery', 'Quick & secure shipping'], [RotateCcw, 'Easy returns', 'Simple return process']].map(([Icon, title, text]) => <div key={title} className="surface flex items-center gap-4 rounded-2xl p-5"><Icon className="text-premium-accent" size={24} /><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div></div>)}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Browse your way</p><h2 className="mt-2 text-3xl font-black">Shop by category</h2></div><Link to="/products" className="hidden items-center gap-1 text-sm font-bold text-premium-accent sm:flex">View all <ArrowRight size={16} /></Link></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['New Phones', 'Latest flagships and everyday favourites.', '/products/new', 'bg-[#e9edff]'],
            ['Certified Second Hand', 'More value, inspected with care.', '/products/used', 'bg-[#eaf7f4]'],
            ['Best Deals', 'Limited prices worth grabbing.', '/deals', 'bg-[#fff1e8]'],
          ].map(([title, text, href, color]) => <Link key={title} to={href} className={`group rounded-[22px] p-6 ${color} transition-transform hover:-translate-y-1`}><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">KANHAIYA MOBILE</p><h3 className="mt-12 text-xl font-black">{title}</h3><p className="mt-2 max-w-xs text-sm text-slate-600">{text}</p><ArrowRight className="mt-5 text-slate-500 transition-transform group-hover:translate-x-1" size={20} /></Link>)}
        </div>
      </section>

      {error && <p className="text-red-600">{error}</p>}

      <section>
        <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Handpicked for you</p><h2 className="mt-2 text-3xl font-black">Featured phones</h2><p className="mt-2 text-sm text-slate-500">Devices worth your attention.</p></div><Link to="/products" className="flex items-center gap-1 text-sm font-bold text-premium-accent">View all <ArrowRight size={16} /></Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(featured.length ? featured : products.slice(0, 4)).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {!products.length && !error && <p className="text-gray-500">No products yet.</p>}
      </section>
    </div>
  );
};

export default Home;
