import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import BannerCarousel from '../components/layout/BannerCarousel';

const priceRanges = [
  { value: 'under-5000', label: 'Under ₹5,000' },
  { value: '5000-10000', label: '₹5,000 – ₹10,000' },
  { value: '10000-20000', label: '₹10,000 – ₹20,000' },
  { value: '20000-30000', label: '₹20,000 – ₹30,000' },
  { value: '30000-50000', label: '₹30,000 – ₹50,000' },
  { value: '50000-80000', label: '₹50,000 – ₹80,000' },
  { value: '80000-plus', label: '₹80,000+' },
];

const Products = () => {
  const { type } = useParams();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [error, setError] = useState('');
  const q = params.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(q);

  const apiType = type === 'used' ? 'second_hand' : type === 'new' ? 'new' : '';

  useEffect(() => {
    const query = new URLSearchParams();
    if (apiType) query.set('type', apiType);
    if (sort) query.set('sort', sort);
    api
      .get(`/products?${query.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch((error) => {
        console.error('[Products page] Could not load products', {
          requestedUrl: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
          status: error.response?.status,
          backendResponse: error.response?.data,
          message: error.message,
        });
        setError('Could not load products.');
      });
  }, [apiType, sort]);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = products;
    if (priceRange) {
      list = list.filter((product) => {
        const price = Number(product.price);
        if (!Number.isFinite(price)) return false;
        if (priceRange === 'under-5000') return price < 5000;
        if (priceRange === '5000-10000') return price >= 5000 && price <= 10000;
        if (priceRange === '10000-20000') return price > 10000 && price <= 20000;
        if (priceRange === '20000-30000') return price > 20000 && price <= 30000;
        if (priceRange === '30000-50000') return price > 30000 && price <= 50000;
        if (priceRange === '50000-80000') return price > 50000 && price <= 80000;
        return price >= 80000;
      });
    }
    if (searchQuery.trim()) {
      const term = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          String(p.title || '').toLowerCase().includes(term) ||
          String(p.brand || '').toLowerCase().includes(term) ||
          String(p.model || '').toLowerCase().includes(term) ||
          String(p.category || '').toLowerCase().includes(term)
      );
    }
    return list;
  }, [products, priceRange, searchQuery]);

  const heading = type === 'new'
    ? 'New phones'
    : type === 'used'
      ? 'Second-hand phones'
      : q
        ? `Results for “${q}”`
        : 'All phones';

  return (
    <div className="space-y-8">
      <div className="w-full px-3 pt-3 pb-3 sm:hidden">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex h-11 w-full items-center rounded-full border border-slate-200 bg-white px-3 shadow-sm"
        >
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search mobiles..."
            aria-label="Search mobiles"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex h-7 w-7 shrink-0 items-center justify-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </form>
      </div>
      {type === 'new' && (
        <div className="sm:-mx-6 sm:-mt-8 sm:mb-8 lg:-mx-8">
          <BannerCarousel />
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Explore the collection</p><h1 className="mt-2 text-4xl font-black">{heading}</h1><p className="mt-2 text-sm text-slate-500">Compare carefully selected phones, all in one place.</p></div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            aria-label="Filter by price"
            className={`min-w-0 flex-1 rounded-full border px-3 py-2.5 text-xs font-bold shadow-sm sm:flex-none sm:px-4 sm:text-sm ${priceRange ? 'border-premium-accent bg-premium-lilac text-premium-900' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            <option value="">All Prices</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 shadow-sm sm:flex-none sm:px-4 sm:text-sm"
          >
            <option value="">Newest</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!filtered.length && !error && <p className="text-gray-500">No phones found.</p>}
    </div>
  );
};

export default Products;
