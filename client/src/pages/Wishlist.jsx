import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/wishlist')
      .then((res) => setItems(res.data.wishlist || []))
      .catch(() => setError('Could not load wishlist'));
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Saved for later</p><h1 className="mt-2 text-4xl font-black">My wishlist</h1><p className="mt-2 text-sm text-slate-500">Keep the phones you love close.</p></div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!items.length && !error && <div className="surface col-span-full rounded-[28px] py-16 text-center"><p className="font-black">No saved phones yet</p><p className="mt-1 text-sm text-slate-500">Tap the heart on a product to keep it here.</p></div>}
    </div>
  );
};

export default Wishlist;
