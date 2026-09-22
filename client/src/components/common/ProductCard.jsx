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
    <article className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
      <div className="absolute left-4 top-4 z-10">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
            product.type === 'new' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {product.type === 'new' ? 'Brand New' : `Used - ${product.condition?.grade || 'Good'}`}
        </span>
      </div>

      <Link to={`/product/${product._id}`} className="block aspect-[1.05] overflow-hidden bg-[#f4f5f8] p-5">
        <img
          src={productImage}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{product.brand}</p>
            <h3 className="truncate text-base font-black text-slate-900">{product.title}</h3>
          </div>
          <button
            type="button"
            onClick={toggleWishlist}
            className={`shrink-0 rounded-full border p-2 transition-colors ${liked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500'}`}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="mb-4 mt-4 flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              ₹{Number(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>

        {cartMessage && (
          <p className="mb-3 text-xs font-bold text-emerald-600" aria-live="polite">
            {cartMessage}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-premium-900 py-2.5 text-sm font-bold text-white hover:bg-premium-800"
          >
            <ShoppingCart size={18} className="shrink-0" />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
