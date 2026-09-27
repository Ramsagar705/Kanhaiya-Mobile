import { ArrowUpRight, Heart, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const fallbackPhoneImage =
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const price = Number(product.price);
  const originalPrice = Number(product.originalPrice);
  const hasDiscount = Number.isFinite(originalPrice) && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isInStock = Number(product.stock) > 0;
  const specifications = product.specifications || {};
  const additionalSpecifications = Object.entries(specifications)
    .filter(([key, value]) => !['ram', 'storage'].includes(key) && value !== false && value != null && value !== '')
    .map(([key, value]) => key === 'is5G' ? '5G' : value === true ? key : String(value));
  const specificationSummary = [
    specifications.ram,
    specifications.storage,
    ...additionalSpecifications,
  ].filter(Boolean).slice(0, 4).join(' · ') || product.model || 'Specifications unavailable';
  const productImage = product.images?.[0] || product.image || fallbackPhoneImage;

  useEffect(() => {
    if (!cartMessage) return;

    const timer = setTimeout(() => setCartMessage(''), 2000);
    return () => clearTimeout(timer);
  }, [cartMessage]);

  const handleAddToCart = () => {
    addToCart(product);
    setCartMessage('Added to cart successfully');
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (liked) {
        await api.delete(`/wishlist/${product._id}`);
        setLiked(false);
      } else {
        await api.post('/wishlist/add', { productId: product._id });
        setLiked(true);
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] sm:rounded-[20px]">
      <div className="absolute left-2 top-2 z-10 sm:left-4 sm:top-4">
        <span
          className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.12em] ${
            product.type === 'new' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {product.type === 'new' ? 'Brand New' : `Used - ${product.condition?.grade || 'Good'}`}
        </span>
      </div>

      <Link to={`/product/${product._id}`} className="flex h-32.5 w-full shrink-0 items-center justify-center overflow-hidden bg-[#f4f5f8] p-1.5 sm:h-55 sm:p-5">
        <img
          src={productImage}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-2 sm:p-5">
        <div className="flex items-start justify-between gap-1 sm:gap-3">
          <div className="min-h-13 min-w-0 sm:min-h-16">
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-1 sm:text-xs sm:tracking-[0.12em]">{product.brand}</p>
            <h3 className="line-clamp-2 text-xs font-black leading-5 text-slate-900 sm:text-base">{product.title}</h3>
          </div>
          <button
            type="button"
            onClick={toggleWishlist}
            className={`shrink-0 rounded-full border p-1 transition-colors sm:p-2 ${liked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500'}`}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="mb-2 mt-2 flex min-h-6 flex-wrap items-baseline gap-x-1 gap-y-0.5 sm:mb-3 sm:mt-4 sm:gap-x-2">
          <span className="text-base font-semibold text-slate-900 sm:text-xl sm:font-black">
            ₹{Number.isFinite(price) ? price.toLocaleString('en-IN') : '0'}
          </span>
          {hasDiscount && (
            <span className="text-[9px] text-slate-400 line-through sm:text-xs">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[9px] font-bold text-emerald-700 sm:text-xs">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        <p className="line-clamp-2 min-h-8 text-[10px] leading-4 text-slate-500 sm:min-h-10 sm:text-xs sm:leading-5" title={specificationSummary}>
          {specificationSummary}
        </p>
        <p className={`mt-1 min-h-4 text-[10px] font-semibold sm:text-xs ${isInStock ? 'text-emerald-600' : 'text-red-600'}`}>
          {isInStock ? 'In stock' : 'Out of stock'}
        </p>

        <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-premium-900 px-1 py-1.5 text-[11px] font-bold text-white hover:bg-premium-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10 sm:gap-2 sm:rounded-xl sm:px-2 sm:py-2.5 sm:text-sm"
          >
            <ShoppingCart size={16} className="h-3.5 w-3.5 shrink-0 sm:h-4.5 sm:w-4.5" />
            <span>Add To Cart</span>
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex min-h-8 w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:min-h-9 sm:text-xs"
          >
            View details
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <p className="min-h-4 text-center text-[10px] font-bold text-emerald-600 sm:text-xs" aria-live="polite">
            {cartMessage}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
