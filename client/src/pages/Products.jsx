import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import BannerCarousel from '../components/layout/BannerCarousel';

const Products = ({ dealsOnly = false }) => {
  const { type } = useParams();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [error, setError] = useState('');
  const q = params.get('q') || '';

  const apiType = type === 'used' ? 'second_hand' : type === 'new' ? 'new' : '';

  useEffect(() => {
    const query = new URLSearchParams();
    if (apiType) query.set('type', apiType);
    if (sort) query.set('sort', sort);
    api
      .get(`/products?${query.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setError('Could not load products.'));
  }, [apiType, sort]);

  const filtered = useMemo(() => {
    let list = products;
    if (dealsOnly) list = list.filter((p) => p.originalPrice > p.price);
    if (q) {
      const term = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.model.toLowerCase().includes(term)
      );
    }
    return list;
  }, [products, dealsOnly, q]);

  const heading = dealsOnly
    ? 'Best deals'
    : type === 'new'
      ? 'New phones'
      : type === 'used'
        ? 'Second-hand phones'
        : q
          ? `Results for “${q}”`
          : 'All phones';

  return (
    <div className="space-y-8">
      {type === 'new' && (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-8">
          <BannerCarousel />
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Explore the collection</p><h1 className="mt-2 text-4xl font-black">{heading}</h1><p className="mt-2 text-sm text-slate-500">Compare carefully selected phones, all in one place.</p></div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm"
        >
          <option value="">Newest</option>
          <option value="price_low">Price: low to high</option>
          <option value="price_high">Price: high to low</option>
        </select>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!filtered.length && !error && <p className="text-gray-500">No phones found.</p>}
    </div>
  );
};

export default Products;
