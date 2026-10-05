import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
import BannerCarousel from '../components/layout/BannerCarousel';

const Products = ({ dealsOnly = false }) => {
  const { type } = useParams();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const q = params.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(q);

  const apiType = type === 'used' ? 'second_hand' : type === 'new' ? 'new' : '';

  useEffect(() => {
    let isCurrentRequest = true;
    const query = new URLSearchParams();
    if (apiType) query.set('type', apiType);
    if (sort) query.set('sort', sort);

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(`/products?${query.toString()}`);
        if (isCurrentRequest) setProducts(res.data.products || []);
      } catch (requestError) {
        console.error('[Products page] Could not load products', {
          requestedUrl: `${requestError.config?.baseURL || ''}${requestError.config?.url || ''}`,
          status: requestError.response?.status,
          backendResponse: requestError.response?.data,
          message: requestError.message,
        });
        if (isCurrentRequest) setError('Unable to load phones. Please try again.');
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isCurrentRequest = false;
    };
  }, [apiType, sort, retryCount]);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = products;
    if (dealsOnly) list = list.filter((p) => p.originalPrice > p.price);
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
  }, [products, dealsOnly, searchQuery]);

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
      {error && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-red-600" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-full border border-red-200 bg-white px-4 py-2 font-bold text-red-700 hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
          : filtered.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
      {!loading && !filtered.length && !error && <p className="text-gray-500">No phones found.</p>}
    </div>
  );
};

export default Products;
