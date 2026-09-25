import { Heart, ShoppingCart } from 'lucide-react';
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
  const hasDiscount = product.originalPrice > product.price;
  const productImage = product.images?.[0] || fallbackPhoneImage;

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
    <article className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] sm:rounded-[20px]">
      <div className="absolute left-2 top-2 z-10 sm:left-4 sm:top-4">
        <span
          className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.12em] ${
            product.type === 'new' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {product.type === 'new' ? 'Brand New' : `Used - ${product.condition?.grade || 'Good'}`}
        </span>
      </div>

      <Link to={`/product/${product._id}`} className="flex h-[130px] w-full items-center justify-center overflow-hidden bg-[#f4f5f8] p-1.5 sm:aspect-[1.05] sm:h-auto sm:p-5">
        <img
          src={productImage}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-2 sm:p-5">
        <div className="flex items-start justify-between gap-1 sm:gap-3">
          <div className="min-w-0">
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-1 sm:text-xs sm:tracking-[0.12em]">{product.brand}</p>
            <h3 className="truncate text-xs font-black text-slate-900 sm:text-base">{product.title}</h3>
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

        <div className="mb-2 mt-2 flex items-baseline gap-1 sm:mb-4 sm:mt-4 sm:gap-2">
          <span className="text-base font-semibold text-slate-900 sm:text-xl sm:font-black">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[9px] text-slate-400 line-through sm:text-xs">
              ₹{Number(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>

        {cartMessage && (
          <p className="mb-1 text-[10px] font-bold text-emerald-600 sm:mb-3 sm:text-xs" aria-live="polite">
            {cartMessage}
          </p>
        )}

        <div className="flex gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-premium-900 px-1 py-1.5 text-[11px] font-bold text-white hover:bg-premium-800 sm:min-h-10 sm:gap-2 sm:rounded-xl sm:px-2 sm:py-2.5 sm:text-sm"
          >
            <ShoppingCart size={16} className="h-3.5 w-3.5 shrink-0 sm:h-[18px] sm:w-[18px]" />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
